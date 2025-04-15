import axios, { AxiosError } from 'axios';

axios.defaults.withCredentials = true;

const API_URL = 'http://localhost:5054/Client'; // Adjust base URL as necessary

export interface ClientResponse {
  clientId: string;
  client_name: string;
  redirect_uri: string;
  domain: string;
  allowed_scopes: string[];
  logoUrl: string | null;
}

// Fetch all clients (already existing function)
export const fetchAllClients = async (): Promise<ClientResponse[]> => {
  try {
    const response = await axios.get<ClientResponse[]>(`${API_URL}/AllClients`);
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

// New function to fetch a single client by its clientId
export const fetchClientById = async (clientId: string): Promise<ClientResponse> => {
  try {
    const response = await axios.get(`${API_URL}/GetClientByClientId/${clientId}`);
    const data = response.data;

    // Normalize property names from backend to match your frontend expectations
    return {
      clientId: data.clientId,
      client_name: data.client_name,
      redirect_uri: data.redirect_Uri,       
      domain: data.domain,
      allowed_scopes: data.allowed_Scopes,   
      logoUrl: data.logoUrl ?? null
    };
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

