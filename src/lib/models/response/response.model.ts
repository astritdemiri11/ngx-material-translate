import { ResponseType } from './response.enum';
import { Response as ResponseInterface } from './response.interface';

export class Response<T> implements ResponseInterface {
  constructor(public data: T, public status: ResponseType, public error: string | null) { }
}
