import axios, { AxiosError } from 'axios';

axios.defaults.withCredentials = true;

const AUTH_URL = 'http://localhost:5054/OAuth/authorize';

export interface InitiateAuthorizationRequest {
  client_id: string;
  scope: string;
  redirect_uri: string;
  response_type?: string; // optional, defaults to "code"
}
export interface PostAuthorizeRequest {
    client_id: string;
    redirect_uri: string;
    scope: string;
    Email: string;
    password: string;
  }
export const initiateAuthorization = async (
  request: InitiateAuthorizationRequest
): Promise<any> => {
  try {
    const params = new URLSearchParams({
      client_id: request.client_id,
      scope: request.scope,
      redirect_uri: request.redirect_uri,
      response_type: request.response_type || 'code'
    });

    const response = await axios.get(`${AUTH_URL}?${params.toString()}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(error.response.data?.error_description || "Something went wrong.");
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


export const postAuthorize = async (postAuthorizeRequest: PostAuthorizeRequest) => {
    try {
      const formData = new URLSearchParams();
      formData.append("client_id", postAuthorizeRequest.client_id);
      formData.append("redirect_uri", postAuthorizeRequest.redirect_uri);
      formData.append("scope", postAuthorizeRequest.scope);
      formData.append("Email", postAuthorizeRequest.Email);
      formData.append("password", postAuthorizeRequest.password);
  
      const response = await axios.post("http://localhost:5054/OAuth/authorize", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
  
      return response.data;
    } catch (error) {
      console.error("Authorization failed:", error);
      throw error;
    }
  };
  
