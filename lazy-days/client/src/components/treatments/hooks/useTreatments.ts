import { useQuery } from "react-query";
import type { Treatment } from "../../../../../shared/types";
import { axiosInstance } from "../../../axiosInstance";
import { queryKeys } from "../../../react-query/constants";

// for when we need a query function for useQuery
async function getTreatments(): Promise<Treatment[]> {
  const { data } = await axiosInstance.get("/treatments");
  return data;
}

export function useTreatments(): Treatment[] {

  const fallback = []; //set init data

  const { data = fallback } = useQuery(queryKeys.treatments, getTreatments);

  console.log(1, data);

  return data;
}
