import { StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_WEIGHTS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
  gasSettings: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 5,
  },
  options: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 73,
  },
  nthChild2: {
    marginLeft: 8,
  },
  settings: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    display: 'flex',
    width: 304,
    height: 168,
    backgroundColor: COLORS.gray_light_200,
    borderRadius: 16,
  },
  content: {
    display: 'flex',
    flex: 1,
    margin: 16,
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 36,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeftText: {
    // fontFamily: FONTS.inter,
    fontWeight: FONT_WEIGHTS.semibold,
    fontSize: 18,
    color: COLORS.purple,
    marginBottom: 0,
    marginTop: 0,
  },
  headerRightWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headerRight: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  headerText: {
    minWidth: 6,
    maxWidth: 24,
    marginRight: 8,
    border: 'none',
    // fontFamily: FONTS.quicksand,
    fontWeight: 'bold',
    fontSize: 14,
    color: COLORS.purple,
    marginBottom: 0,
    marginTop: 0,
  },
  headerTextLast: {
    fontSize: 14,
    fontFamily: FONTS.rubik,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.black,
    marginBottom: 0,
    marginTop: 0,
  },
  bodySlideLabel: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bodySlideText: {
    flex: 1,
    fontFamily: FONTS.inter,
    fontSize: 12,
    fontWeight: FONT_WEIGHTS.medium,
    marginBottom: 0,
    marginTop: 0,
  },
  bodySlideSpeedText: {
    textAlign: 'right',
  },
  settingsFooter: {
    marginTop: 12,
    marginBottom: 12,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  footerButton: {
    flex: 1,
  },
  updatedWrapper: {
    display: 'flex',
    flexDirection: 'row',
    width: 304,
    height: 36,
    alignItems: 'center',
    backgroundColor: COLORS.green_light,
    borderRadius: 16,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  updatedIcon: {
    marginTop: 0,
    marginRight: 10,
    marginBottom: 0,
    marginLeft: 18,
  },
  updatedBoxText: {
    color: COLORS.green_dark,
    fontFamily: FONTS.rubik,
    fontStyle: 'normal',
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: 14,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 5,
  },
  cancel: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cancelBox: {
    display: 'flex',
    height: 148,
    backgroundColor: COLORS.gray_light_200,
    borderRadius: 16,
  },
  cancelBoxContent: {
    display: 'flex',
    margin: 16,
    flexDirection: 'column',
    fontFamily: FONTS.rubik,
  },
  cancelHeader: {
    fontSize: 18,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: 8,
  },
  cancelBodyText: {
    fontSize: 14,
    fontWeight: FONT_WEIGHTS.medium,
  },
  cancelFooter: {
    marginTop: 12,
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  cancelFooterLeft: {
    marginRight: 8,
  },
  outlineButton: {
    height: 36,
    minWidth: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 20,
  },
  outlineButtonText: {
    marginVertical: 0,
    fontFamily: FONTS.rubik,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
  },
  solidButton: {
    minWidth: 100,
    height: 36,
  },
  solidButtonText: {
    marginVertical: 0,
    fontFamily: FONTS.rubik,
    fontSize: 13,
    fontWeight: FONT_WEIGHTS.bold,
  },
  circleIconButton: {
    display: 'flex',
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 20,
  },
});

export default styles;
