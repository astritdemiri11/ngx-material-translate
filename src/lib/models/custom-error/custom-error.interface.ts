export interface CustomError<T> {
  message: string;
  append: T;
}
