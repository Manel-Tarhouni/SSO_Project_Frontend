import axios, { AxiosError } from 'axios';

axios.defaults.withCredentials = true;

const API_URL = 'http://localhost:5054/Client/AllClients'; // Adjust if hosted elsewhere

export interface ClientResponse {
  clientId: string;
  client_name: string;
  redirect_uri: string;
  domain: string;
  allowed_scopes: string[];
  logoUrl: string | null;
}

export const fetchAllClients = async (): Promise<ClientResponse[]> => {
  try {
    const response = await axios.get<ClientResponse[]>(API_URL);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(error.response.data.error_description || "Something went wrong.");
      } else if (error.request) {
        throw new Error("No response received from server.");
      } else {
        throw new Error(error.message || "Error setting up request.");
      }
    } else {
      throw new Error("Unknown error occurred.");
    }
  }
};
