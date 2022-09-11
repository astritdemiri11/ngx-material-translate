import { ResponseType } from './response.enum';
import { Response } from './response.model';

describe('Response', () => {
  it('should create an instance', () => {
    expect(new Response({}, ResponseType.Success, null)).toBeTruthy();
  });
});
