import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react-native';
import Registration from '../../../../src/pages/Registration/Registration';
import themed from '../../utils/themed';
import {doNothing} from '../../utils/doNothing';
import {ReactTestInstance} from 'react-test-renderer';
import {Credentials} from '../../../../src/pages/Login/Login';
import {Validator} from '../../../../src/shared/middleware';

type RegistrationProps = React.ComponentProps<typeof Registration>;
function registrationPageFromFactory(overrides: Partial<RegistrationProps>) {
  const defaultProps: RegistrationProps = {
    onBackToLogin: doNothing,
    credentials: {
      handle: '',
      token: '',
    },
    onRegister: doNothing,
  };
  return render(themed(<Registration {...defaultProps} {...overrides} />));
}

describe('Registration Page', () => {
  const validCredentials: Credentials = {
    handle: 'w/someHandle',
    token: 'testToken',
  };
  const getInvalidTokenHelperText = () =>
    screen.queryByText(Validator.invalidTokenHelperText);
  test('should display invalid token helper text if and only if the token is invalid', () => {
    const emptyToken = '';
    registrationPageFromFactory({
      credentials: {
        handle: '',
        token: emptyToken,
      },
    });
    expect(getInvalidTokenHelperText()).not.toBeNull();
    const shortToken = 'not8len';
    cleanup();
    registrationPageFromFactory({
      credentials: {
        handle: '',
        token: shortToken,
      },
    });
    expect(getInvalidTokenHelperText()).not.toBeNull();
    cleanup();
    registrationPageFromFactory({credentials: validCredentials});
    expect(getInvalidTokenHelperText()).toBeNull();
  });
  const getInvalidHandleHelperText = () =>
    screen.queryByText(Validator.invalidHandleHelperText);
  test('should display invalid handle helper text if and only if the handle is invalid', () => {
    const malFormedHandle = 'wsomebody';
    registrationPageFromFactory({
      credentials: {
        handle: malFormedHandle,
        token: '',
      },
    });
    expect(getInvalidHandleHelperText()).not.toBeNull();
    const incompleteHandle = 'w/';
    cleanup();
    registrationPageFromFactory({
      credentials: {
        handle: incompleteHandle,
        token: '',
      },
    });
    expect(getInvalidHandleHelperText()).not.toBeNull();
    cleanup();
    registrationPageFromFactory({credentials: validCredentials});
    expect(getInvalidHandleHelperText()).toBeNull();
  });
  test("should contain a 'back to login' area which should call the 'onBackToLogin' prop when pressed", () => {
    const mockOnBackToLogin = jest.fn().mockName('mockOnBackToLogin');
    registrationPageFromFactory({onBackToLogin: mockOnBackToLogin});
    const back2LoginBtn = screen.getByLabelText('back to login');
    fireEvent.press(back2LoginBtn);
    expect(mockOnBackToLogin).toBeCalledTimes(1);
  });
  const isDisabled = (component: ReactTestInstance) =>
    component.props.accessibilityState.disabled;
  const getRegisterBtn = () => screen.getByLabelText('register');
  test("should disable the 'register' button if any of the input fields are empty or in an error state", () => {
    registrationPageFromFactory({});
    expect(isDisabled(getRegisterBtn())).toBeTruthy();
    const invalidHandle = 'whandle';
    cleanup();
    registrationPageFromFactory({
      credentials: {
        handle: invalidHandle,
        token: 'tokentoken',
      },
    });
    expect(isDisabled(getRegisterBtn())).toBeTruthy();
  });
  const getTokenInputField = () =>
    screen.getByLabelText('your new access token');
  const getHandleInputField = () => screen.getByLabelText('your new handle');
  test('should enable the register button when all the input fields are populated with valid values', () => {
    registrationPageFromFactory({});
    expect(isDisabled(getRegisterBtn())).toBeTruthy();
    const tokenInput = getTokenInputField();
    const handleInput = getHandleInputField();
    fireEvent.changeText(tokenInput, validCredentials.token);
    fireEvent.changeText(handleInput, validCredentials.handle);
    expect(isDisabled(getRegisterBtn())).toBeFalsy();
  });
  test("should enable the register button if the 'credentials' prop contains valid credentials", () => {
    registrationPageFromFactory({credentials: validCredentials});
    expect(isDisabled(getRegisterBtn())).toBeFalsy();
  });
  test(
    "should call the 'onRegister' prop with the input credentials as arguments and disable " +
      "buttons and input fields when the 'register' button is pressed",
    () => {
      const mockOnRegister = jest.fn().mockName('mockOnRegister');
      registrationPageFromFactory({
        onRegister: mockOnRegister,
        credentials: validCredentials,
      });
      fireEvent.press(getRegisterBtn());
      expect(mockOnRegister).toBeCalledTimes(1);
      expect(mockOnRegister).toBeCalledWith(validCredentials);
      expect(isDisabled(getRegisterBtn())).toBeTruthy();
      expect(getHandleInputField().props.editable).toBeFalsy();
      expect(getTokenInputField().props.editable).toBeFalsy();
      expect(isDisabled(screen.getByLabelText('back to login'))).toBeTruthy();
    },
  );
  test("should display 'Registration error!' if and only if the 'registrationError' prop is defined", () => {
    registrationPageFromFactory({registrationError: 'SERVER_ERROR'});
    const errorComponent = screen.queryByText('Registration failed!');
    expect(errorComponent).not.toBeNull();
  });
});
