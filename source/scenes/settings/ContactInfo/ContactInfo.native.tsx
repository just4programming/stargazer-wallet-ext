import React, { FC, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements';
import QRCode from 'react-native-qrcode-svg';

import Button from 'components/Button';
import Tooltip from 'components/Tooltip';
import QRCodeIcon from 'assets/images/svg/qrcode.svg';

import { ellipsis } from 'scenes/home/helpers';
import { COLORS } from 'assets/styles/_variables';

import IContactInfoSettings from './types';

import styles from './styles';

const ICON_SIZE = 18;

const ContactInfo: FC<IContactInfoSettings> = ({
  codeOpened,
  setCodeOpened,
  isCopied,
  copyText,
  contact,
  handleDelete,
  handleEdit,
}) => {
  const qrCodeStyle = codeOpened ? styles.qrCode : StyleSheet.flatten([styles.qrCode, styles.qrCodeHide]);
  const [tooltipVisible, toggleTooltipVisibility] = useState(false);

  const tooltipTitle = isCopied ? 'Copied' : 'Copy Address';

  const onClickCopyText = () => {
    copyText(contact?.address || '');
    toggleTooltipVisibility(!tooltipVisible);
  };
  const onClickOpenCode = () => setCodeOpened(!codeOpened);

  return (
    <View style={styles.wrapper}>
      {contact && (
        <View style={qrCodeStyle}>
          <QRCode value={contact.address} backgroundColor={COLORS.white} color={COLORS.black} size={180} />
          <Text style={styles.codeText}>{contact?.address}</Text>
        </View>
      )}
      <View style={styles.section}>
        <View style={styles.name}>
          <Text style={styles.label}>Contact Name</Text>
          <Text style={styles.text}>{contact?.name}</Text>
        </View>
        <Avatar
          size="medium"
          rounded
          containerStyle={{ backgroundColor: COLORS.purple }}
          icon={{ name: 'user', type: 'font-awesome' }}
        />
      </View>
      <View style={styles.item}>
        <Text style={styles.label}>Address</Text>
        <View style={styles.address}>
          <Text style={styles.text}>{ellipsis(contact?.address || '')}</Text>
          <View style={{ flexDirection: 'row' }}>
            {/* need to add copyText function to Tooltip so it also copies when user clicks in tooltip area */}
            <Tooltip body={tooltipTitle} arrow visible={tooltipVisible} onOpen={onClickCopyText}>
              <Button
                icon={{
                  name: 'copy',
                  type: 'font-awesome',
                  size: ICON_SIZE,
                  color: COLORS.purple,
                  style: 'solid',
                }}
                iconContainerStyle={{}}
                buttonStyle={styles.copyButton}
                containerStyle={{ padding: 0 }}
                onPress={onClickCopyText}
              />
            </Tooltip>
            <TouchableOpacity onPress={onClickOpenCode}>
              <View style={styles.qrIcon}>
                <QRCodeIcon height={ICON_SIZE} width={ICON_SIZE} color={COLORS.purple} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View>
        <Text style={styles.label}>Memo</Text>
        <Text style={styles.text}>{contact?.memo || ''}</Text>
      </View>
      <View style={styles.actions}>
        <Button
          type="secondary"
          variant={styles.delete}
          onClick={handleDelete}
          title="Delete"
          titleStyle={styles.deleteTitleStyle}
        />
        <Button
          type="button"
          variant={styles.edit}
          onClick={handleEdit}
          title="Edit"
          titleStyle={styles.editTitleStyle}
        />
      </View>
    </View>
  );
};

export default ContactInfo;