import { useQuery, useQueryClient } from 'react-query';
import { AxiosResponse } from 'axios';

import type { User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
} from '../../../user-storage';

/*!
 사용자 정보를 가져오는 쿼리. 
로그인시 인자로 User를 받고, 미 로그인시 null을 받고 query 미호출

로그인상태라면, 로그인한 사용자의 user.id를 가져옴. 이 때 토큰이 필요하니
헤더에 JWT를 넣어서 보내줌.
*/
async function getUser(user: User | null): Promise<User | null> {
  if (!user) return null;
  const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
    `/user/${user.id}`,
    {
      headers: getJWTHeader(user),
    },
  );

  console.log('@@getUser data : ', data);

  return data.user;
}

interface UseUser {
  user: User | null;
  updateUser: (user: User) => void;
  clearUser: () => void;
}


export function useUser(): UseUser {
  const queryClient = useQueryClient();
   
  /*! 
   로그인 상태라면 제일먼저 getUser로 유저의 정보를 가져옴.
   이때 getUser에 인자로 들어가는 user는 기존 유저정보이며, useQuery가 반환하면 user 라는 데이터가 업데이트 됨.
   
   그렇다면 getUser에 들어가는 기존 유저정보는 어디서 오는건가 ?
   캐시값으로 저장해놓았던 값을 이용하는 것.
   
   그런데 캐시값으로 저장한걸 쓰면 새로고침 시 캐시가 날아가버려서 로그아웃됨.
   그래서 로컬스토리지로 저장.
   
   이 코드는 새로고침하면 풀림 ->  const {data :user} = useQuery(queryKeys.user, ()=> getUser(user))
  */
  
  /*!
    onSuccess는 실행시킨 useQuery나, setQueryData에서 데이터를 가져오는 함수.(둘 다에서 실행)
    다시말해서 useQuery로 getUser를 실행시킨 데이터를 받아올 수도 있고, updateUser, clearUser로 user나 null을 받을수도 있음.

    null을 받으면 clearUser가 실행됐다는 뜻이며, 로그아웃하겠다는 뜻이되고, local storage를 지우겠다는 뜻이 됨.

    새로고침시, 캐싱데이터를 사용하는것이 아닌 로컬스토리지 값을 사용해야 로그인이 안풀림.
    이 때, useQuery의 initialData 옵션을 사용.

    페이지에서 fallback을 사용해서 init Data를 설정한 부분이 있는데, 그렇게하면 캐시에 추가되지 않음(placeholder 옵션도 마찬가지).
    초기값을 설정하면서 캐싱까지 하려면 initialData 옵션을 쓰면 됨.

    여기서는 로컬스토리지에서 가져온 키를 사용함.
    
    여기까지 설정하면 새로고침시에도, 로그아웃이 풀리지 않음.
  */
  const {data :user} = useQuery(queryKeys.user, ()=> getUser(user), {
    initialData: getStoredUser,

    onSuccess: (received : User | null)=>{
      if(!received){
        clearStoredUser(); //remove localStorage item
      }else{
        setStoredUser(received); //set localStorage item
      }
    }
  })

  /*
   updateUser는 useAuth나 usePatchUser에서 호출되며 로그인 / 회원가입/ 정보를 업데이트한 
   User데이터(newUser)를 받아서 setQueryData로 쿼리캐시 업데이트(캐싱).
  */
  function updateUser(newUser: User): void {
    //! localstorage 업데이트
    setStoredUser(newUser) ;
    //! 쿼리데이터 업데이트
    queryClient.setQueryData(queryKeys.user, newUser);
  }

  // 로그아웃시 user queryKey 캐싱 데이터 지우기
  function clearUser() {
    queryClient.setQueryData(queryKeys.user, null);
    queryClient.removeQueries(
      [queryKeys.appointments, queryKeys.user]
    );
  }

  return { user, updateUser, clearUser };
}
/*!
  useUser -> auth에서 실제 react query가 작동하는 곳.
  user 데이터와, 사용자 정보를 업데이트를 하는 함수 로그아웃 시 
  user 데이터를 지우는 함수를 반환함.

  updateUser는 사용자 로그인이나 사용자 정보 업데이트를 처리함.
  clearUser는 말그대로 로그아웃을 처리.
  clearUser는 user 쿼리키를 null  로 설정하는 동시에 user와 관련된 모든 쿼리키들을 지워야함.

  useUser의 역할은 local storage와 query cache에서 사용자 상태를 유지시키는 것임.


*/   

