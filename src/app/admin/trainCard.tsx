"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";
import { Train } from "@/interfaces/train";
import { deleteTrain } from "@/services/deleteTrain";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { putTrain } from "@/services/putTrain";

interface TrainCardProps {
  train: Train;
  index: number;
}

interface TrainUpdateProps {
  name: string;
}

export const TrainCard: React.FC<TrainCardProps> = ({ train, index }) => {
  const queryClient = useQueryClient();

  const handleDeleteTrain = (id: number) => {
    deleteTrain(id);
    queryClient.invalidateQueries({ queryKey: ["trains"] });
  };

  const methods = useForm<TrainUpdateProps>({
    defaultValues: {
      name: train.name,
    },
  });

  const handleUpdateTrain = async () => {
    const { name } = methods.getValues();
    await putTrain(train.id, name);
    queryClient.invalidateQueries({ queryKey: ["trains"] });
  };

  return (
    <Card key={index} className="w-full">
      <CardContent className="py-2">
        <div className="flex flex-col gap-2">
          <label className="flex flex-row gap-2 text-2xl items-center font-bold">
            Name{" "}
            <Input
              value={
                // eslint-disable-next-line no-restricted-syntax
                methods.watch("name") ? methods.watch("name").toString() : ""
              }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                methods.setValue("name", e.target.value);
              }}
            />
          </label>
          <div className="flex flex-row justify-between">
            <Button
              className="bg-green-500 hover:bg-green-600"
              onClick={handleUpdateTrain}
            >
              Update
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600"
              onClick={() => handleDeleteTrain(train.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
