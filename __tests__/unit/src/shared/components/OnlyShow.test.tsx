import React from 'react';
import {Text} from 'react-native';
import renderer from 'react-test-renderer';
import OnlyShow from '../../../../../src/shared/components/OnlyShow';

describe('OnlyShow', () => {
  it('correctly renders its child component when the If prop is truthy', () => {
    const child = <Text>Im am the child component</Text>;
    const tree = renderer
      .create(<OnlyShow If={true}>{child}</OnlyShow>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('does not render its child component when the If prop is falsy', () => {
    const child = <Text>Testing Text</Text>;
    const tree = renderer
      .create(<OnlyShow If={false}>{child}</OnlyShow>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
