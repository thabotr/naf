import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react-native';
import Chat from '../../../../src/pages/Chat/Chat';
import themed from '../../utils/themed';
import {dummyChat} from '../../utils/dummyChat';
import {doNothing} from '../../utils/doNothing';

type ChatProps = React.ComponentProps<typeof Chat>;
const getChatFromFactory = (overrides: Partial<ChatProps>) => {
  const defaultProps: ChatProps = {
    chat: dummyChat,
    onOpenChatProfile: doNothing,
    onBackToHome: doNothing,
    onSendMessage: doNothing,
  };
  return themed(<Chat {...defaultProps} {...overrides} />);
};

describe('Chat page', () => {
  beforeEach(() => {
    cleanup();
  });
  test(
    'the navbar should contain a back button which should call ' +
      "the prop 'onBackToHome' on click",
    () => {
      const mockOnBackToHome = jest.fn().mockName('mockOnBackToHome');
      render(
        getChatFromFactory({
          onBackToHome: mockOnBackToHome,
        }),
      );
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
      render(
        getChatFromFactory({
          onOpenChatProfile: mockOnOpenChatProfile,
        }),
      );
      expect(screen.queryByLabelText('chat navigation bar')).not.toBeNull();
      const openChatProfileField = screen.getByLabelText('open chat profile');
      fireEvent.press(openChatProfileField);
      expect(mockOnOpenChatProfile).toBeCalledTimes(1);
    },
  );
  const getComposeButton = () => screen.getByLabelText('compose message');
  const queryMessageComposer = () =>
    screen.queryByLabelText('message composer');
  const queryComposeButton = () => screen.queryByLabelText('compose message');
  test(
    "should contain a 'compose message' button which adds a " +
      "'mesage composer' and disappears when clicked",
    () => {
      render(getChatFromFactory({}));
      expect(queryMessageComposer()).toBeNull();
      fireEvent.press(getComposeButton());
      expect(queryMessageComposer()).not.toBeNull();
      expect(queryComposeButton()).toBeNull();
    },
  );
  describe('during message composition', () => {
    const mockOnSendMessage = jest.fn().mockName('mockOnSendMessage');
    beforeEach(() => {
      render(
        getChatFromFactory({
          onSendMessage: mockOnSendMessage,
        }),
      );
      fireEvent.press(getComposeButton());
      expect(queryMessageComposer()).not.toBeNull();
    });
    test(
      'when the discard message button is clicked then the message composer should ' +
        'become invisible and the compose message button should become visible',
      () => {
        const discardButton = screen.getByLabelText('discard message');
        fireEvent.press(discardButton);
        expect(queryMessageComposer()).toBeNull();
        expect(queryComposeButton()).not.toBeNull();
      },
    );
    test(
      'when the enabled send message button is clicked then the message composer should ' +
        'become invisible, the compose message button should become visible, and the ' +
        "onSendMessage' prop should be called with the composed message",
      () => {
        const aMessage = {text: 'hello'};
        const textInputField = screen.getByLabelText('message text input');
        fireEvent.changeText(textInputField, aMessage.text);
        const sendButton = screen.getByLabelText('send message');
        fireEvent.press(sendButton);
        expect(mockOnSendMessage).toBeCalledTimes(1);
        expect(mockOnSendMessage).toBeCalledWith(aMessage);
        expect(queryMessageComposer()).toBeNull();
        expect(queryComposeButton()).not.toBeNull();
      },
    );
  });
});
