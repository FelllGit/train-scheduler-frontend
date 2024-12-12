export const fetchJwt = async (): Promise<string | null> => {
  const response = await fetch("/api/get-jwt", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    console.error("Failed to fetch JWT");
    return null;
  }

  const data = await response.json();
  return data.jwt;
};
