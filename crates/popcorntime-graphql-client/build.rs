fn main() {
  cynic_codegen::register_schema("popcorntime")
    .from_sdl_file("gql/schema.graphql")
    .unwrap()
    .as_default()
    .unwrap();
}
