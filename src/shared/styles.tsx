import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  horizontal: {
    display: 'flex',
    flexDirection: 'row',
  },
  square: {
    borderRadius: 0,
  },
  avatarDimensions: {
    width: 50,
    height: 50,
  },
  loginErrorText: {color: 'red', textAlign: 'center'},
  loginErrorSubText: {fontStyle: 'italic'},
  card: {
    margin: 3,
    elevation: 3,
  },
});

const globalThemedStyles = (theme: any) =>
  StyleSheet.create({
    navbar: {
      ...styles.horizontal,
      backgroundColor: theme.color.primary,
      justifyContent: 'space-between',
      paddingRight: 15,
    },
  });

export default styles;
export {globalThemedStyles};
