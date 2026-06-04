import { validateEmail } from "../utils/validators";

describe('Sample Test', () => {
  it('should run successfully', () => {
    expect(true).toBe(true);
  });
});

describe('utils: validateEmail', () => {
  it('true case 1', () => {
    expect(validateEmail('hoanglbp3300@gmail.com')).toBe(true);
  });
  it('true case 2', () => {
    expect(validateEmail('hahahah@gmail.com')).toBe(true);
  });
  it('false case 1', () => {
    expect(validateEmail('hahahahgmail.com')).toBe(false);
  });
});