import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react-native';
import ThemePreferences from '../../../../../src/pages/Preferences/ThemePreferences';
import themed from '../../../utils/themed';
const mockSaveThemeFromSetting = jest.fn().mockName('mockSaveThemeFromSetting');

jest.mock('../../../../../src/shared/providers/theme', () => {
  return {
    ...jest.requireActual('../../../../../src/shared/providers/theme'),
    useTheme: new Proxy(
      jest.requireActual('../../../../../src/shared/providers/theme').useTheme,
      {
        apply(target, thisArg, argArray) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const realResult: any = Reflect.apply(target, thisArg, argArray);
          return {
            ...realResult,
            saveThemeFromSetting: mockSaveThemeFromSetting,
          };
        },
      },
    ),
  };
});

describe('Preferences Page', () => {
  describe('ThemePreferences Component', () => {
    beforeEach(() => {
      mockSaveThemeFromSetting.mockClear();
    });
    it(
      "should call useTheme's saveThemeFromSetting with argument 'light' when " +
        'clicking the set light theme button',
      () => {
        render(themed(<ThemePreferences />));
        const setLightThemeButton = screen.getByLabelText('set light theme');
        fireEvent.press(setLightThemeButton);
        expect(mockSaveThemeFromSetting).toBeCalledWith('light');
      },
    );
    it(
      "should call useTheme's saveThemeFromSetting with argument 'dark' when " +
        'clicking the set dark theme button',
      () => {
        render(themed(<ThemePreferences />));
        const setLightThemeButton = screen.getByLabelText('set dark theme');
        fireEvent.press(setLightThemeButton);
        expect(mockSaveThemeFromSetting).toBeCalledWith('dark');
      },
    );
    it(
      "should call useTheme's saveThemeFromSetting with argument 'system_default' when " +
        'clicking the use system theme button',
      () => {
        render(themed(<ThemePreferences />));
        const setLightThemeButton = screen.getByLabelText('use system theme');
        fireEvent.press(setLightThemeButton);
        expect(mockSaveThemeFromSetting).toBeCalledWith('system_default');
      },
    );
  });
});
