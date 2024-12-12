"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MoveRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "@/components/ui/dataPicker";
import { Button } from "@/components/ui/button";
import React from "react";
import { TrainSchedule } from "@/interfaces/train-schedule";
import { Train } from "@/interfaces/train";
import { useForm } from "react-hook-form";
import { deleteTrainSchedule } from "@/services/deleteTrainSchedule";
import { patchTrainSchedule } from "@/services/patchTrainSchedule";
import { useQueryClient } from "@tanstack/react-query";

interface TrainScheduleCardProps {
  trainSchedule: TrainSchedule;
  trains: Train[];
  index: number;
}

interface TrainScheduleUpdateProps {
  from: string;
  to: string;
  scheduledDate: string;
  arrivalTime: string;
  trainId: number;
}

export const TrainScheduleCard: React.FC<TrainScheduleCardProps> = ({
  trainSchedule,
  trains,
  index,
}) => {
  const queryClient = useQueryClient();
  const methods = useForm<TrainScheduleUpdateProps>({
    defaultValues: {
      from: trainSchedule.from,
      to: trainSchedule.to,
      scheduledDate: trainSchedule.scheduledDate,
      arrivalTime: trainSchedule.arrivalTime,
      trainId: trainSchedule.train.id,
    },
  });

  const handleDeleteTrainSchedule = async (id: number) => {
    await deleteTrainSchedule(id);
    queryClient.invalidateQueries({ queryKey: ["train-schedule"] });
  };

  const handleUpdateTrainSchedule = async () => {
    const { from, to, scheduledDate, arrivalTime, trainId } =
      methods.getValues();
    await patchTrainSchedule(
      trainSchedule.id,
      from,
      to,
      scheduledDate,
      arrivalTime,
      trainId
    );
    queryClient.invalidateQueries({ queryKey: ["train-schedule"] });
  };

  return (
    <Card key={index} className="w-full">
      <CardContent className="py-2">
        <div className="flex flex-row justify-between items-center">
          <label className="flex flex-row gap-2 text-2xl items-center font-bold">
            <Input {...methods.register("from")} /> <MoveRight />{" "}
            <Input {...methods.register("to")} />
          </label>
        </div>
        <label className="w-full flex flex-row gap-2 items-center my-2">
          Train{" "}
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
          >
            <SelectTrigger className="w-full sm:h-full md:h-auto sm:w-80 rounded-none border-none focus-visible:outline-none focus-visible:ring-0">
              <SelectValue placeholder="Select Train" />
            </SelectTrigger>
            <SelectContent>
              {trains?.map((train) => (
                <SelectItem key={train.id} value={train.id.toString()}>
                  {train.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        <Separator />
        <div className="flex flex-col py-2 gap-2">
          <label>
            Scheduled Departure:{" "}
            <DatePicker
              extended
              className="w-16"
              value={
                methods.watch("scheduledDate")
                  ? new Date(methods.watch("scheduledDate"))
                  : null
              }
              onSelect={(val) => {
                if (val) {
                  methods.setValue("scheduledDate", val.toISOString());
                } else {
                  methods.setValue("scheduledDate", "");
                }
              }}
            />
          </label>
          <label>
            Estimated Arrival:{" "}
            <DatePicker
              extended
              className="w-16"
              value={
                methods.watch("arrivalTime")
                  ? new Date(methods.watch("arrivalTime"))
                  : null
              }
              onSelect={(val) => {
                if (val) {
                  methods.setValue("arrivalTime", val.toISOString());
                } else {
                  methods.setValue("arrivalTime", "");
                }
              }}
            />
          </label>
        </div>
        <div className="flex flex-row justify-between">
          <Button
            className="bg-green-500 hover:bg-green-600"
            onClick={handleUpdateTrainSchedule}
          >
            Update
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600"
            onClick={() => handleDeleteTrainSchedule(trainSchedule.id)}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
