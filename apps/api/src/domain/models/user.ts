export interface User {
  id?: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  // TODO should be mandatory
  updatedAt?: Date;
}
