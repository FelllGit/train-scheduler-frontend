import { useQuery } from "@tanstack/react-query";
import { fetchJwt } from "@/services/getJWT";
import { Train } from "@/interfaces/train";

const getTrain = async (name?: string): Promise<Train[]> => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const jwt = await fetchJwt();

  if (!jwt) {
    throw new Error("JWT not found");
  }

  const url = new URL(`${backendUrl}/trains`);

  if (name) url.searchParams.set("name", name);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.json();
    throw new Error(
      errorMessage.message || "Unknown error while fetching data"
    );
  }

  return response.json();
};

export const useGetTrain = (name?: string) => {
  return useQuery({
    // eslint-disable-next-line no-restricted-syntax
    queryKey: ["trains"],
    queryFn: () => getTrain(name),
  });
};
