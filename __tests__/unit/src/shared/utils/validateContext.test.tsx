import {validateContext} from '../../../../../src/shared/utils/validateContext';

describe(validateContext, () => {
  test('throws an error when the given context argument is undefined', () => {
    expect.assertions(1);
    try {
      validateContext(undefined, '', '');
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
  test('returns the provided context argument when it is defined', () => {
    const someContextObject = {};
    expect(validateContext(someContextObject, '', '')).toMatchObject(
      someContextObject,
    );
  });
});
