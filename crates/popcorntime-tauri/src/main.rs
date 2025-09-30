#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use anyhow::Context;
use popcorntime_error::Code;
use popcorntime_graphql_client::client::ApiClient;
use popcorntime_session::{AuthorizationService, SessionUpdateEvent};
use popcorntime_tauri::event::{SessionServerReady, SessionUpdate};
#[cfg(debug_assertions)]
use specta_typescript::Typescript;
use tauri::Manager;
use tauri_plugin_deep_link::DeepLinkExt;
use tauri_plugin_log::{Target, TargetKind};
use tauri_specta::{collect_commands, collect_events, Event};

fn main() {
  let builder = tauri_specta::Builder::<tauri::Wry>::new()
    .commands(collect_commands![
      popcorntime_tauri::graphql::search_medias,
      popcorntime_tauri::graphql::user_preferences,
      popcorntime_tauri::graphql::update_user_preferences,
      popcorntime_tauri::graphql::media,
      popcorntime_tauri::graphql::providers,
      popcorntime_tauri::graphql::set_favorites_provider,
      popcorntime_tauri::graphql::set_media_reaction,
      popcorntime_tauri::window::show_main_window,
      popcorntime_tauri::session::is_onboarded,
      popcorntime_tauri::session::set_onboarded,
      popcorntime_tauri::session::validate,
      popcorntime_tauri::session::logout,
      popcorntime_tauri::session::initialize_session_authorization,
    ])
    .events(collect_events![SessionServerReady, SessionUpdate]);

  #[cfg(debug_assertions)]
  builder
    .export(
      Typescript::default()
        .header("// @ts-nocheck\n\n")
        .formatter(specta_typescript::formatter::biome)
        // year and IDs are safe for number
        .bigint(specta_typescript::BigIntExportBehavior::Number),
      "./apps/desktop/src/tauri/types.ts",
    )
    .expect("Failed to export typescript bindings");

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
        .invoke_handler(builder.invoke_handler())
        .setup(move |app| {
          let app_handle = app.handle();
          builder.mount_events(app_handle);

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

          let auth_service =
            AuthorizationService::new(&config_dir, app_handle.config().identifier.as_str())?;
          app_handle.manage(ApiClient::new(auth_service.try_access_token())?);

          let app_handle_isolated = app_handle.clone();
          auth_service.on_access_token_update(
            move |SessionUpdateEvent { access_token, .. }| {
              // update api client access token
              let api_client = app_handle_isolated.state::<ApiClient>();
              if let Err(err) = api_client.update_access_token(access_token) {
                tracing::error!("Failed to update api client access_token: {:?}", err);
              }

              // signal frontend
              SessionUpdate
                .emit(&app_handle_isolated)
                .context(Code::InvalidEvent)
            },
          )?;

          let app_handle_isolated = app_handle.clone();
          app.deep_link().on_open_url(move |event| {
            tracing::info!(
              id = %event.id(),
              urls = ?event.urls(),
              "Deep link URL received"
            );
            // FIXME: ideally we would have a more specific event - handling URLs
            // let's trigger a session update to let the frontend know something happened
            SessionUpdate.emit(&app_handle_isolated).ok();
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
        .build(tauri::generate_context!())
        .expect("valid app")
        .run(|_app_handle, event| {
          if let tauri::RunEvent::Ready = event {
            tracing::info!("Popcorn Time is ready!");
          }
        });
    });
}
