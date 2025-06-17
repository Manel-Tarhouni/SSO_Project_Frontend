/*import SSOLogin from "./SSOLogin";

interface PageProps {
  searchParams: {
    clientId?: string;
    redirect_uri?: string;
    scope?: string;
  };
}

export default async function Page({ searchParams }: PageProps) {
  const client_id = searchParams.clientId ?? "";
  const redirect_uri = searchParams.redirect_uri ?? "";
  const scope = searchParams.scope ?? "";

  return (
    <SSOLogin client_id={client_id} redirect_uri={redirect_uri} scope={scope} />
  );
}*/
import SSOLogin from "./SSOLogin";

interface SearchParams {
  clientId?: string;
  redirect_uri?: string;
  scope?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;

  const client_id = resolvedSearchParams.clientId ?? "";
  const redirect_uri = resolvedSearchParams.redirect_uri ?? "";
  const scope = resolvedSearchParams.scope ?? "";

  return (
    <SSOLogin client_id={client_id} redirect_uri={redirect_uri} scope={scope} />
  );
}
