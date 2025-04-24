const AUTH_URL = "http://localhost:5054/OAuth/authorize";

export interface InitiateAuthorizationRequest {
  client_id: string;
  scope: string;
  redirect_uri: string;
  response_type?: string;
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
  const params = new URLSearchParams({
    client_id: request.client_id,
    scope: request.scope,
    redirect_uri: request.redirect_uri,
    response_type: request.response_type || "code",
  });

  try {
    const res = await fetch(`${AUTH_URL}?${params.toString()}`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error_description || "Something went wrong.");
    }

    return await res.json();
  } catch (error) {
    console.error("Initiate authorization failed:", error);
    throw error;
  }
};

export const postAuthorize = async (
  postAuthorizeRequest: PostAuthorizeRequest
) => {
  const formData = new URLSearchParams();
  formData.append("client_id", postAuthorizeRequest.client_id);
  formData.append("redirect_uri", postAuthorizeRequest.redirect_uri);
  formData.append("scope", postAuthorizeRequest.scope);
  formData.append("Email", postAuthorizeRequest.Email);
  formData.append("password", postAuthorizeRequest.password);

  try {
    const res = await fetch("http://localhost:5054/OAuth/authorize", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
      credentials: "include",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error_description || "Authorization failed.");
    }

    return await res.json();
  } catch (error) {
    console.error("Authorization failed:", error);
    throw error;
  }
};
