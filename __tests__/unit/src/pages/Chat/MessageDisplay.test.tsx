import React from 'react';
import {render, screen} from '@testing-library/react-native';
import MessageDisplay from '../../../../../src/pages/Chat/MessageDisplay';
import themed from '../../../utils/themed';
import {Message} from '../../../../../src/pages/Chat/types/Message';

describe('Chat page', () => {
  describe('MessageDisplay', () => {
    const message: Message = {
      text: 'some text',
      fromHandle: 'testHandle',
      toHandle: 'testHandle2',
      timestamp: new Date(),
    };
    beforeEach(() => {
      render(themed(<MessageDisplay fromMe message={message} />));
    });
    test('contains the text from the given message', () => {
      const textField = screen.queryByText(message.text);
      expect(textField).not.toBeNull();
    });
    test(
      "it is accessible by the label 'message from <fromHandle> " +
        "to <toHandle> @ <timestamp>'",
      () => {
        const textField = screen.queryByLabelText(
          `message from ${message.fromHandle} to ${
            message.toHandle
          } @ ${message.timestamp.getTime()}`,
        );
        expect(textField).not.toBeNull();
      },
    );
  });
});
