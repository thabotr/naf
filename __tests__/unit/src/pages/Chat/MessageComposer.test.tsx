import {fireEvent, render, screen} from '@testing-library/react-native';
import React from 'react';
import MessageComposer from '../../../../../src/pages/Chat/MessageComposer';
import themed from '../../../utils/themed';

describe('Chat page', () => {
  describe('MessageComposer', () => {
    const inititalText = 'hello';
    test(
      'when the initial message text is falsy then the text field should be ' +
        'empty and the send button should be disabled',
      () => {
        render(themed(<MessageComposer />));
        const textInputField = screen.getByLabelText('message text input');
        expect(textInputField.props.defaultValue).toBeFalsy();
        const sendButton = screen.getByLabelText('send message');
        expect(sendButton.props.accessibilityState.disabled).toBeTruthy();
      },
    );
    test(
      'when the initial message text is given then the text field should contain ' +
        'that text and the send button should be enabled',
      () => {
        render(
          themed(<MessageComposer initialMessage={{text: inititalText}} />),
        );
        const textInputField = screen.getByLabelText('message text input');
        expect(textInputField.props.defaultValue).toBe(inititalText);
        const sendButton = screen.getByLabelText('send message');
        expect(sendButton.props.accessibilityState.disabled).toBeFalsy();
      },
    );
    it('disables the send button when the text input field is cleared', () => {
      render(themed(<MessageComposer initialMessage={{text: inititalText}} />));
      const textInputField = screen.getByLabelText('message text input');
      fireEvent.changeText(textInputField, '');
      const sendButton = screen.getByLabelText('send message');
      expect(sendButton.props.accessibilityState.disabled).toBeTruthy();
    });
    it('enables the send button when the text input field is populated', () => {
      render(themed(<MessageComposer />));
      const textInputField = screen.getByLabelText('message text input');
      const someText = 'a';
      fireEvent.changeText(textInputField, someText);
      const sendButton = screen.getByLabelText('send message');
      expect(sendButton.props.accessibilityState.disabled).toBeFalsy();
    });
    it(
      "should call the 'onSendMessage' prop with the composed message when " +
        'the send message button is clicked',
      () => {
        const mockOnSendMessage = jest.fn().mockName('mockOnSendMessage');
        const composedMessage = {text: inititalText};
        render(
          themed(
            <MessageComposer
              initialMessage={composedMessage}
              onSendMessage={mockOnSendMessage}
            />,
          ),
        );
        const sendButton = screen.getByLabelText('send message');
        fireEvent.press(sendButton);
        expect(mockOnSendMessage).toBeCalledTimes(1);
        expect(mockOnSendMessage).toBeCalledWith(composedMessage);
      },
    );
    it(
      "should call the 'onDiscardMessage' prop with the composed message when " +
        'the discard message button is clicked',
      () => {
        const mockOnDiscardMessage = jest.fn().mockName('mockOnDiscardMessage');
        const composedMessage = {text: inititalText};
        render(
          themed(
            <MessageComposer
              initialMessage={composedMessage}
              onDiscardMessage={mockOnDiscardMessage}
            />,
          ),
        );
        const discardButton = screen.getByLabelText('discard message');
        fireEvent.press(discardButton);
        expect(mockOnDiscardMessage).toBeCalledTimes(1);
        expect(mockOnDiscardMessage).toBeCalledWith(composedMessage);
      },
    );
  });
});
