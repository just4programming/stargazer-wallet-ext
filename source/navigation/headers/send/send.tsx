///////////////////////////
// Modules
///////////////////////////

import React from 'react';
import defaultHeader from '../default';
import { IAssetInfoState } from 'state/assets/types';
import CircleIcon from 'components/CircleIcon';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles.scss';

///////////////////////////
// Interface
///////////////////////////

interface ISendHeader {
  navigation: any,
  asset: IAssetInfoState,
}

///////////////////////////
// Header
///////////////////////////

const sendHeader = ({
  navigation,
  asset
}: ISendHeader) => {

  return {
    ...defaultHeader({ navigation }),
    headerTitle: () => (
      <div className={styles.headerTitle}>
        <span>Send {asset.symbol}</span>
        <CircleIcon logo={asset.logo} label={asset.label} />
      </div>
    )
  }
};

export default sendHeader;