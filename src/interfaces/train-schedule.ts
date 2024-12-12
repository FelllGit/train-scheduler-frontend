import { Train } from "@/interfaces/train";

export interface TrainSchedule {
  id: number;
  train: Train;
  from: string;
  to: string;
  scheduledDate: string;
  arrivalTime: string;
}
