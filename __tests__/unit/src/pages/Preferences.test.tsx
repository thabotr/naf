import React from 'react';
import {
  render,
  screen,
  cleanup,
  fireEvent,
} from '@testing-library/react-native';
import themed from '../../utils/themed';
import {Preferences} from '../../../../src/pages/Preferences/Preferences';

describe('Preferences page', () => {
  beforeEach(() => {
    cleanup();
  });
  test(
    'the navbar should contain the back to home button which should call ' +
      "the prop 'onBackToHome' on click",
    () => {
      const onBackToHomeMock = jest.fn().mockName('onBackToHomeMock');
      render(themed(<Preferences onBackToHome={onBackToHomeMock} />));
      screen.getByLabelText('preferences navigation bar');
      const backToHomeButton = screen.getByLabelText('back to home');
      fireEvent.press(backToHomeButton);
      expect(onBackToHomeMock).toBeCalledTimes(1);
    },
  );
});
