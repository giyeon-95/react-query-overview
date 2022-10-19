// @ts-nocheck
import dayjs from "dayjs";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";

import { axiosInstance } from "../../../axiosInstance";
import { queryKeys } from "../../../react-query/constants";
import { useUser } from "../../user/hooks/useUser";
import { AppointmentDateMap } from "../types";
import { getAvailableAppointments } from "../utils";
import { getMonthYearDetails, getNewMonthYear, MonthYear } from "./monthYear";

  //! refetchOn ~ 옵션들은 prefetch에 적용되지 않지만 staleTime , cacheTime은 같은 키에 동시적용된다.
  const commonOptions = {
    staleTime: 0, 
    cacheTime: 30000, //5 m
  }


// for useQuery call
async function getAppointments(
  year: string,
  month: string
): Promise<AppointmentDateMap> {
  const { data } = await axiosInstance.get(`/appointments/${year}/${month}`);
  return data;
}

// types for hook return object
interface UseAppointments {
  appointments: AppointmentDateMap;
  monthYear: MonthYear;
  updateMonthYear: (monthIncrement: number) => void;
  showAll: boolean;
  //! setState type
  setShowAll: Dispatch<SetStateAction<boolean>>;
}

// The purpose of this hook:
//   1. track the current month/year (aka monthYear) selected by the user
//     1a. provide a way to update state
//   2. return the appointments for that particular monthYear
//     2a. return in AppointmentDateMap format (appointment arrays indexed by day of month)
//     2b. prefetch the appointments for adjacent monthYears
//   3. track the state of the filter (all appointments / available appointments)
//     3a. return the only the applicable appointments for the current monthYear
export function useAppointments(): UseAppointments {
  /** ****************** START 1: monthYear state *********************** */
  // get the monthYear for the current date (for default monthYear state)
  const currentMonthYear = getMonthYearDetails(dayjs());

  // state to track current monthYear chosen by user
  // state value is returned in hook return object
  const [monthYear, setMonthYear] = useState(currentMonthYear);

  // setter to update monthYear obj in state when user changes month in view,
  // returned in hook return object
  function updateMonthYear(monthIncrement: number): void {
    setMonthYear((prevData) => getNewMonthYear(prevData, monthIncrement));
  }
  /** ****************** END 1: monthYear state ************************* */
  /** ****************** START 2: filter appointments  ****************** */
  // State and functions for filtering appointments to show all or only available
  const [showAll, setShowAll] = useState(false);

  // We will need imported function getAvailableAppointments here
  // We need the user to pass to getAvailableAppointments so we can show
  //   appointments that the logged-in user has reserved (in white)
  const { user } = useUser();

  //! shoAll 조건에 따라 data를 받은 후, 가공
  //! 종속성을 user로 설정 : 로그인하는 유저에따라서, 로그인상태에따라서 함수 변경
  
  const selectFn = useCallback((data : any)=> {
    return getAvailableAppointments(data, user);
  }, [user]);



  //! 다음 달 프리페칭 (monthYear 변경시)
  const queryClient = useQueryClient();
  useEffect(() => {
    // increment of one month
    const nextMonthYear = getNewMonthYear(monthYear, 1);
    queryClient.prefetchQuery(
      [queryKeys.appointments, nextMonthYear.year, nextMonthYear.month],
      () => getAppointments(nextMonthYear.year, nextMonthYear.month), 
      commonOptions
    );
  }, [queryClient, monthYear]);

  //!fallback 설정 (initData)
  const fallback = {};

  //! 달력 배치가 변경되기 때문에 keepPreviousData속성은 어울리지 않는다. (fetch하는 동안 이전 달 데이터가 유지되어 이상하게 보일 수 있기 때문)
  //! select -> showAll 상태에 따라서 데이터 가공 여부결정
  const { data: appointments = fallback } = useQuery(
    [queryKeys.appointments, monthYear.year, monthYear.month],
    () => getAppointments(monthYear.year, monthYear.month), {
      select : showAll ? undefined : selectFn,
      ...commonOptions,
      refetchOnMount : true , 
      refetchOnReconnect : true ,
      refetchOnWindowFocus : true ,
    }
  );

  return { appointments, monthYear, updateMonthYear, showAll, setShowAll };
}
