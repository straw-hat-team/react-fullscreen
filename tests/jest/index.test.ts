import { main } from '../../src/index';

test('returns hello world message', () => {
  expect(main()).toBe('Hello, World!');
});
