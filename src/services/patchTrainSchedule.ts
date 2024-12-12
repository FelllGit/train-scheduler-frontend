import { fetchJwt } from "@/services/getJWT";

export const patchTrainSchedule = async (
  id: number,
  from?: string,
  to?: string,
  scheduledDate?: string,
  arrivalTime?: string,
  trainId?: number
) => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const jwt = await fetchJwt();

  if (!jwt) {
    throw new Error("JWT not found");
  }

  const url = new URL(`${backendUrl}/trains-schedules/${id}`);

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      from,
      to,
      scheduledDate,
      arrivalTime,
      trainId,
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
