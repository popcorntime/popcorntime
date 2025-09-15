#[cfg(target_os = "windows")]
#[path = "windows/mod.rs"]
mod platform;
#[cfg(target_os = "linux")]
#[path = "linux/mod.rs"]
mod platform;
#[cfg(target_os = "macos")]
#[path = "macos/mod.rs"]
mod platform;

#[cfg(all(
  not(target_os = "windows"),
  not(target_os = "linux"),
  not(target_os = "macos"),
))]
compile_error!("The platform you're compiling for is not supported by ontop");
