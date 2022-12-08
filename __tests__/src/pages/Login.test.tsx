import React, {ReactNode} from 'react';
import renderer from 'react-test-renderer';
import {ThemeProvider} from '../../../src/context/theme';
import {Login} from '../../../src/pages/LoginPage';

const themed = (child: ReactNode) => <ThemeProvider>{child}</ThemeProvider>;

describe('Login page', () => {
  test('renders correctly when empty credentials and no error', () => {
    const tree = renderer
      .create(
        themed(
          <Login
            userCredentials={{handle: '', token: ''}}
            onPressLoginBtn={_ => {}}
          />,
        ),
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
