import { User } from './user';

export interface Team {
  id?: string;
  owner: User;
  name: string;
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
}
