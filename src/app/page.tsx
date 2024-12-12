"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoveRight, RotateCcw } from "lucide-react";
import { DatePicker } from "@/components/ui/dataPicker";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetTrainSchedule } from "@/services/getTrainSchedule";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetTrain } from "@/services/getTrain";
import { useRouter } from "next/navigation";

interface TrainScheduleProps {
  from: string;
  to: string;
  scheduledDate: string;
  trainId: number;
}

export default function Home() {
  const router = useRouter();

  const [from, setFrom] = useState<string | undefined>("");
  const [to, setTo] = useState<string | undefined>("");
  const [scheduledDate, setScheduledDate] = useState<string | undefined>("");
  const [trainId, setTrainId] = useState<number | undefined>(0);

  const {
    data: trainScheduleData,
    isLoading,
    refetch,
    isRefetching,
  } = useGetTrainSchedule(from, to, scheduledDate, trainId);

  const { data: trainsData, isLoading: isTrainsLoading } = useGetTrain();

  const methods = useForm<TrainScheduleProps>({
    defaultValues: {
      from: "",
      to: "",
      scheduledDate: "",
      trainId: 0,
    },
  });

  const formatDate = (date: string | number | Date): string => {
    const d: Date = new Date(date);
    const yyyy: string = d.getFullYear().toString();
    const mm: string = (d.getMonth() + 1).toString().padStart(2, "0");
    const dd: string = d.getDate().toString().padStart(2, "0");
    const HH: string = d.getHours().toString().padStart(2, "0");
    const MM: string = d.getMinutes().toString().padStart(2, "0");
    return `${yyyy}.${mm}.${dd} ${HH}:${MM}`;
  };

  const formatDuration = (
    start: string | number | Date,
    end: string | number | Date
  ): string => {
    const diff: number = new Date(end).getTime() - new Date(start).getTime();
    const totalMinutes: number = Math.floor(diff / (1000 * 60));
    const hours: number = Math.floor(totalMinutes / 60);
    const minutes: number = totalMinutes % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  const swapData = (): void => {
    const currentFrom: string = methods.getValues("from");
    const currentTo: string = methods.getValues("to");
    methods.setValue("from", currentTo);
    methods.setValue("to", currentFrom);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "GET",
      });

      if (response.ok) {
        router.push("/auth");
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const onSubmit = (data: TrainScheduleProps) => {
    const { from, to, scheduledDate, trainId } = data;

    setFrom(from);
    setTo(to);
    setScheduledDate(scheduledDate);
    setTrainId(trainId);
  };

  useEffect(() => {
    refetch();
  }, [from, to, scheduledDate, trainId]);

  return (
    <div className="min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]">
      <div className="bg-[#7413dc] flex flex-wrap sm:gap-0 md:gap-4 items-center justify-center p-4">
        <div className="bg-white flex flex-col sm:flex-row gap-0 my-2 rounded-md overflow-hidden w-full sm:w-auto sm:h-40 md:h-fit">
          <Input
            placeholder="From"
            className="w-full sm:h-full md:h-auto sm:w-80 rounded-none border-none focus-visible:outline-none focus-visible:ring-0"
            {...methods.register("from")}
          />
          <div className="relative h-fit">
            <div className="absolute top-0 sm:top-[-7px] md:top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 md:translate-y-0">
              <Button
                className="bg-transparent p-0 m-0 shadow-transparent hover:bg-transparent"
                onClick={swapData}
              >
                <RotateCcw className="bg-white text-pink-600 scale-125" />
              </Button>
            </div>
          </div>
          <Input
            placeholder="To"
            className="w-full sm:h-full md:h-auto sm:w-80 rounded-none border-none focus-visible:outline-none focus-visible:ring-0"
            {...methods.register("to")}
          />
          <Select
            value={
              // eslint-disable-next-line no-restricted-syntax
              methods.watch("trainId")
                ? // eslint-disable-next-line no-restricted-syntax
                  methods.watch("trainId").toString()
                : ""
            }
            onValueChange={(val: string) => {
              methods.setValue("trainId", Number(val));
            }}
            disabled={isTrainsLoading}
          >
            <SelectTrigger className="w-full sm:h-full md:h-auto sm:w-80 rounded-none border-none focus-visible:outline-none focus-visible:ring-0">
              <SelectValue placeholder="Select Train" />
            </SelectTrigger>
            <SelectContent>
              {trainsData?.map((train) => (
                <SelectItem key={train.id} value={train.id.toString()}>
                  {train.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DatePicker
            className="!w-full md:!w-40 rounded-none border-none focus:border-none"
            value={
              // eslint-disable-next-line no-restricted-syntax
              methods.watch("scheduledDate")
                ? // eslint-disable-next-line no-restricted-syntax
                  new Date(methods.watch("scheduledDate"))
                : null
            }
            onSelect={(val?: Date | null) => {
              if (val) {
                methods.setValue("scheduledDate", val.toISOString());
              } else {
                methods.setValue("scheduledDate", "");
              }
            }}
          />
        </div>
        <Button
          variant="header"
          className="w-full sm:w-auto text-center sm:text-left"
          onClick={methods.handleSubmit(onSubmit)}
        >
          Search
        </Button>
        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <main className="py-4 px-4 grid gap-6 grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))]">
        {isLoading || isRefetching ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="w-full h-40 bg-gray-300 animate-pulse rounded-lg"
            ></Skeleton>
          ))
        ) : trainScheduleData ? (
          trainScheduleData.map((trainSchedule, index) => (
            <Card key={index} className="w-full">
              <CardContent className="py-2">
                <label className="flex flex-row gap-2 text-2xl items-center font-bold">
                  {trainSchedule.from} <MoveRight /> {trainSchedule.to}
                </label>
                <label>Train #{trainSchedule.train.name}</label>
                <Separator />
                <div className="flex flex-col py-2">
                  <label>
                    Scheduled Departure:{" "}
                    {formatDate(trainSchedule.scheduledDate)}
                  </label>
                  <label>
                    Estimated Arrival: {formatDate(trainSchedule.arrivalTime)}
                  </label>
                  <label>
                    Duration:{" "}
                    {formatDuration(
                      trainSchedule.scheduledDate,
                      trainSchedule.arrivalTime
                    )}
                  </label>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <span>No train schedules found</span>
        )}
      </main>
    </div>
  );
}
