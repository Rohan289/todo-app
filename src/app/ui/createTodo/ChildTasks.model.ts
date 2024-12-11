import { Bug } from "@/models/Bug";
import { Feature } from "@/models/Feature";

export interface ChildTasksType {
    bugs : Bug | null;
    features : Feature | null;
  }