export interface TeamResponse {
  id?: number;
  ownerId: number;
  name: string;
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
}
