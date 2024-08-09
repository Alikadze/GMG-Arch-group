export interface ProjectPayload {
  id?: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  flatSpace: number;
  images: string[];
}