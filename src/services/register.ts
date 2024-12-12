export const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const url = new URL(`${backendUrl}/users`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      password,
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
