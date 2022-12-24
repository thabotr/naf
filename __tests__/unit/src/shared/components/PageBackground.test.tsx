import React from 'react';
import renderer from 'react-test-renderer';
import PageBackground from '../../../../../src/shared/components/PageBackground';
import themed from '../../../utils/themed';

describe('PageBackground', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(themed(<PageBackground pageLabel="test page" />))
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
