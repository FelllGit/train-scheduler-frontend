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
import { createTrainSchedule } from "@/services/createTrainSchedule";

interface TrainScheduleCardProps {
  trains: Train[];
}

interface TrainScheduleUpdateProps {
  from: string;
  to: string;
  scheduledDate: string;
  arrivalTime: string;
  trainId: number;
}

export const CreateTrainScheduleCard: React.FC<TrainScheduleCardProps> = ({
  trains,
}) => {
  const queryClient = useQueryClient();
  const methods = useForm<TrainScheduleUpdateProps>({
    defaultValues: {
      from: "",
      to: "",
      scheduledDate: "",
      arrivalTime: "",
      trainId: trains && trains.length > 0 ? trains[0].id : 0,
    },
  });

  const handleUpdateTrainSchedule = async () => {
    const { from, to, scheduledDate, arrivalTime, trainId } =
      methods.getValues();
    await createTrainSchedule(from, to, scheduledDate, arrivalTime, trainId);
    queryClient.invalidateQueries({ queryKey: ["train-schedule"] });
  };

  return (
    <Card className="w-full">
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
              {trains && trains.length > 0 ? (
                trains.map((train) => (
                  <SelectItem key={train.id} value={train.id.toString()}>
                    {train.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled value="">
                  No trains available
                </SelectItem>
              )}
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
            Create
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
