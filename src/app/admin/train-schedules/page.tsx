"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RotateCcw } from "lucide-react";
import { DatePicker } from "@/components/ui/dataPicker";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetTrainSchedule } from "@/services/getTrainSchedule";
import { useGetTrain } from "@/services/getTrain";
import { useForm } from "react-hook-form";
import { TrainScheduleCard } from "@/app/admin/train-schedules/trainScheduleCard";
import { CreateTrainScheduleCard } from "@/app/admin/train-schedules/createTrainScheduleCard";

interface TrainScheduleSearchProps {
  from: string;
  to: string;
  scheduledDate: string;
  trainId: number;
}

export default function AdminPage() {
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

  const methods = useForm<TrainScheduleSearchProps>({
    defaultValues: {
      from: "",
      to: "",
      scheduledDate: "",
      trainId: 0,
    },
  });

  const swapData = (): void => {
    const currentFrom: string = methods.getValues("from");
    const currentTo: string = methods.getValues("to");
    methods.setValue("from", currentTo);
    methods.setValue("to", currentFrom);
  };

  const onSubmit = (data: TrainScheduleSearchProps) => {
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
      <div className="bg-[#7413dc] flex flex-row flex-wrap sm:gap-0 md:gap-4 items-center justify-center px-4 py-6 first:">
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
      </div>
      <main className="py-4 px-4 grid gap-6 grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))]">
        {isLoading || isRefetching ? (
          <></>
        ) : (
          <>
            <CreateTrainScheduleCard trains={trainsData || []} />
            {trainScheduleData &&
              trainScheduleData.map((trainSchedule, index) => (
                <TrainScheduleCard
                  key={index}
                  trainSchedule={trainSchedule}
                  trains={trainsData || []}
                  index={index}
                />
              ))}
          </>
        )}
      </main>
    </div>
  );
}
