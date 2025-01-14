///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { scale } from 'react-native-size-matters';

///////////////////////////
// Components
///////////////////////////

import TextV3 from 'components/TextV3';
import TextInput from 'components/TextInput';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';

///////////////////////////
// Types
///////////////////////////

import IImportPhrase from './types';

///////////////////////////
// Styles
///////////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './styles';

///////////////////////////
// Scene
///////////////////////////

import Layout from 'scenes/common/Layout';

///////////////////////////
// Constants
///////////////////////////

const EXTRA_SCROLL_HEIGHT = scale(25);

const ImportPhrase: FC<IImportPhrase> = ({
  control,
  handleSubmit,
  register,
  onSubmit,
  isInvalid,
  isDisabled,
}) => {
  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      extraScrollHeight={EXTRA_SCROLL_HEIGHT}>
      <Layout title="Let's import your wallet">
        <TextV3.Caption color={COLORS_ENUMS.BLACK}>
          Paste your recovery seed phrase below:
        </TextV3.Caption>
        <TextInput
          name="phrase"
          type="text"
          autoCapitalize="none"
          returnKeyType="done"
          autoCorrect={false} 
          control={control}
          keyboardType='web-search'
          inputContainerStyle={styles.phraseInput}
          multiline
          fullWidth
          blurOnSubmit
        />
        <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>
          The phrase can be 12, 15, 18, 21 or 24 words with a single space between.
        </TextV3.CaptionStrong>
        {isInvalid && (
          <TextV3.Caption extraStyles={styles.errorLabel}color={COLORS_ENUMS.RED}>Invalid recovery seed phrase</TextV3.Caption>
        )}
        <View style={styles.buttonContainer}>
          <ButtonV3
            type={BUTTON_TYPES_ENUM.PRIMARY}
            size={BUTTON_SIZES_ENUM.LARGE}
            title={'Import'}
            disabled={isDisabled}
            onPress={handleSubmit(data => { onSubmit(data) })}
          />
        </View>
      </Layout>
    </KeyboardAwareScrollView>
  );
};

export default ImportPhrase;
