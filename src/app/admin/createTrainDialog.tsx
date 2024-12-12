"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { createTrain } from "@/services/createTrain";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface TrainUpdateProps {
  name: string;
}

export const CreateTrainDialog = () => {
  const queryClient = useQueryClient();

  const methods = useForm<TrainUpdateProps>({
    defaultValues: {
      name: "",
    },
  });

  const handleUpdateTrain = async () => {
    const { name } = methods.getValues();
    await createTrain(name);
    queryClient.invalidateQueries({ queryKey: ["trains"] });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="absolute bottom-10 right-10 w-16 h-16 rounded-full bg-green-500 hover:bg-green-600">
          <Plus className="scale-[2]" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col gap-2">
          <label className="flex flex-row gap-2 text-2xl items-center font-bold">
            Name{" "}
            <Input
              value={
                methods.watch("name") ? methods.watch("name").toString() : ""
              }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                methods.setValue("name", e.target.value);
              }}
            />
          </label>
          <Button
            className="bg-green-500 hover:bg-green-600"
            onClick={handleUpdateTrain}
          >
            Update
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
