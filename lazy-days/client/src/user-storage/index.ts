import { User } from '../../../shared/types';

const USER_LOCALSTORAGE_KEY = 'lazyday_user';

// helper to get user from localstorage

//! 여기서는 token값만 저장하는것이 아닌 user정보 자체를 저장함
export function getStoredUser(): User | null {
  const storedUser = localStorage.getItem(USER_LOCALSTORAGE_KEY);
  return storedUser ? JSON.parse(storedUser) : null;
}

export function setStoredUser(user: User): void {
  localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify(user));
}

export function clearStoredUser(): void {
  localStorage.removeItem(USER_LOCALSTORAGE_KEY);
}
