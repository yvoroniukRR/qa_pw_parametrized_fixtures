import { test } from '../_fixtures/fixtures';
import {
  EMPTY_PASSWORD_MESSAGE,
  EMPTY_EMAIL_MESSAGE
} from '../../src/ui/constants/authErrorMessages';

const user = generateNewUserData();
const testParameters = [
  {
    email: user.email,
    password: '',
    message: EMPTY_PASSWORD_MESSAGE,
    title: 'empty password',
  },
  {
    email: '',
    password: user.password,
    message: EMPTY_EMAIL_MESSAGE,
    title: 'empty email',
  },
];

testParameters.forEach(({ email, password, message, title }) => {
  test.describe('Sign up negative tests', () => {
    test(`Sign up with ${title}`, async ({ signUpPage }) => {
      await signUpPage.open();
      await signUpPage.fillEmailField(email);
      await signUpPage.fillPasswordField(password);
      await signUpPage.clickSignUpButton();

      await signUpPage.assertErrorMessageContainsText(message);
    });
  });
});