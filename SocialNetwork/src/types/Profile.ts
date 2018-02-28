import { UserData } from './User';

export interface ProfileData {
  id: string;
  name: string;
  birthday: number;
  hobbies: string[];
  friends: {id: string}[];
}