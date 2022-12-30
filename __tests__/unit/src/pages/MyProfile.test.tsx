import {fireEvent, render, screen} from '@testing-library/react-native';
import React from 'react';
import MyProfile from '../../../../src/pages/MyProfile/MyProfile';
import {doNothing} from '../../utils/doNothing';
import themed from '../../utils/themed';

const mockToastAndroidShow = jest.fn().mockName('mockToastAndroidShow');

jest.mock(
  'react-native/Libraries/Components/ToastAndroid/ToastAndroid',
  () => ({
    SHORT: 0,
    show: mockToastAndroidShow,
  }),
);

type Props = React.ComponentProps<typeof MyProfile>;

function myProfilePageFromFactory(overrides: Partial<Props>) {
  const defaultProps: Props = {
    onLogout: doNothing,
    onBackToHome: doNothing,
  };
  return render(themed(<MyProfile {...defaultProps} {...overrides} />));
}

describe('MyProfile Page', () => {
  const mockOnLogout = jest.fn().mockName('mockOnLogout');
  beforeEach(() => {
    mockOnLogout.mockClear();
  });
  it("should call the 'onLogout' prop when the logout button is held down", () => {
    myProfilePageFromFactory({onLogout: mockOnLogout});
    const logoutButton = screen.getByLabelText('logout');
    fireEvent(logoutButton, 'onLongPress');
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });
  it("should call android toast show with hint message 'hold to logout' when logout button is clicked", () => {
    myProfilePageFromFactory({onLogout: mockOnLogout});
    const logoutButton = screen.getByLabelText('logout');
    fireEvent.press(logoutButton);
    expect(mockOnLogout).not.toHaveBeenCalled();
    expect(mockToastAndroidShow).toBeCalledTimes(1);
    expect(mockToastAndroidShow).toHaveBeenCalledWith(
      'hold to logout',
      expect.any(Number),
    );
  });
  it("should call the 'onBackToHome' prop when the navigation bar's back to home button is clicked", () => {
    const mockOnBackToHome = jest.fn().mockName('mockOnBackToHome');
    myProfilePageFromFactory({onBackToHome: mockOnBackToHome});
    screen.getByLabelText('my profile navigation bar');
    const backToHomeButton = screen.getByLabelText('back to home');
    fireEvent.press(backToHomeButton);
    expect(mockOnBackToHome).toHaveBeenCalledTimes(1);
  });
});
