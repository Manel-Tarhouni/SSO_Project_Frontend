import SSOLogin from "./SSOLogin";

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
}
