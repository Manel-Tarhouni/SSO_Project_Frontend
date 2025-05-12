import { fetchAllClients } from "../services/client-service";
import Image from "next/image";
import Link from "next/link";

export default async function ClientList() {
  try {
    const clients = await fetchAllClients();

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-xl font-semibold text-gray-600 text-center mb-6">
          Select an application
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {clients.map((client) => (
            <Link
              key={client.clientId}
              href={`/selected-app?clientId=${encodeURIComponent(
                client.clientId
              )}`}
              className="flex flex-col items-center p-6 bg-white rounded-2xl shadow hover:shadow-lg transition-shadow duration-200 border hover:border-indigo-500"
            >
              {client.logoUrl ? (
                <Image
                  src={client.logoUrl}
                  alt={client.client_name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover mb-4 border border-gray-200"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-4 text-gray-500 text-xl">
                  ?
                </div>
              )}
              <h2 className="text-center text-lg font-medium text-gray-700">
                {client.client_name}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    );
  } catch (error: any) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-red-600 text-center">
          {error.message || "Failed to load clients."}
        </p>
      </div>
    );
  }
}
