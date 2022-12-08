import React from 'react';
import renderer from 'react-test-renderer';
import {Text} from 'react-native';
import {HorizontalView} from '../../../../src/components/Helpers/HorizontalView';

test('renders child elements horizontally', () => {
  const tree = renderer
    .create(
      <HorizontalView>
        <Text>column one</Text>
        <Text>column two</Text>
      </HorizontalView>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
