import { useCustomToast } from 'components/app/hooks/useCustomToast';
import jsonpatch from 'fast-json-patch';
import { useMutation, UseMutateFunction } from 'react-query';
import type { User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { useUser } from './useUser';


/*
  업데이트 전 user정보와 업데이트내용(업데이트 유저데이터)을 받아 업데이트된 유저를 반환하는 함수
*/
async function patchUserOnServer(
  newData: User | null,
  originalData: User | null,
 ): Promise<User | null> {
  if (!newData || !originalData) return null;
  // create a patch for the difference between newData and originalData
  const patch = jsonpatch.compare(originalData, newData);

  // send patched data to the server
  const { data } = await axiosInstance.patch(
    `/user/${originalData.id}`,
    { patch },
    {
      headers: getJWTHeader(originalData),
    },
  );
  return data.user;
 }

/*!
 UserPofile에서 업데이트 정보 보내줌 ->
 usePatchUser에서 그 데이터를 받아 useMutation실행 ->
 patchUserOnServer함수에서 기존 User정보(useUser), 업데이트된 유저정보를 받아 업데이트된 유저정보 반환 ->
 onSuccess에서 useUser updateUser실행->
 toast

 patchUserOnServer함수는 업데이트된 새로운 user정보를 반환함. 
 onSuccess에서 그 데이터를 받아 updateUser 실행.
 updateUser는 받은 user데이터로 로컬 스토리지에 저장, 쿼리키 업데이트
*/
export function usePatchUser() :UseMutateFunction<User, unknown, User, unknown> {
  const { user, updateUser } = useUser();
  const toast = useCustomToast(); 

  const {mutate : patchUser} = useMutation((newUserData: User)=> 
    patchUserOnServer(newUserData, user),
    {
      onSuccess : (userData : User | null)=> {
        if(user){
          updateUser(userData);
          toast({
            title :"업데이트 성공", 
            status: "success",
          })
        }
      }
    }
  );

  return patchUser;
}
