import { StyleSheet } from 'react-native';

import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.gray_light_100,
    flexGrow: 1,
    width: '100%',
    paddingTop: 0,
    paddingBottom: 24,
    paddingRight: 24,
    paddingLeft: 24,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginTop: 24,
    boxSizing: 'border-box',
    marginBottom: 12,
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.gray_dark,
    cursor: 'initial',
  },
});

export default styles;