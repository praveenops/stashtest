import { ViewEmptyDirective } from './view-empty.directive';

describe('ViewEmptyDirective', () => {
  it('should create an instance', () => {
    const directive = new ViewEmptyDirective(null, null);
    expect(directive).toBeTruthy();
  });
});
