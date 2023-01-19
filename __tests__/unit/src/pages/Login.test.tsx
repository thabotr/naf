import React from 'react';
import {
  render,
  screen,
  fireEvent,
  cleanup,
} from '@testing-library/react-native';
import {Credentials, Login} from '../../../../src/pages/Login/Login';
import themed from '../../utils/themed';
import {doNothing} from '../../utils/doNothing';
import {ReactTestInstance} from 'react-test-renderer';
import {HelperText} from '../../../../src/shared/middleware';

type Props = React.ComponentProps<typeof Login>;

function loginPageFromFactory(overrides: Partial<Props>) {
  const defaultProps: Props = {
    userCredentials: {handle: '', token: ''},
    onPressLoginBtn: doNothing,
    onToRegistration: doNothing,
  };
  return render(themed(<Login {...defaultProps} {...overrides} />));
}

describe('Login page', () => {
  test("displays successful registration message if and only if prop 'registerd' is truthy", () => {
    loginPageFromFactory({registered: true});
    expect(
      screen.queryByText(HelperText.successfulRegistrationText),
    ).not.toBeNull();
    cleanup();
    loginPageFromFactory({});
    expect(
      screen.queryByText(HelperText.successfulRegistrationText),
    ).toBeNull();
  });
  const getRegisterBtn = () => screen.getByLabelText('to registration');
  test(
    "should contain a 'register' area which should call the 'onToRegistration' prop with " +
      'the current handle and token inputs as arguments when pressed',
    () => {
      const mockOnToRegistration = jest.fn().mockName('mockOnToRegistration');
      loginPageFromFactory({onToRegistration: mockOnToRegistration});
      fireEvent.press(getRegisterBtn());
      const emptyCredentials: Credentials = {handle: '', token: ''};
      expect(mockOnToRegistration).toBeCalledTimes(1);
      expect(mockOnToRegistration).toBeCalledWith(emptyCredentials);
      cleanup();
      const someCredentials: Credentials = {
        handle: 'w/someone',
        token: 'maybethis',
      };
      loginPageFromFactory({
        userCredentials: someCredentials,
        onToRegistration: mockOnToRegistration,
      });
      fireEvent.press(getRegisterBtn());
      expect(mockOnToRegistration).toBeCalledTimes(2);
      expect(mockOnToRegistration).toBeCalledWith(someCredentials);
    },
  );
  test("displays texts 'Login failed!' and the error text if loginError is defined", () => {
    loginPageFromFactory({
      loginError: HelperText.authorizationError,
    });
    const loginFailedTextComponent = screen.queryByText('Login failed!');
    expect(loginFailedTextComponent).not.toBeNull();
    const authErrorTextComponent = screen.queryByText(
      HelperText.authorizationError,
    );
    expect(authErrorTextComponent).not.toBeNull();
  });
  test("hides 'Login failed!' text field when the prop 'loginError' is undefined", () => {
    loginPageFromFactory({});
    const loginFailedTextComponent = screen.queryByText('Login failed!');
    expect(loginFailedTextComponent).toBeNull();
  });
  test('disables the login button when the handle input field is empty or the token input field is empty', () => {
    loginPageFromFactory({});
    const loginButton = screen.getByLabelText('login');
    const assertLoginButtonDisabled = () => {
      expect(loginButton.props.accessibilityState.disabled).toBeTruthy();
    };
    const assertLoginButtonEnabled = () => {
      expect(loginButton.props.accessibilityState.disabled).toBeFalsy();
    };

    const tokenInputField = screen.getByLabelText('your access token');
    const handleInputField = screen.getByLabelText('your handle');

    const clearFieldText = (field: ReactTestInstance) => {
      const emptyText = '';
      fireEvent.changeText(field, emptyText);
    };
    const populateHandleField = () => {
      const exampleHandle = 'w/someHandle';
      fireEvent.changeText(handleInputField, exampleHandle);
    };
    const populateTokenField = () => {
      const exampleToken = 'someToken';
      fireEvent.changeText(tokenInputField, exampleToken);
    };

    populateHandleField();
    assertLoginButtonDisabled();
    clearFieldText(handleInputField);
    populateTokenField();
    assertLoginButtonDisabled();
    populateHandleField();
    assertLoginButtonEnabled();
  });
  test(
    'should call props.onPressLoginBtn with user credentials object having' +
      "token and handle from corresponding text input fields when 'login' button is pressed",
    () => {
      const userHandle = 'someHandle';
      const userToken = 'someToken';
      const mockOnPressLogin = jest.fn().mockName('mockOnPressLogin');
      loginPageFromFactory({
        userCredentials: {handle: userHandle, token: userToken},
        onPressLoginBtn: mockOnPressLogin,
      });
      const loginButton = screen.getByLabelText('login');
      fireEvent.press(loginButton);
      expect(mockOnPressLogin).toBeCalledWith({
        token: userToken,
        handle: userHandle,
      });
    },
  );
});
