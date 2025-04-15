"use client";
import { useEffect, useState } from 'react';
import { fetchAllClients, ClientResponse } from "../Services/ClientService";
import { useRouter } from 'next/navigation';

export default function ClientList() {
  const [clients, setClients] = useState<ClientResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchAllClients()
      .then(setClients)
      .catch((err) => setError(err.message));
  }, []);

  const handleClientClick = (client: ClientResponse) => {

    const clientId = encodeURIComponent(client.clientId);
    router.push(`/SelectedApp?clientId=${clientId}`);
  console.log(client.clientId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-xl font-semibold text-gray-600 text-center mb-6">
        Select an application
      </h1>

      {error && <p className="text-red-600 text-center">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {clients.map((client) => (
          <button
            key={client.clientId}
            className="flex flex-col items-center p-6 bg-white rounded-2xl shadow hover:shadow-lg transition-shadow duration-200 border hover:border-indigo-500 focus:outline-none"
            onClick={() => handleClientClick(client)}
          >
            {client.logoUrl ? (
              <img
                src={client.logoUrl}
                alt={client.client_name}
                className="w-20 h-20 rounded-full object-cover mb-4 border border-gray-200"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-4 text-gray-500 text-xl">
                ?
              </div>
            )}
            <h2 className="text-center text-lg font-medium text-gray-700">
              {client.client_name}
            </h2>
          </button>
        ))}
      </div>
    </div>
  );
}
