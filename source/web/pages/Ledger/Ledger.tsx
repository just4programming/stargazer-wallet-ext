/////////////////////////
// Module Imports
/////////////////////////

import React, { FC, useState, useEffect} from 'react';
import { LedgerAccount } from '@stardust-collective/dag4-ledger';
import { makeStyles } from '@material-ui/core/styles'
//import { LedgerBridgeUtil } from '../../utils/ledgerBridge';
import queryString from 'query-string';
import _ from 'lodash';

/////////////////////////
// Component Imports
/////////////////////////

import Card from '@material-ui/core/Card';
import { Header, AlertBar } from './components';

/////////////////////////
// View Imports
/////////////////////////

import ConnectView, { ConnectBitfiView } from './views/connect';
import FetchingProgressView from './views/fetchingProgress';
import AccountsView from './views/accounts';
import SignView from './views/sign';
import ImportSuccess from './views/importSuccess';
import MessageSigning from './views/messageSigning';

/////////////////////////
// Styles
/////////////////////////

import 'assets/styles/global.scss';
import { Color } from '@material-ui/lab/Alert';
import { browser } from 'webextension-polyfill-ts';
import { dag4 } from '@stardust-collective/dag4';
import BitfiBridgeUtil from '../../utils/bitfiBridge';
import { DeviceError } from '@bitfi/bitfi.js';

const LedgerBridgeUtil = BitfiBridgeUtil
/////////////////////////
// Constants
/////////////////////////

// Strings
const ROUTES = {
  SIGN_TRANSACTION: 'signTransaction',
  SIGN_MESSAGE: 'signMessage',
}

const deviceIdparam = "d70cb2"

const LEDGER_ERROR_STRINGS = {
  CONNECTION_CANCELED: 'Cannot read property',
  APP_CLOSED: '6E01',
  PIN_OR_NOT_CONNECTED: 'No USB device found',
}
const ALERT_MESSAGES_STRINGS = {
  DEFAULT: 'Error: Please contact support',
  CONNECTION_CANCELED: 'Connection Canceled: Please connect to unlock wallet with Ledger.',
  OPEN_CONSTELLATION_APP: 'Open App: Please open the Constellation App on your Ledger',
  PIN_OR_CONNECTION: 'Connection or Pin: Ledger device USB is disconnected or is awaiting pin input',
}

// States
enum ALERT_SEVERITY_STATE {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

/////////////////////////
// ENUMS
/////////////////////////

enum WALLET_STATE_ENUM {
  LOCKED = 1,
  FETCHING,
  FETCHING_PAGE,
  VIEW_ACCOUNTS,
  SENDING,
  SUCCESS,
  SIGN,
  BITFI_SIGNIN,
  MESSAGE_SIGNING
}

enum PAGING_ACTIONS_ENUM {
  INITIAL = 0,
  NEXT,
  PREVIOUS,
}

/////////////////////////
// Style Hooks
/////////////////////////

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: 380,
    height: 570,
    backgroundColor: "#ffffff",
    borderRadius: 6,
  },
});

/////////////////////////
// Page
/////////////////////////

const LedgerPage: FC = () => {

  /////////////////////////
  // Hooks
  /////////////////////////

  const classes = useStyles();
  const [walletState, setWalletState] = useState<WALLET_STATE_ENUM>(WALLET_STATE_ENUM.LOCKED);
  const [accountData, setAccountData] = useState<LedgerAccount[]>([]);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [selectedAccounts, setSelectedAccounts] = useState<LedgerAccount[]>([]);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertSeverity, setAlertSeverity] = useState<Color>('success');
  const [accountsLoadProgress, setAccountsLoadProgress] = useState<number>(0);
  const [checkBoxesState, setCheckBoxesState] = useState<boolean[]>([]);
  const [fetchingPage, setFetchingPage] = useState<boolean>(false);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [waitingForLedger, setWaitingForLedger] = useState<boolean>(false);
  const [transactionSigned, setTransactionSigned] = useState<boolean>(false);
  

  const [statusMessage, setStatusMessage] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [code, setCode] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {}, [selectedAccounts])

  useEffect(() => {
    LedgerBridgeUtil.setOnProgressUpdate(onProgressUpdate);
  }, []);

  useEffect(() => {

    const {
      route,
    } = queryString.parse(location.search);

    if (route === ROUTES.SIGN_TRANSACTION) {
      setWalletState(WALLET_STATE_ENUM.SIGN);
    }else if (route === ROUTES.SIGN_MESSAGE){
      setWalletState(WALLET_STATE_ENUM.MESSAGE_SIGNING);
    }

  }, []);


  /////////////////////////
  // Helper
  /////////////////////////

  const getAccountData = async (pagingAction: PAGING_ACTIONS_ENUM) => {
    let accountData: LedgerAccount[];
    // Get Ledger account data

    setFetchingPage(true);

    try {
      if (pagingAction === PAGING_ACTIONS_ENUM.INITIAL) {
        accountData = await LedgerBridgeUtil.getInitialPage();
        setAccountData(accountData);
        setWalletState(WALLET_STATE_ENUM.VIEW_ACCOUNTS);
      } else if (pagingAction === PAGING_ACTIONS_ENUM.NEXT) {
        accountData = await LedgerBridgeUtil.getNextPage();
        setAccountData(accountData);
      } else if (pagingAction === PAGING_ACTIONS_ENUM.PREVIOUS) {
        accountData = await LedgerBridgeUtil.getPreviousPage();
        setAccountData(accountData);
      }
      setStartIndex(LedgerBridgeUtil.startIndex);
    } catch (error) {
      console.log('error', error);
      if (pagingAction === PAGING_ACTIONS_ENUM.INITIAL) {
        setWalletState(WALLET_STATE_ENUM.LOCKED);
      } else {
        setFetchingPage(false);
      }
      showAlert(error);
    }
    setFetchingPage(false);
    setAccountsLoadProgress(0);
  }

  const showAlert = (error: any): void => {
    let errorMessage = ALERT_MESSAGES_STRINGS.DEFAULT;
    let errorSeverity = ALERT_SEVERITY_STATE.ERROR;
    if (error.message.includes(LEDGER_ERROR_STRINGS.CONNECTION_CANCELED)) {
      errorMessage = ALERT_MESSAGES_STRINGS.CONNECTION_CANCELED
    } else if (error.message.includes(LEDGER_ERROR_STRINGS.APP_CLOSED)) {
      errorMessage = ALERT_MESSAGES_STRINGS.OPEN_CONSTELLATION_APP
    } else if (error.message.includes(LEDGER_ERROR_STRINGS.PIN_OR_NOT_CONNECTED)) {
      errorMessage = ALERT_MESSAGES_STRINGS.PIN_OR_CONNECTION
    }
    setAlertSeverity(errorSeverity);
    setAlertMessage(errorMessage);
    setOpenAlert(true);
  }

  /////////////////////////
  // Callbacks
  /////////////////////////

  // Updates the state when the progress is updated.
  const onProgressUpdate = (loadProgress: number) => {
    let progress = loadProgress * 100;
    setAccountsLoadProgress(progress);
  }

  // Handles the click to the Connect with Ledger Button
  
  const onConnectClick = async (deviceId: string) => {
    try {
      setError(null)
      // Close any open alerts
      //setOpenAlert(false);

      // Request permission to access the ledger device.
      setWalletState(WALLET_STATE_ENUM.BITFI_SIGNIN)
      await LedgerBridgeUtil.requestPermissions(deviceId, setMessage)

      // Get the initial page of the account data
      await getAccountData(PAGING_ACTIONS_ENUM.INITIAL);
    }
    catch (exc) {
      if (exc instanceof DeviceError) {
        setError(`Device error: ${exc.message}`)
      } else {
        setError(JSON.stringify(exc))
      }
      
    }
  }

  // Updates the alert bar state
  const onAlertBarClose = () => {
    setOpenAlert(false);
  }

  const onPreviousClick = async () => {
    await getAccountData(PAGING_ACTIONS_ENUM.PREVIOUS);
  }

  const onNextClick = async () => {
    await getAccountData(PAGING_ACTIONS_ENUM.NEXT);
  }

  const onCheckboxChange = (account: LedgerAccount, checked: boolean, key: number) => {
    if (checked) {
      setSelectedAccounts((state) => {
        return [...state, { publicKey: account.publicKey, address: account.address, id: key - 1, balance: '' }];
      })
    } else {
      setSelectedAccounts((state) => {
        _.remove(state, { address: account.address })
        return [...state];
      })
    }
    setCheckBoxesState((state: boolean[]) => {
      state[key] = checked;
      return [...state];
    })
  }

  const onImportClick = () => {
    setFetchingPage(true);
    let port = browser.runtime.connect(undefined, { name: 'stargazer' });
    port.postMessage({
      type: 'IMPORT_LEDGER_ACCOUNTS',
      data: {
        asset: 'DAG',
        args: [selectedAccounts],
      }
    });
    port.onMessage.addListener((res: any) => {
      if (res.data.result === 'success') {
        setWalletState(WALLET_STATE_ENUM.SUCCESS);
        setFetchingPage(false);
        LedgerBridgeUtil.closeConnection();
      };
    });
  }

  const postTransactionResult = (hash: string) => {
    let port = browser.runtime.connect(undefined, { name: 'stargazer' });
    port.postMessage({
      type: 'CAL_REQUEST',
      data: {
        method: 'wallet.postTransactionResult',
        args: [hash],
      }
    });
    port.onMessage.addListener((res: any) => {
      console.log('postTransactionResult.result', res.data.result === 'success');
    });
  }

  const onCancelClick = () => {
    // Close any existing connections
    LedgerBridgeUtil.closeConnection();
    // Reset the progress
    setAccountsLoadProgress(0);
    // Transition to the locked state
    setWalletState(WALLET_STATE_ENUM.LOCKED);
  }

  const onSignPress = async () => {
    const {
      amount,
      publicKey,
      id,
      from,
      to,
    } = queryString.parse(location.search) as any;

    try{
      setWaitingForLedger(true);
      await LedgerBridgeUtil.requestPermissions(deviceIdparam, setStatusMessage);
      const signedTX = await LedgerBridgeUtil.buildTransaction(amount, publicKey, Number(id.replace('L','')), from, to);

      const hash = await dag4.network.loadBalancerApi.postTransaction(signedTX);
      if (hash) {
        postTransactionResult(hash);
      }
      setWaitingForLedger(false);
      setTransactionSigned(true);
      LedgerBridgeUtil.closeConnection();
    } catch(e) {
      console.log('error', JSON.stringify(e,null,2));
      setWaitingForLedger(false);
      LedgerBridgeUtil.closeConnection();
    } finally {
      setStatusMessage('')
    }
  }

  const onSignMessagePress = async () => {

    const {
      data,
      windowId
    } = queryString.parse(location.search) as any;

    const jsonData  = JSON.parse(data);
    const message   = jsonData.signatureRequestEncoded;
    const walletId  = jsonData.walletId;
    const publicKey = jsonData.publicKey;
    const background = await browser.runtime.getBackgroundPage();
    
    try{
      setWaitingForLedger(true);
      
      await LedgerBridgeUtil.requestPermissions(deviceIdparam, setStatusMessage);
      const signature = await LedgerBridgeUtil.signMessage(message, Number(walletId.replace('L','')));
      LedgerBridgeUtil.closeConnection();
      const signatureEvent = new CustomEvent('messageSigned', {
        detail: {
          windowId, result: true, signature: {
            hex: {
              signature,
              publicKey,
            },
            requestEncoded: message,
          }
        }
      });
  
      background.dispatchEvent(signatureEvent);
      window.close();
    } catch(e) {
      console.log('error', JSON.stringify(e,null,2));
      setWaitingForLedger(false);
      LedgerBridgeUtil.closeConnection();
    } finally {
      setStatusMessage('')
    }
  }

  /////////////////////////
  // Renders
  /////////////////////////

  function RenderByWalletState() {

    if (walletState === WALLET_STATE_ENUM.BITFI_SIGNIN) {
      return (
        <>
          <ConnectBitfiView 
            message={message} 
            error={error} 
            //code={code} 
            onBack={() => setWalletState(WALLET_STATE_ENUM.LOCKED)}
          />
        </>
      )
    } 
    else if (walletState === WALLET_STATE_ENUM.LOCKED) {
      
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
          <AccountsView
            onCancelClick={onCancelClick}
            onImportClick={onImportClick}
            onNextClick={onNextClick}
            onPreviousClick={onPreviousClick}
            onCheckboxChange={onCheckboxChange}
            accountData={accountData}
            checkBoxesState={checkBoxesState}
            fetchingPage={fetchingPage}
            startIndex={startIndex}
          />
        </>
      );
    } else if (walletState === WALLET_STATE_ENUM.SUCCESS) {
      return (
        <>
          <ImportSuccess />
        </>
      );
    } else if (walletState === WALLET_STATE_ENUM.SIGN) {

      const {
        amount,
        fee,
        from,
        to,
      } = queryString.parse(location.search) as any;

      return (
        <>
         <SignView
         amount={amount}
         fee={fee}
         statusMessage={statusMessage}
         fromAddress={from}
         toAddress={to}
         waiting={waitingForLedger}
         onSignPress={onSignPress}
         transactionSigned={transactionSigned}
         />
        </>
      );
    }else if( walletState === WALLET_STATE_ENUM.MESSAGE_SIGNING){

      const {
        data,
      } = queryString.parse(location.search) as any;

      const parsedData = JSON.parse(data);
      const message = JSON.parse(atob(parsedData.signatureRequestEncoded));

      return (
        <>
          <MessageSigning 
            walletLabel={parsedData.walletLabel} 
            message={message}
            waiting={waitingForLedger}
            statusMessage={statusMessage}
            onSignMessagePress={onSignMessagePress} 
            messageSigned={transactionSigned}
          />
        </>
      )


    }

    return null;
  }

  return (
    <div>
      <Card className={classes.root}>
        <Header />
        <RenderByWalletState />
      </Card>
      <AlertBar
        openAlert={openAlert}
        message={alertMessage}
        severity={alertSeverity}
        onClose={onAlertBarClose}
      />
    </div>
  );
};

export default LedgerPage;