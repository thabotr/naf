import React from 'react';
import {
  render,
  screen,
  cleanup,
  fireEvent,
} from '@testing-library/react-native';
import Home from '../../../../src/pages/Home/Home';
import themed from '../../utils/themed';
import {CHATS} from '../../../mockdata/chat';

describe('Home page', () => {
  beforeEach(() => {
    cleanup();
  });
  test("displays chat preview cards if and only if the prop 'chats' is a non-empty array", () => {
    render(
      themed(
        <Home
          chats={[]}
          onOpenPreferences={() => {}}
          onOpenMyProfile={() => {}}
        />,
      ),
    );
    const chatPreviewCard = screen.queryByLabelText(/chat w\//);
    expect(chatPreviewCard).toBeNull();

    render(
      themed(
        <Home
          chats={CHATS}
          onOpenPreferences={() => {}}
          onOpenMyProfile={() => {}}
        />,
      ),
    );
    const chatPreviewCards = screen.queryAllByLabelText(/chat w\//);
    const maxRenderableChatItems = 10;
    expect(chatPreviewCards.length).toBe(maxRenderableChatItems);
  });
  test(
    'the navbar should contain the preferences button which should call ' +
      "the prop 'onOpenPreferences' on click",
    () => {
      const onOpenPreferencesMock = jest.fn().mockName('onOpenPreferencesMock');
      render(themed(<Home onOpenPreferences={onOpenPreferencesMock} />));
      screen.getByLabelText('home navigation bar');
      const openPreferencesButton = screen.getByLabelText('open preferences');
      fireEvent.press(openPreferencesButton);
      expect(onOpenPreferencesMock).toBeCalledTimes(1);
    },
  );
  test(
    "the navbar should contain the user's profile link which should call " +
      "the prop 'onOpenMyProfile' on click",
    () => {
      const onOpenMyProfileMock = jest.fn().mockName('onOpenMyProfileMock');
      render(themed(<Home onOpenMyProfile={onOpenMyProfileMock} />));
      screen.getByLabelText('home navigation bar');
      const openUserProfileLink = screen.getByLabelText('open my profile');
      fireEvent.press(openUserProfileLink);
      expect(onOpenMyProfileMock).toBeCalledTimes(1);
    },
  );
  test("should call the 'onOpenChat' prop with the subject chat when a chat link is clicked", () => {
    const chat = CHATS[0];
    const mockOnOpenChat = jest.fn().mockName('mockOnOpenChat');
    render(themed(<Home chats={CHATS} onOpenChat={mockOnOpenChat} />));
    const openChatLink = screen.getByLabelText(`open chat ${chat.user.handle}`);
    fireEvent.press(openChatLink);
    expect(mockOnOpenChat).toBeCalledTimes(1);
    expect(mockOnOpenChat).toBeCalledWith(chat);
  });
});
