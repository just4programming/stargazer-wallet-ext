import React, { useState } from 'react';
import webHidTransport from '@ledgerhq/hw-transport-webhid';
import { LedgerAccount, LedgerBridge } from '@stardust-collective/dag4-ledger';
import { Color } from '@material-ui/lab/Alert';

import ConnectView from 'containers/hardware/connect';
import FetchingProgressView from 'containers/hardware/fetchingProgress';
import AccountsView from 'containers/hardware/accounts';

import LogoImage from 'assets/images/logo-s.svg';
import styles from './Hardware.scss';
import AlertBar from 'containers/hardware/alertBar/alertBar.component';

// Strings
const LEDGER_ERROR_STRINGS = {
  CONNECTION_CANCELED: 'Cannot read property',
  APP_CLOSED: '6E01',
};
const ALERT_MESSAGES_STRINGS = {
  DEFAULT: 'Error: Please contact support',
  CONNECTION_CANCELED:
    'Connection Canceled: Please connect to unlock wallet with Ledger.',
  OPEN_CONSTELLATION_APP:
    'Open App: Please open the Constellation App on your Ledger',
};
// States
enum ALERT_SEVERITY_STATE {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

enum WALLET_STATE_ENUM {
  LOCKED = 1,
  FETCHING,
  VIEW_ACCOUNTS,
  VIEW_ACCOUNT_ACTIVITY,
  SENDING,
}

const HardwarePage = () => {
  const [walletState, setWalletState] = useState<WALLET_STATE_ENUM>(
    WALLET_STATE_ENUM.LOCKED
  );
  const [accountData, setAccountData] = useState<LedgerAccount[]>([]);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertSeverity, setAlertSeverity] = useState<Color>('success');
  const [accountsLoadProgress, setAccountsLoadProgress] = useState<number>(0);

  // Updates the state when the progress is updated.
  const onProgressUpdate = (loadProgress: number) => {
    let progress = loadProgress * 100;
    setAccountsLoadProgress(progress);
  };

  // Handles the click to the Connect with Ledger Button
  const onConnectClick = async () => {
    let transport;
    try {
      // Close any open alerts
      setOpenAlert(false);
      // Update the wallet state
      setWalletState(WALLET_STATE_ENUM.FETCHING);
      // Prompt for USB permissions
      transport = await webHidTransport.request();
      // Close any existing connections
      transport.close();
      // Set the transport
      const ledgerBridge = new LedgerBridge(webHidTransport);
      // Get account data for ledger
      const publicKeys = await ledgerBridge.getPublicKeys(3, onProgressUpdate);
      const accountData = await ledgerBridge.getAccountInfoForPublicKeys(
        publicKeys
      );
      setAccountData(
        accountData.map((d) => ({ ...d, balance: d.balance.toFixed(2) }))
      );
      setWalletState(WALLET_STATE_ENUM.VIEW_ACCOUNTS);
    } catch (error) {
      let errorMessage = ALERT_MESSAGES_STRINGS.DEFAULT;
      let errorSeverity = ALERT_SEVERITY_STATE.ERROR;
      if (error.message.includes(LEDGER_ERROR_STRINGS.CONNECTION_CANCELED)) {
        errorMessage = ALERT_MESSAGES_STRINGS.CONNECTION_CANCELED;
      } else if (error.message.includes(LEDGER_ERROR_STRINGS.APP_CLOSED)) {
        errorMessage = ALERT_MESSAGES_STRINGS.OPEN_CONSTELLATION_APP;
      }
      setAlertSeverity(errorSeverity);
      setAlertMessage(errorMessage);
      setOpenAlert(true);
      setWalletState(WALLET_STATE_ENUM.LOCKED);
    }
  };

  const onTxClick = (index: number = 0) => {
    console.log('clicked', index);

    // const ledgerBridge = new LedgerBridge(webHidTransport);
    // const lastAccount = accountData[accountData.length - 1];
    // const { address, publicKey } = accountData[index];

    // dag.buildTx(publicKey, address, lastAccount.address);
  };

  // Updates the alert bar state
  const onAlertBarClose = () => {
    setOpenAlert(false);
  };

  function RenderByWalletState() {
    if (walletState === WALLET_STATE_ENUM.LOCKED) {
      return (
        <>
          <ConnectView onConnectClick={onConnectClick} />
        </>
      );
    } else if (walletState === WALLET_STATE_ENUM.FETCHING) {
      return (
        <>
          <FetchingProgressView accountsLoadProgress={accountsLoadProgress} />
        </>
      );
    } else if (walletState === WALLET_STATE_ENUM.VIEW_ACCOUNTS) {
      return (
        <>
          <AccountsView onTxClick={onTxClick} accountData={accountData} />
        </>
      );
    }
    return null;
  }

  return (
    <>
      <section className={styles.heading}>
        <span className={styles.title}>Hardware wallet</span>
        <div className={styles.right}>
          <img src={`/${LogoImage}`} className={styles.logo} alt="Stargazer" />
        </div>
      </section>
      <div className={styles.wrapper}>
        <RenderByWalletState />
      </div>
      <AlertBar
        openAlert={openAlert}
        message={alertMessage}
        severity={alertSeverity}
        onClose={onAlertBarClose}
      />
    </>
  );
};

export default HardwarePage;
