import { CustomError as CustomErrorInterface } from './custom-error.interface';

export class CustomError<T> implements CustomErrorInterface<T> {
  constructor(public message: string, public append: T) { }
}
