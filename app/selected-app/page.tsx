/*"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { initiateAuthorization } from "../services/auth-service";
import { fetchClientById } from "../services/client-service";
import { ClientResponse } from "../services/client-service";
import { Suspense } from "react";
export default function SelectedAppPage() {
  const searchParams = useSearchParams();

  const clientId = searchParams.get("clientId");
  const [client, setClient] = useState<ClientResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (clientId) {
      const fetchClient = async () => {
        try {
          const clientData = await fetchClientById(clientId);
          setClient(clientData);

          setLoading(false);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Something went wrong."
          );
          setLoading(false);
        }
      };
      fetchClient();
    }
  }, [clientId]);

  const [authorizationResult, setAuthorizationResult] = useState<any>(null);

  const handleSSOLogin = async () => {
    if (!clientId || !client?.redirect_uri || !client?.allowed_scopes) {
      setError("Missing parameters for authorization.");
      return;
    }

    const redirectUri = client.redirect_uri;
    const scope = client.allowed_scopes.join(" ");

    try {
      const result = await initiateAuthorization({
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: scope,
      });

      console.log("Authorization result:", result);

      if (!result.isAuthenticated) {
        const query = new URLSearchParams({
          clientId: clientId,
          redirect_uri: redirectUri,
          scope: scope,
        }).toString();

        window.location.href = `/sso-login?${query}`;
        return;
      }

      setAuthorizationResult(result);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Suspense fallback={<div className="p-8">Loading…</div>}>
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        {client?.logoUrl ? (
          <img
            src={client.logoUrl}
            alt={client.client_name}
            className="w-28 h-28 rounded-full object-cover border border-gray-300 shadow mb-4"
          />
        ) : (
          <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-3xl text-gray-500 mb-4">
            ?
          </div>
        )}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {client?.client_name}
        </h1>
        <p className="text-gray-600 text-center text-lg max-w-md mb-4">
          This application requires you to sign in using{" "}
          <span className="text-indigo-600 font-medium">
            Single Sign-On (SSO)
          </span>
          .
        </p>
        <button
          onClick={handleSSOLogin}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition"
        >
          Single Sign-On
        </button>

        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </Suspense>
  );
}
*/

import { Suspense } from "react";
import SelectedAppClient from "./SelectedAppClient";

export const dynamic = "force-dynamic"; // skip pre‑render/ISR

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8">Loading…</div>}>
      <SelectedAppClient />
    </Suspense>
  );
}
