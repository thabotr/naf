import React from 'react';
import renderer from 'react-test-renderer';
import FloatBottomRight from '../../../../../src/shared/components/FloatBottomRight';

describe('FloatBottomRight', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<FloatBottomRight />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
