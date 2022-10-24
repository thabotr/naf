export type ThemeType = {
  dark: boolean;
  color: {
    primary: string;
    secondary: string;
    userPrimary: string;
    friendPrimary: string;
    userSecondary: string;
    friendSecondary: string;
  }
};

export type ThemeContextType = {
  theme: ThemeType;
  toggleDarkTheme: ()=>void;
};