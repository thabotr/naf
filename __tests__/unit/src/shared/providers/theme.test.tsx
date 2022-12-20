import {renderHook} from '@testing-library/react-native';
import {act} from 'react-test-renderer';
import {
  ThemeProvider,
  useTheme,
} from '../../../../../src/shared/providers/theme';

const mockedColorScheme = jest.fn();
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  ...jest.requireActual('react-native/Libraries/Utilities/useColorScheme'),
  default: mockedColorScheme,
}));

describe(ThemeProvider, () => {
  describe(useTheme, () => {
    describe('saveThemeFromSetting', () => {
      test("should set theme to dark given argument 'system_default' and system is actually in dark mode", () => {
        mockedColorScheme.mockReturnValue('dark');
        const {result} = renderHook(() => useTheme(), {
          wrapper: ThemeProvider,
        });
        act(() => {
          result.current.saveThemeFromSetting('system_default');
        });
        expect(result.current.theme.dark).toBeTruthy();
      });
      test("should set theme to light given argument 'system_default' and system is actually not in dark mode", () => {
        mockedColorScheme.mockReturnValue('light');
        const {result} = renderHook(() => useTheme(), {
          wrapper: ThemeProvider,
        });
        act(() => {
          result.current.saveThemeFromSetting('system_default');
        });
        expect(result.current.theme.dark).toBeFalsy();
      });
      test("should set theme to light given argument 'light'", () => {
        mockedColorScheme.mockReturnValue('dark');
        const {result} = renderHook(() => useTheme(), {
          wrapper: ThemeProvider,
        });
        act(() => {
          result.current.saveThemeFromSetting('light');
        });
        expect(result.current.theme.dark).toBeFalsy();
      });
      test("should set theme to dark given argument 'dark'", () => {
        mockedColorScheme.mockReturnValue('dark');
        const {result} = renderHook(() => useTheme(), {
          wrapper: ThemeProvider,
        });
        act(() => {
          result.current.saveThemeFromSetting('dark');
        });
        expect(result.current.theme.dark).toBeTruthy();
      });
    });
  });
});
