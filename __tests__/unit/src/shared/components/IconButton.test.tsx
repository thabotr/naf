import React from 'react';
import renderer from 'react-test-renderer';
import IconButton from '../../../../../src/shared/components/IconButton';
import themed from '../../../utils/themed';

describe('IconButton', () => {
  it('renders correctly', () => {
    const tree = renderer.create(themed(<IconButton icon="delete" />)).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
