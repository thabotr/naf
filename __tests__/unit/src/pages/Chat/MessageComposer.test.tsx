import React from 'react';
import renderer from 'react-test-renderer';
import MessageComposer from '../../../../../src/pages/Chat/MessageComposer';

describe('Chat', () => {
  describe('MessageComposer', () => {
    it('renders correctly', () => {
      const tree = renderer.create(<MessageComposer />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
