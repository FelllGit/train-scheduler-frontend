export const authenticate = async (
  email: string,
  password: string
): Promise<void> => {
  const response = await fetch("/api/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorMessage = await response.json();
    throw new Error(errorMessage.error || "Unknown error while authenticating");
  }
};
