import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'http://localhost:5054/User';

axios.defaults.withCredentials = true;
interface LoginRequest {
Email: string;
password: string;
}
interface RegisterRequest {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
}

export const registerUser = async (registerData: RegisterRequest) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, registerData);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const { message, error: details } = error.response.data;
        throw new Error(`${message}: ${details}`);
      } else if (error.request) {
        throw new Error("No response from server.");
      } else {
        throw new Error(error.message || "Request setup error.");
      }
    } else {
      throw new Error("Unknown error during registration.");
    }
  }
};

export const loginUser = async (loginData: LoginRequest) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, loginData);
    return response.data;  // This will contain the message returned by your API
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Handle the error if it's an AxiosError
      if (error.response) {
        // If the API responds with an error (response exists)
        throw new Error(error.response.data.Message || "Something went wrong.");
      } else if (error.request) {
        // If the request was made but no response was received
        throw new Error("No response received from server.");
      } else {
        // If the error happened in setting up the request
        throw new Error(error.message || "An error occurred while making the request.");
      }
    } else {
      // If it's not an AxiosError, handle it as a generic unknown error
      throw new Error("An unknown error occurred. Please try again later.");
    }
  }
};
