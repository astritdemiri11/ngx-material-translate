import { Observable } from 'rxjs';

export interface HTTPLoader {
  get: <T>(url: string, options: Object) => Observable<T>
}

/**
 * Performs HTTP requests.
 * This service is available as an injectable class, with methods to perform HTTP requests.
 */
export interface Loader {
  /**
   * Constructs a `GET` request that interprets the body as a JSON object and returns
   * the response body in a given type T with the appended data U.
   *
   * @param url     The endpoint URL.
   * @param options The HTTP options to send with the request.
   * @param append  Data that should be returned back with the JSON object.
   *
   * @return An `Observable` of type { append: U, data: T }, with a response body in the requested type.
   */
  get: <T, U>(url: string, params: Object, append: U) => Observable<{ append: U, data: T }>
}
