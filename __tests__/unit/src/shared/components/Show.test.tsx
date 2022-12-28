import React from 'react';
import {Text} from 'react-native';
import renderer from 'react-test-renderer';
import Show from '../../../../../src/shared/components/Show';

describe('HorizontalView', () => {
  const childForTruthy = <Text>I am here because If is truthy</Text>;
  const childForFalsy = <Text>I am here because If is falsy</Text>;
  it("correctly renders the child component in the 'component' prop given a truthy 'If' prop", () => {
    const tree = renderer
      .create(
        <Show component={childForTruthy} If={true} ElseShow={childForFalsy} />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("correctly renders the child component in the 'ElseShow' prop given a falsy 'If' prop", () => {
    const tree = renderer
      .create(
        <Show component={childForTruthy} If={false} ElseShow={childForFalsy} />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
