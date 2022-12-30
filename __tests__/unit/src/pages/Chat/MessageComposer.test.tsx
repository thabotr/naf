import {fireEvent, render, screen} from '@testing-library/react-native';
import React from 'react';
import MessageComposer from '../../../../../src/pages/Chat/MessageComposer';
import themed from '../../../utils/themed';

type MsgComposerProps = React.ComponentProps<typeof MessageComposer>;

function doNothing(..._: unknown[]) {
  //do nothing
}
function getComposerFromFactory(
  overrides: Partial<MsgComposerProps>,
): JSX.Element {
  const dummyMessage = {text: ''};
  const defaultProps: MsgComposerProps = {
    initialMessage: dummyMessage,
    onDiscardMessage: doNothing,
    onSendMessage: doNothing,
  };
  return themed(<MessageComposer {...defaultProps} {...overrides} />);
}

describe('Chat page', () => {
  describe('MessageComposer', () => {
    const inititalText = 'hello';
    test(
      'when the initial message text is falsy then the text field should be ' +
        'empty and the send button should be disabled',
      () => {
        render(getComposerFromFactory({}));
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
        render(getComposerFromFactory({initialMessage: {text: inititalText}}));
        const textInputField = screen.getByLabelText('message text input');
        expect(textInputField.props.defaultValue).toBe(inititalText);
        const sendButton = screen.getByLabelText('send message');
        expect(sendButton.props.accessibilityState.disabled).toBeFalsy();
      },
    );
    it('disables the send button when the text input field is cleared', () => {
      render(getComposerFromFactory({initialMessage: {text: inititalText}}));
      const textInputField = screen.getByLabelText('message text input');
      fireEvent.changeText(textInputField, '');
      const sendButton = screen.getByLabelText('send message');
      expect(sendButton.props.accessibilityState.disabled).toBeTruthy();
    });
    it('enables the send button when the text input field is populated', () => {
      render(getComposerFromFactory({}));
      const textInputField = screen.getByLabelText('message text input');
      const someText = 'a';
      fireEvent.changeText(textInputField, someText);
      const sendButton = screen.getByLabelText('send message');
      expect(sendButton.props.accessibilityState.disabled).toBeFalsy();
    });
    const composedMessage = {text: inititalText};
    it(
      "should call the 'onSendMessage' prop with the composed message when " +
        'the send message button is clicked',
      () => {
        const mockOnSendMessage = jest.fn().mockName('mockOnSendMessage');
        render(
          getComposerFromFactory({
            initialMessage: composedMessage,
            onSendMessage: mockOnSendMessage,
          }),
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
        render(
          getComposerFromFactory({
            initialMessage: composedMessage,
            onDiscardMessage: mockOnDiscardMessage,
          }),
        );
        const discardButton = screen.getByLabelText('discard message');
        fireEvent.press(discardButton);
        expect(mockOnDiscardMessage).toBeCalledTimes(1);
        expect(mockOnDiscardMessage).toBeCalledWith(composedMessage);
      },
    );
  });
});
