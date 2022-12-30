import React from 'react';
import {render, screen} from '@testing-library/react-native';
import MessageDisplay from '../../../../../src/pages/Chat/MessageDisplay';
import themed from '../../../utils/themed';

describe('Chat page', () => {
  describe('MessageDisplay', () => {
    test('contains the text from the given message', () => {
      const message = {text: 'some text'};
      render(themed(<MessageDisplay message={message} />));
      const textField = screen.queryByText(message.text);
      expect(textField).not.toBeNull();
    });
  });
});
