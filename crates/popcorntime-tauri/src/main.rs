#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use popcorntime_graphql_client::client::ApiClient;
use popcorntime_session::AuthorizationService;
use popcorntime_tauri::event::FrontendEvent;
use tauri::Manager;
use tauri_plugin_deep_link::DeepLinkExt;
use tauri_plugin_log::{Target, TargetKind};

fn main() {
  tokio::runtime::Builder::new_multi_thread()
    .enable_all()
    .build()
    .expect("valid runtime")
    .block_on(async {
      tauri::async_runtime::set(tokio::runtime::Handle::current());
      let log_plugin = tauri_plugin_log::Builder::default()
        .target(Target::new(TargetKind::LogDir {
          file_name: Some("PopcornTime.frontend".to_string()),
        }))
        .level(log::LevelFilter::Error)
        .build();

      tauri::Builder::default()
        .setup(|app| {
          let app_handle = app.handle();

          // initialize window
          if let Err(err) = popcorntime_tauri::window::create_main(app_handle, "/index.html") {
            tracing::error!("Failed to create window: {:?}", err);
          }

          // initialize logs
          popcorntime_tauri::logs::init(app_handle);
          popcorntime_tauri::capabilities::setup(app_handle)?;

          // intialize directories
          let (app_data_dir, app_cache_dir, config_dir) = {
            let paths = app_handle.path();
            (
              paths.app_data_dir().expect("missing app data dir"),
              paths.app_cache_dir().expect("missing app cache dir"),
              paths.config_dir().expect("missing config dir"),
            )
          };

          std::fs::create_dir_all(&app_data_dir).expect("failed to create app data dir");
          std::fs::create_dir_all(&app_cache_dir).expect("failed to create cache dir");
          let config_dir = config_dir.join(app_handle.config().identifier.as_str());
          std::fs::create_dir_all(&config_dir).expect("failed to create config dir");

          tracing::info!(version = %app_handle.package_info().version,
                                   name = %app_handle.package_info().name, "starting app");

          let auth_service = AuthorizationService::new(&config_dir)?;

          // initialize default API client
          app_handle.manage(ApiClient::new(None)?);

          // watch config in background
          auth_service.watch_config_in_background({
            let app_handle = app_handle.clone();
            move |app_settings| {
              let api_client = app_handle.state::<ApiClient>();
              match api_client.update_access_token(app_settings.access_token.clone()) {
                Ok(_) => {
                  tracing::debug!("[ApiClient] Access token updated");
                }
                Err(err) => {
                  tracing::error!("[ApiClient] Failed to update access token: {:?}", err);
                }
              }
              // send frontend event
              popcorntime_tauri::event::FrontendEvent::from(app_settings).send(&app_handle)
            }
          })?;

          let app_handle_isolated = app_handle.clone();
          app.deep_link().on_open_url(move |event| {
            FrontendEvent::from(event).send(&app_handle_isolated).ok();
          });

          app_handle.manage(auth_service);

          Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_single_instance::init(|app, _argv, _cwd| {
          if let Some(window) = app.get_webview_window(popcorntime_tauri::window::MAIN_WINDOW_LABEL)
          {
            window.show().ok();
            window.set_focus().ok();
          }
        }))
        .plugin(log_plugin)
        .invoke_handler(tauri::generate_handler![
          popcorntime_tauri::window::show_main_window,
          popcorntime_tauri::graphql::search_medias,
          popcorntime_tauri::graphql::user_preferences,
          popcorntime_tauri::graphql::update_user_preferences,
          popcorntime_tauri::graphql::media,
          popcorntime_tauri::graphql::providers,
          popcorntime_tauri::session::settings,
          popcorntime_tauri::session::set_onboarded,
          popcorntime_tauri::session::set_analytics_enabled,
          popcorntime_tauri::session::validate,
          popcorntime_tauri::session::logout,
          popcorntime_tauri::session::initialize_session_authorization,
          popcorntime_tauri::graphql::add_favorites_provider,
          popcorntime_tauri::graphql::remove_favorites_provider
        ])
        .build(tauri::generate_context!())
        .expect("valid app")
        .run(|_app_handle, event| {
          if let tauri::RunEvent::Ready = event {
            tracing::info!("Popcorn Time is ready!");
          }
        });
    });
}
