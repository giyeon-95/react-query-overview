import { Appointment } from './../../../../../shared/types';
import { UseMutateFunction, useMutation } from 'react-query';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useCustomToast } from '../../app/hooks/useCustomToast';
import { useUser } from '../../user/hooks/useUser';

// for when we need functions for useMutation
async function setAppointmentUser(
  appointment: Appointment,
  userId: number | undefined,
): Promise<void> {
  if (!userId) return;
  const patchOp = appointment.userId ? 'replace' : 'add';
  const patchData = [{ op: patchOp, path: '/userId', value: userId }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
}

/*
 UseMutateFunction type
 함수가 반환하는 return값의 타입,
 오류유형,
 useMutation에서 전달되는 변수 타입,
 context 타입
*/
export function useReserveAppointment(): UseMutateFunction<void,unknown,Appointment,unknown> {
  const { user } = useUser();
  const toast = useCustomToast();

  const {mutate} = useMutation((appointment:Appointment)=>setAppointmentUser(
    appointment, user?.id
  ));

  return mutate;
}
