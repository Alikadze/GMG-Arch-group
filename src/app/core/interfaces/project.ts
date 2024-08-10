export interface ProjectPayload {
  id?: string;
  name: string;
  description: string;
  offeredPrice?: number;
  type: string;
  startDate?: Date;
  endDate?: Date;
  flatSpace: number;
  images: string[];
}