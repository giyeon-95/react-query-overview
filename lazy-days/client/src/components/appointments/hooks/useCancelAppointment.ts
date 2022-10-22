import { UseMutateFunction, useMutation, useQueryClient } from 'react-query';
import { Appointment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useCustomToast } from '../../app/hooks/useCustomToast';

async function removeAppointmentUser(appointment: Appointment): Promise<void> {
  const patchData = [{ op: 'remove', path: '/userId' }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
}


//! 서버에서 예약 취소 요청 후, 성공시 queryKey 만료 -> 리페칭 
export function useCancelAppointment():UseMutateFunction<void, unknown, Appointment,unknown>{
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  //! 뮤테이션 내부 (appointment : Appointment) => removeAppointmentUser(appointment) 로 매개변수를 직관적으로 표시해도 되지만
  // 아래처럼 생략가능
  const {mutate} = useMutation(removeAppointmentUser, 
    {
      onSuccess : ()=>{
        queryClient.invalidateQueries([queryKeys.appointments]); 
        toast({
          title : '취소완료', 
          status  :"success",
        })
      }
    }
  )

  return mutate ;
}
