import React from 'react';
import {
  render,
  screen,
  cleanup,
  fireEvent,
} from '@testing-library/react-native';
import Home from '../../../../src/pages/Home';
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
          onOpenUserProfile={() => {}}
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
          onOpenUserProfile={() => {}}
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
      render(
        themed(
          <Home
            chats={[]}
            onOpenPreferences={onOpenPreferencesMock}
            onOpenUserProfile={() => {}}
          />,
        ),
      );
      screen.getByLabelText('home navigation bar');
      const openPreferencesButton = screen.getByLabelText('open preferences');
      fireEvent.press(openPreferencesButton);
      expect(onOpenPreferencesMock).toBeCalledTimes(1);
    },
  );
  test(
    'the navbar should contain the user profile link which should call ' +
      "the prop 'onOpenUserProfile' on click",
    () => {
      const onOpenUserProfileMock = jest.fn().mockName('onOpenUserProfileMock');
      render(
        themed(
          <Home
            chats={[]}
            onOpenPreferences={() => {}}
            onOpenUserProfile={onOpenUserProfileMock}
          />,
        ),
      );
      screen.getByLabelText('home navigation bar');
      const openUserProfileLink = screen.getByLabelText('open user profile');
      fireEvent.press(openUserProfileLink);
      expect(onOpenUserProfileMock).toBeCalledTimes(1);
    },
  );
});
