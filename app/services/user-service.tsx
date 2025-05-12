const API_BASE_URL = "http://localhost:5054/User";

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
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(registerData),
    });

    const data = await response.json();

    if (!response.ok) {
      const message = data.message || "Erreur inconnue";
      const details = data.error || "Détails non disponibles";
      throw new Error(`${message}: ${details}`);
    }

    return data;
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(error.message || "Erreur lors de l'inscription.");
    } else {
      throw new Error("Erreur inconnue lors de l'inscription.");
    }
  }
};

export const loginUser = async (loginData: LoginRequest) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    if (!response.ok) {
      const message = data.Message || "Erreur de connexion.";
      throw new Error(message);
    }

    return data;
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(error.message || "Erreur de requête.");
    } else {
      throw new Error("Une erreur inconnue s’est produite.");
    }
  }
};
