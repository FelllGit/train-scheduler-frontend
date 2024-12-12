"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useGetTrain } from "@/services/getTrain";
import { useForm } from "react-hook-form";
import { TrainCard } from "@/app/admin/trainCard";
import { CreateTrainDialog } from "@/app/admin/createTrainDialog";

interface TrainSearchProps {
  name: string;
}

export default function AdminPage() {
  const [name, setName] = useState("");
  const { data: trainsData, isLoading, refetch } = useGetTrain(name);

  const methods = useForm<TrainSearchProps>({
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: TrainSearchProps) => {
    const { name } = data;

    setName(name);
  };

  useEffect(() => {
    refetch();
  }, [name]);

  return (
    <div className="min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]">
      <div className="bg-[#7413dc] flex flex-row flex-wrap sm:gap-2 md:gap-4 items-center justify-center px-4 py-6   first:">
        <Input
          placeholder="Name"
          className="bg-white h-9 w-full sm:w-80 focus-visible:outline-none focus-visible:ring-0"
          {...methods.register("name")}
        />
        <Button
          variant="header"
          className="w-full sm:w-auto text-center sm:text-left"
          onClick={methods.handleSubmit(onSubmit)}
        >
          Search
        </Button>
      </div>
      <main className="py-4 px-4 grid gap-6 grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))]">
        {isLoading ? (
          <></>
        ) : (
          trainsData!.map((train, index) => (
            <TrainCard key={index} index={index} train={train} />
          ))
        )}
        <CreateTrainDialog />
      </main>
    </div>
  );
}
