import { TranslateDirective } from './translate.directive';

describe('TranslateDirective', () => {
  it('should create an instance', () => {
    const directive = new TranslateDirective({} as any, {} as any, {} as any, {} as any, {} as any);
    directive.translate = '';
    expect(directive).toBeTruthy();
  });
});
