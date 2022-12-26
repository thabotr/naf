import {fireEvent, render, screen} from '@testing-library/react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import BackToHomeNavigationBar from '../../../../../src/shared/components/BackToHomeNavigationBar';
import themed from '../../../utils/themed';

describe('BackToHomeNavigationBar', () => {
  it('renders correctly', () => {
    const tree = renderer.create(themed(<BackToHomeNavigationBar />)).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("calls the 'onBackToHome' prop when the back to home button is clicked", () => {
    const mockOnBackToHome = jest.fn().mockName('mockOnBackToHome');
    render(themed(<BackToHomeNavigationBar onBackToHome={mockOnBackToHome} />));
    const backToHomeButton = screen.getByLabelText('back to home');
    fireEvent.press(backToHomeButton);
    expect(mockOnBackToHome).toHaveBeenCalledTimes(1);
  });
});
