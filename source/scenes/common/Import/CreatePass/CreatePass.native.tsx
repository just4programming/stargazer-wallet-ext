///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { View } from 'react-native';
import { scale } from 'react-native-size-matters';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

///////////////////////////
// Components
///////////////////////////

import TextV3 from 'components/TextV3';
import CheckIcon from 'components/CheckIcon';
import TextInput from 'components/TextInput';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';

///////////////////////////
// Types
///////////////////////////

import ICreatePass from './types';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles';
import { COLORS_ENUMS } from 'assets/styles/colors';

///////////////////////////
// Scene
///////////////////////////

import Layout from 'scenes/common/Layout';

///////////////////////////
// Constants
///////////////////////////

const EXTRA_SCROLL_HEIGHT = scale(25);

const CreatePass: FC<ICreatePass> = ({
  control,
  onSubmit,
  handleSubmit,
  nextHandler,
  passed,
  errors,
  comment,
  title,
}) => {
  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <KeyboardAwareScrollView 
      contentContainerStyle={styles.layout}
      extraScrollHeight={EXTRA_SCROLL_HEIGHT}>
        <Layout title={title}>
          {passed ? (
            <View style={styles.checkIcon}>
              <CheckIcon />
            </View>
          ) : (
            <>
              <TextInput
                name="password"
                type="password"
                placeholder="Please enter at least 8 characters"
                control={control}
                visiblePassword
                inputContainerStyle={styles.passwordContainer}
              />
              <TextInput
                name="repassword"
                type="password"
                placeholder="Please enter at least 8 characters"
                control={control}
                visiblePassword
                inputContainerStyle={styles.passwordContainer}
              />
              <TextV3.Description color={COLORS_ENUMS.GRAY_100} extraStyle={styles.warning}>
                At least 8 characters, 1 lower-case, 1 upper-case, 1 numeral and 1 special character.
              </TextV3.Description>
              {(errors.password || errors.repassword) && (
                <View style={styles.errors}>
                  <TextV3.Description color={COLORS_ENUMS.RED} extraStyle={styles.errorText}>
                    {errors.password ? errors.password.message : errors.repassword.message}
                  </TextV3.Description>
                </View>
              )}
            </>
          )}
          <View>
            <TextV3.CaptionStrong margin={false} color={COLORS_ENUMS.DARK_GRAY} extraStyle={styles.comment}>
              {comment}
            </TextV3.CaptionStrong>
          </View>
          <View style={styles.buttonContainer}>
            <ButtonV3
              type={BUTTON_TYPES_ENUM.PRIMARY}
              size={BUTTON_SIZES_ENUM.LARGE}
              title="Next"
              extraStyle={styles.button}
              onPress={
                passed
                  ? nextHandler
                  : handleSubmit((data) => {
                    onSubmit(data);
                  })
              }
            />
          </View>
        </Layout>
    </KeyboardAwareScrollView>
  );
};

export default CreatePass;
