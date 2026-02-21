export interface User {
  id?: number;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  // TODO should be mandatory
  updatedAt?: Date;
}
