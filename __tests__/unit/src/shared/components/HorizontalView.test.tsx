import React from 'react';
import renderer from 'react-test-renderer';
import HorizontalView from '../../../../../src/shared/components/HorizontalView';

describe('HorizontalView', () => {
  it('correctly renders its child components horizontally', () => {
    const tree = renderer.create(<HorizontalView>{}</HorizontalView>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
