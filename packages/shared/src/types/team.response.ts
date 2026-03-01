export interface TeamResponse {
  id?: string;
  ownerId: string;
  name: string;
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
}
