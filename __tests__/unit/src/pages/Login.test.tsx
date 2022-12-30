import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react-native';
import {Login} from '../../../../src/pages/Login/Login';
import themed from '../../utils/themed';
import {doNothing} from '../../utils/doNothing';
import {ReactTestInstance} from 'react-test-renderer';

type Props = React.ComponentProps<typeof Login>;

function loginPageFromFactory(overrides: Partial<Props>) {
  const defaultProps: Props = {
    userCredentials: {handle: '', token: ''},
    onPressLoginBtn: doNothing,
  };
  return render(themed(<Login {...defaultProps} {...overrides} />));
}

describe('Login page', () => {
  test(
    "displays texts 'Login failed!' and 'please check credentials and try again' when " +
      "the prop 'loginError' is set to 'AUTH_ERROR'",
    () => {
      loginPageFromFactory({loginError: 'AUTH_ERROR'});
      const loginFailedTextComponent = screen.queryByText('Login failed!');
      expect(loginFailedTextComponent).not.toBeNull();
      const authErrorTextComponent = screen.queryByText(
        'please check credentials and try again',
      );
      expect(authErrorTextComponent).not.toBeNull();
    },
  );
  test(
    "displays texts 'Login failed!' and 'unknown error encountered. Please resart application' when " +
      "the prop 'loginError' is set to 'APP_ERROR'",
    () => {
      loginPageFromFactory({loginError: 'APP_ERROR'});
      const loginFailedTextComponent = screen.queryByText('Login failed!');
      expect(loginFailedTextComponent).not.toBeNull();
      const appErrorTextComponent = screen.queryByText(
        'unknown error encountered. Please resart application',
      );
      expect(appErrorTextComponent).not.toBeNull();
    },
  );
  test(
    "displays texts 'Login failed!' and 'something went wrong on our side. Please give " +
      "us a moment to look into this issue' when the prop 'loginError' is set to 'SERVER_ERROR'",
    () => {
      loginPageFromFactory({loginError: 'SERVER_ERROR'});
      const loginFailedTextComponent = screen.queryByText('Login failed!');
      expect(loginFailedTextComponent).not.toBeNull();
      const serverErrorTextComponent = screen.queryByText(
        'something went wrong on our side. Please give us a moment to look into this issue',
      );
      expect(serverErrorTextComponent).not.toBeNull();
    },
  );
  test(
    "displays texts 'Login failed!' and 'please check network connection and try again' when " +
      "the prop 'loginError' is set to 'NET_ERROR'",
    () => {
      loginPageFromFactory({loginError: 'NET_ERROR'});
      const loginFailedTextComponent = screen.queryByText('Login failed!');
      expect(loginFailedTextComponent).not.toBeNull();
      const networkErrorTextComponent = screen.queryByText(
        'please check network connection and try again',
      );
      expect(networkErrorTextComponent).not.toBeNull();
    },
  );
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
