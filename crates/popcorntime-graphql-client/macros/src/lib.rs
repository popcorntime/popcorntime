use convert_case::{Case, Casing};
use proc_macro::TokenStream;
use quote::quote;
use syn::{
  Ident, LitStr, Token,
  parse::{Parse, ParseStream},
  parse_macro_input,
};

struct Args {
  name: Ident,
  _c1: Token![,],
  query: LitStr,
}

impl Parse for Args {
  fn parse(input: ParseStream) -> syn::Result<Self> {
    Ok(Self {
      name: input.parse()?,
      _c1: input.parse()?,
      query: input.parse()?,
    })
  }
}

#[proc_macro]
pub fn define_graphql_query(input: TokenStream) -> TokenStream {
  let Args { name, query, .. } = parse_macro_input!(input as Args);
  let module = Ident::new(&name.to_string().to_case(Case::Snake), name.span());

  TokenStream::from(quote! {
      #[derive(graphql_client::GraphQLQuery)]
      #[graphql(
          schema_path = "gql/schema.json",
          query_path  = #query,
          variables_derives = "Clone, Debug, Deserialize",
          response_derives  = "Debug, Serialize, Deserialize"
      )]
      pub struct #name;

      impl ApiClient {
          pub async fn #module(
              &self,
              vars: &#module::Variables,
          ) -> Result<Option<#module::ResponseData>> {
              let body = #name::build_query(vars.clone());
              let resp: graphql_client::Response<#module::ResponseData> =
                  self.query(&body, false).await.context(Code::GraphqlServerError)?;
              Ok(resp.data)
          }
      }
  })
}
