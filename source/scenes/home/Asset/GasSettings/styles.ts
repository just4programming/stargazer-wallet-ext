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
    width: '100%',
    height: 36,
    // backgroundColor: orange,
    alignItems: 'center',
  },
  headerWrapper: {
    display: 'flex',
    flex: 1,
    },
  headerLeftText: {
      // backgroundColor: blue,
    fontFamily: FONTS.inter,
    fontWeight: FONT_WEIGHTS.semibold,
    fontSize: 18,
    color: COLORS.purple,
    },
    headerRightWrapper: {
      display: 'flex',
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
      // minWidth: 2,
      // maxWidth: 4,
      marginRight: 8,
      border: 'none',
      fontFamily: FONTS.quicksand,
      fontWeight: 'bold',
      fontSize: 14,
      color: COLORS.purple,
    },
    headerTextLast: {
      fontSize: 14,
      fontFamily: FONTS.rubik,
      fontWeight: FONT_WEIGHTS.medium,
    },
    bodySlideLabel: {
      display: 'flex',
      flexDirection: 'row',
    },
    bodySlide: {
      flex: 1,
      fontFamily: FONTS.inter,
      fontSize: 12,
      fontWeight: FONT_WEIGHTS.medium,
    },
    bodySlideLastChild: {
      display: 'flex',
      justifyContent: 'flex-end',
  },
  footer: {
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  cancelButton: {
      marginRight: 8,
  },
  updated: {
    display: 'flex',
    justifyContent: 'center',
  },
  updatedBox: {
      display: 'flex',
      width: 304,
      height: 36,
      alignItems: 'center',
      backgroundColor: COLORS.green_light,
      borderRadius: 16,
  },
  updatedBoxImg: {
    margin: 0 10 0 18,
    width: 10,
    height: 10,
  },
  updatedBoxText: {
    color: COLORS.green_dark,
    fontFamily: FONTS.rubik,
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cancel: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBox: {
      display: 'flex',
      width: 304,
      height: 148,
      background: COLORS.gray_light_200,
      borderRadius: 16,
  },
  cancelBoxContent: {
        display: 'flex',
        flex: 1,
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
    marginTop: 8,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  cancelFirstChild: {
      marginRight: 8,
  },
  outlineButton: {
    display: 'flex',
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2, 
    borderColor:COLORS.primary,
    borderRadius: 20,
  },
outlineButtonText: {
    marginVertical: 0,
    marginHorizontal: 24,
    fontFamily: FONTS.rubik,
    fontSize: 14,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: 20,
    color: COLORS.primary,
},
solidButton: {
  display: 'flex',
  height: 36,
  backgroundColor: COLORS.primary,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 20,
},
solidButtonText: {
    marginVertical: 0,
    marginHorizontal: 24,
    fontFamily: FONTS.rubik,
    fontSize: 13,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.white,
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
}
}),

export default styles;