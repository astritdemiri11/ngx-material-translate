import { ResponseType } from './response.enum';

export interface Response {
  status: ResponseType,
  error: string | null;
}
