import { TrainSchedule } from "@/interfaces/train-schedule";
import { useQuery } from "@tanstack/react-query";
import { fetchJwt } from "@/services/getJWT";

const getTrainSchedule = async (
  from?: string,
  to?: string,
  scheduledDate?: string,
  trainId?: number
): Promise<TrainSchedule[]> => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const jwt = await fetchJwt();

  if (!jwt) {
    throw new Error("JWT not found");
  }

  console.log(jwt);

  const url = new URL(`${backendUrl}/trains-schedules`);

  if (from) url.searchParams.set("from", from);
  if (to) url.searchParams.set("to", to);
  if (scheduledDate) url.searchParams.set("scheduledDate", scheduledDate);
  if (trainId) url.searchParams.set("trainId", trainId.toString());

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

export const useGetTrainSchedule = (
  from?: string,
  to?: string,
  scheduledDate?: string,
  trainId?: number
) => {
  return useQuery({
    // eslint-disable-next-line no-restricted-syntax
    queryKey: ["train-schedule"],
    queryFn: () => getTrainSchedule(from, to, scheduledDate, trainId),
  });
};
