import React, {ReactNode} from 'react';
import {render, screen, fireEvent} from '@testing-library/react-native';
import {ThemeProvider} from '../../../src/shared/providers/theme';
import {Login} from '../../../src/pages/LoginPage';

const themed = (child: ReactNode) => <ThemeProvider>{child}</ThemeProvider>;

describe('Login page', () => {
  test(
    "displays texts 'Login failed!' and 'please check credentials and try again' when " +
      "the prop 'loginError' is set to 'AUTH_ERROR'",
    () => {
      render(
        themed(
          <Login
            userCredentials={{handle: '', token: ''}}
            onPressLoginBtn={_ => {}}
            loginError="AUTH_ERROR"
          />,
        ),
      );
      const loginFailedTextComponent = screen.queryByText('Login failed!');
      expect(loginFailedTextComponent).not.toBeNull();
      const authErrorTextComponent = screen.queryByText(
        'please check credentials and try again',
      );
      expect(authErrorTextComponent).not.toBeNull();
    },
  );
  test(
    "displays texts 'Login failed!' and 'please check network connection and try again' when " +
      "the prop 'loginError' is set to 'NET_ERROR'",
    () => {
      render(
        themed(
          <Login
            userCredentials={{handle: '', token: ''}}
            onPressLoginBtn={_ => {}}
            loginError="NET_ERROR"
          />,
        ),
      );
      const loginFailedTextComponent = screen.queryByText('Login failed!');
      expect(loginFailedTextComponent).not.toBeNull();
      const networkErrorTextComponent = screen.queryByText(
        'please check network connection and try again',
      );
      expect(networkErrorTextComponent).not.toBeNull();
    },
  );
  test("hides 'Login failed!' text field when the prop 'loginError' is undefined", () => {
    render(
      themed(
        <Login
          userCredentials={{handle: '', token: ''}}
          onPressLoginBtn={_ => {}}
        />,
      ),
    );
    const loginFailedTextComponent = screen.queryByText('Login failed!');
    expect(loginFailedTextComponent).toBeNull();
  });
  test('disables the login button when the handle input field is empty or the token input field is empty', () => {
    render(
      themed(
        <Login
          userCredentials={{handle: '', token: ''}}
          onPressLoginBtn={_ => {}}
        />,
      ),
    );

    const loginButton = screen.getByLabelText('login');
    const assertLoginButtonDisabled = () => {
      expect(loginButton.props.accessibilityState.disabled).toBeTruthy();
    };
    const assertLoginButtonEnabled = () => {
      expect(loginButton.props.accessibilityState.disabled).toBeFalsy();
    };

    const tokenInputField = screen.getByLabelText('your access token');
    const handleInputField = screen.getByLabelText('your handle');

    const clearFieldText = (field: any) => {
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
      const onPressLoginMock = jest.fn().mockName('onPressLoginMock');
      render(
        themed(
          <Login
            userCredentials={{handle: userHandle, token: userToken}}
            onPressLoginBtn={onPressLoginMock}
          />,
        ),
      );
      const loginButton = screen.getByLabelText('login');
      fireEvent.press(loginButton);
      expect(onPressLoginMock).toBeCalledWith({
        token: userToken,
        handle: userHandle,
      });
    },
  );
});
