const BASE_URL = "https://backend-eventbooking.onrender.com/api";
interface ApiProps {
  path: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
}

export const api = async ({
  path,
  method = "GET",
  body,
}: ApiProps) => {
  const token =localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
       Authorization:token? `Bearer ${token}`:""
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};