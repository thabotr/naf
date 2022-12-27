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
      screen.getByLabelText('chat navigation bar');
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
      screen.getByLabelText('chat navigation bar');
      const openChatProfileField = screen.getByLabelText('open chat profile');
      fireEvent.press(openChatProfileField);
      expect(mockOnOpenChatProfile).toBeCalledTimes(1);
    },
  );
});
