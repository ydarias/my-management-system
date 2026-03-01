import { User } from './user';

export interface Team {
  id?: number;
  owner: User;
  name: string;
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
}
