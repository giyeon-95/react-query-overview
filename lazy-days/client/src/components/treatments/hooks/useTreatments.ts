import { useQuery, useQueryClient } from "react-query";
import { queryClient } from "react-query/queryClient";
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

  return data;
} 

//!dont use in useEffect
export function usePrefetchTreatments(): void {
  //!set prefetch key
  const queryClient = useQueryClient();
  queryClient.prefetchQuery(queryKeys.treatments, getTreatments);
}
