import { fetchJwt } from "@/services/getJWT";

export const putTrain = async (id: number, name: string) => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const jwt = await fetchJwt();

  if (!jwt) {
    throw new Error("JWT not found");
  }

  const url = new URL(`${backendUrl}/trains/${id}`);

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      name,
    }),
  });

  if (!response.ok) {
    const errorMessage = await response.json();
    throw new Error(
      errorMessage.message || "Unknown error while fetching data"
    );
  }

  return response.json();
};
