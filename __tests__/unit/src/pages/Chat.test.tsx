import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react-native';
import Chat from '../../../../src/pages/Chat/Chat';
import themed from '../../utils/themed';
import {CHATS} from '../../../mockdata/chat';

describe('Chat page', () => {
  beforeEach(() => {
    cleanup();
  });
  test(
    'the navbar should contain a back button which should call ' +
      "the prop 'onBackToHome' on click",
    () => {
      const mockOnBackToHome = jest.fn().mockName('mockOnBackToHome');
      render(themed(<Chat onBackToHome={mockOnBackToHome} />));
      expect(screen.queryByLabelText('chat navigation bar')).not.toBeNull();
      const backButton = screen.getByLabelText('back to home');
      fireEvent.press(backButton);
      expect(mockOnBackToHome).toBeCalledTimes(1);
    },
  );
  test(
    'the navbar should contain a chat profile field which should call ' +
      "the prop 'onOpenChatProfile' on click",
    () => {
      const mockOnOpenChatProfile = jest.fn().mockName('mockOnOpenChatProfile');
      const chat = CHATS[0];
      render(
        themed(<Chat chat={chat} onOpenChatProfile={mockOnOpenChatProfile} />),
      );
      expect(screen.queryByLabelText('chat navigation bar')).not.toBeNull();
      const openChatProfileField = screen.getByLabelText('open chat profile');
      fireEvent.press(openChatProfileField);
      expect(mockOnOpenChatProfile).toBeCalledTimes(1);
    },
  );
  test(
    "should contain a 'compose message' button which adds a " +
      "'mesage composer' and disappears when clicked",
    () => {
      render(themed(<Chat />));
      expect(screen.queryByLabelText('message composer')).toBeNull();
      const composeButton = screen.getByLabelText('compose message');
      fireEvent.press(composeButton);
      expect(screen.queryByLabelText('message composer')).not.toBeNull();
      expect(screen.queryByLabelText('compose message')).toBeNull();
    },
  );
});
