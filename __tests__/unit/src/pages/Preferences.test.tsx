import React from 'react';
import {
  render,
  screen,
  cleanup,
  fireEvent,
} from '@testing-library/react-native';
import themed from '../../utils/themed';
import {Preferences} from '../../../../src/pages/Preferences/Preferences';
import {doNothing} from '../../utils/doNothing';

type Props = React.ComponentProps<typeof Preferences>;

function preferencesPageFromFactory(overrides: Partial<Props>) {
  const defaultProps: Props = {
    onBackToHome: doNothing,
  };
  return render(themed(<Preferences {...defaultProps} {...overrides} />));
}

describe('Preferences page', () => {
  beforeEach(() => {
    cleanup();
  });
  test(
    'the navbar should contain the back to home button which should call ' +
      "the prop 'onBackToHome' on click",
    () => {
      const mockOnBackToHome = jest.fn().mockName('mockOnBackToHome');
      preferencesPageFromFactory({onBackToHome: mockOnBackToHome});
      screen.getByLabelText('preferences navigation bar');
      const backToHomeButton = screen.getByLabelText('back to home');
      fireEvent.press(backToHomeButton);
      expect(mockOnBackToHome).toBeCalledTimes(1);
    },
  );
});
