import { LanguageCode } from './language.enum';
import { Language } from './language.model';

describe('Language', () => {
  it('should create an instance', () => {
    expect(new Language({ id: 0, n: '', c: LanguageCode.Undefined, f: '' })).toBeTruthy();
  });
});
