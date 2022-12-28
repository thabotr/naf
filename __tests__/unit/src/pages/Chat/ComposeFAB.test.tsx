import React from 'react';
import renderer from 'react-test-renderer';
import ComposeFAB from '../../../../../src/pages/Chat/ComposeFAB';

describe('Chat', () => {
  describe('ComposeFAB', () => {
    it('renders correctly', () => {
      const tree = renderer.create(<ComposeFAB />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
