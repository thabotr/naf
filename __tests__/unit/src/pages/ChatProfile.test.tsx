import React from 'react';
import {
  render,
  screen,
  cleanup,
  fireEvent,
} from '@testing-library/react-native';
import themed from '../../utils/themed';
import ChatProfile from '../../../../src/pages/ChatProfile/ChatProfile';
import {CHATS} from '../../../mockdata/chat';

const mockToastAndroidShow = jest.fn().mockName('mockToastAndroidShow');
jest.mock(
  'react-native/Libraries/Components/ToastAndroid/ToastAndroid',
  () => ({
    SHORT: 0,
    show: mockToastAndroidShow,
  }),
);
const mockOnDisconnect = jest.fn().mockName('mockOnDisconnect');

describe('Chat Profile page', () => {
  const currentChat = CHATS[0];
  beforeEach(() => {
    cleanup();
    mockToastAndroidShow.mockClear();
    mockOnDisconnect.mockClear();
  });
  test(
    'the navbar should contain the back to home button which should call ' +
      "the prop 'onGoBack' on click",
    () => {
      const mockOnGoBack = jest.fn().mockName('mockOnGoBack');
      render(themed(<ChatProfile onGoBack={mockOnGoBack} />));
      screen.getByLabelText('chat profile navigation bar');
      const backToHomeButton = screen.getByLabelText('back to home');
      fireEvent.press(backToHomeButton);
      expect(mockOnGoBack).toBeCalledTimes(1);
    },
  );
  test(
    'should have a disconnect from chat <chatUserHandle> button which should call ' +
      "the prop 'onDisconnect' and become disabled on long press",
    () => {
      const chat = CHATS[1];
      render(
        themed(<ChatProfile chat={chat} onDisconnect={mockOnDisconnect} />),
      );
      const disconnectButton = screen.getByLabelText(
        `disconnect from chat ${chat.user.handle}`,
      );
      fireEvent(disconnectButton, 'onLongPress');
      expect(mockOnDisconnect).toBeCalledTimes(1);
      expect(disconnectButton.props.accessibilityState.disabled).toBeTruthy();
    },
  );
  it(
    "should call android toast show with hint message 'hold to disconnect from user' when " +
      'disconnect from chat <chatUserHandle> button is clicked',
    () => {
      render(
        themed(
          <ChatProfile chat={currentChat} onDisconnect={mockOnDisconnect} />,
        ),
      );
      const logoutButton = screen.getByLabelText(
        `disconnect from chat ${currentChat.user.handle}`,
      );
      fireEvent.press(logoutButton);
      expect(mockOnDisconnect).not.toHaveBeenCalled();
      expect(mockToastAndroidShow).toBeCalledTimes(1);
      expect(mockToastAndroidShow).toHaveBeenCalledWith(
        'hold to disconnect from user',
        expect.any(Number),
      );
    },
  );
  it("hides 'Chat profile error!' text field when the prop 'error' is undefined", () => {
    render(themed(<ChatProfile chat={currentChat} />));
    const loginFailedTextComponent = screen.queryByText('Chat profile error!');
    expect(loginFailedTextComponent).toBeNull();
  });
  it(
    "displays texts 'Chat profile error!' and 'please check network connection and try again' when " +
      "the prop 'error' is set to 'NET_ERROR'",
    () => {
      render(themed(<ChatProfile chat={currentChat} error="NET_ERROR" />));
      const chatProfileErrorComponent = screen.queryByText(
        'Chat profile error!',
      );
      expect(chatProfileErrorComponent).not.toBeNull();
      const networkErrorTextComponent = screen.queryByText(
        'please check network connection and try again',
      );
      expect(networkErrorTextComponent).not.toBeNull();
    },
  );
});
