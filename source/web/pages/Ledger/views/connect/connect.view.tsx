/////////////////////////
// Module Imports
/////////////////////////

import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles'

/////////////////////////
// Components Imports
/////////////////////////

import Button from '@material-ui/core/Button';

/////////////////////////
// Image Imports
/////////////////////////

import LedgerIcon from 'assets/images/svg/ledger.svg';


/////////////////////////
// Styles Imports
/////////////////////////

import styles from './styles.module.scss';

/////////////////////////
// Constants
/////////////////////////

// Properties
const BUTTON_SIZE_PROP = 'large';
const BUTTON_VARIANT_PROP = 'contained';
const BUTTON_COLOR_PROP = 'primary';
const BUTTON_CUSTOM_COLOR_PROP = '#521e8a';
// Strings
const CONNECT_TO_LEDGER_STRING = 'Connect';

/////////////////////////
// Interface
/////////////////////////

interface IConnectProps {
  onConnectClick: (deviceId: string) => void
}

/////////////////////////
// Component
/////////////////////////

function Connect(props: IConnectProps) {

  const [deviceId, setDeviceId] = useState<string>('')
  const [error, setError] = useState<string>('')
  /////////////////////////
  // Callbacks
  /////////////////////////

  const onClick = () => {
    try {
      if (Buffer.from(deviceId, 'hex').length !== 3) {
        throw new Error('Invalid device ID')
      }
  
      if (props.onConnectClick) {
        props.onConnectClick(deviceId);
      }
  
    }
    catch (exc) {
      //@ts-ignore
      setError(JSON.stringify(exc.message ||exc))
    }
    
  };

  /////////////////////////
  // Renders
  /////////////////////////

  const BlueButton = withStyles((theme) => ({
    root: {
      color: theme.palette.getContrastText(BUTTON_CUSTOM_COLOR_PROP),
      backgroundColor: BUTTON_CUSTOM_COLOR_PROP,
      '&:hover': {
        backgroundColor: BUTTON_CUSTOM_COLOR_PROP,
      },
    },
  }))(Button);

  return (
    <div className={styles.content}>
      <div className={styles.wrapper}>
        <div className={styles.instructions}>
          <svg viewBox="0 0 64 64" width="64" height="64"  >
            <path fill="#FFCA21" d="M11 27H1l15 26h10zM26 .7H16L1 27h10z"></path><path fill="#FFCA21" d="M16 .7h20v10.2H16z"></path><path fill="#FFCA21" d="M36 1l-5.8 5.4L41 27h10z"></path><path fill="#FFCA21" d="M41.8 26.4l9.2-.3L41.8 43h-8.9z"></path><path className="o-logo__text" fill="#060055"></path><path className="o-logo__text" fill="#060055" d=""></path><path className="o-logo__text" fill="#060055" d=""></path><path className="o-logo__text" fill="#060055" d=""></path><g><path className="o-logo__text" fill="#060055" d=""></path><path className="o-logo__text" fill="#060055" d=""></path></g><g><path className="o-logo__text" fill="#060055" d=""></path><path className="o-logo__text" fill="#060055" d=""></path></g><g><path fill="#FFCA21" d="M46 54H16c-.4 0-.7-.2-.9-.5l-15-26c-.2-.3-.2-.7 0-1l15-26c.2-.3.5-.5.9-.5h30c.4 0 .7.2.9.5l15 26c.2.3.2.7 0 1l-15 26c-.2.3-.5.5-.9.5zm-29.4-2h28.8l14.4-25L45.4 2H16.6L2.2 27l14.4 25z"></path><path fill="#FFCA21" d="M26 54c-.3 0-.7-.2-.9-.5l-15-26c-.2-.3-.2-.7 0-1l9.2-16c.2-.3.5-.5.9-.5h11.5c.6 0 1 .4 1 1s-.4 1-1 1H20.8l-8.7 15 14.7 25.5c.3.5.1 1.1-.4 1.4-.1 0-.2.1-.4.1z"></path><path fill="#FFCA21" d="M30.2 44c-.3 0-.7-.2-.9-.5l-9.2-16c-.2-.3-.2-.7 0-1l9.2-16c.3-.5.9-.6 1.4-.4.5.3.6.9.4 1.4L22.2 27l8.9 15.5c.3.5.1 1.1-.4 1.4-.1 0-.3.1-.5.1z"></path><path fill="#FFCA21" d="M41.8 44H30.2c-.6 0-1-.4-1-1s.4-1 1-1h10.9l8.7-15L35.1 1.5c-.2-.5-.1-1.1.4-1.4.5-.2 1.1-.1 1.4.4l15 26c.2.3.2.7 0 1l-9.2 16c-.3.3-.6.5-.9.5z"></path><path fill="#FFCA21" d="M31.8 44c-.2 0-.3 0-.5-.1-.5-.3-.6-.9-.4-1.4 0 0 7.4-12.8 8.9-15.5l-8.9-15.5c-.3-.5-.1-1.1.4-1.4.5-.3 1.1-.1 1.4.4l9.2 16c.3.5.3.5-1.4 3.5l-7.8 13.5c-.3.3-.6.5-.9.5z"></path></g><circle fill="#FFCA21" cx="31" cy="27" r="5"></circle>
          </svg>
          <h2 style={{ marginBottom: '15px', marginTop: '5px' }}>Bitfi Connect</h2>
          
          <span style={{ marginBottom: '15px', paddingTop: '0px', fontSize: '15px' }}>
            Enter your Bitfi device ID and then click on the "Connect" button below
          </span>
          <input
            style={{ height: '30px', width: '100px', textAlign: 'center', marginTop: '10px' }}
            value={deviceId} 
            onChange={(e) => setDeviceId(e.target.value)} 
            placeholder='FFFFFF'
          />
        </div>
        
        {error}
        <div>
          <BlueButton
            style={{textTransform: 'none'}}
            onClick={onClick}
            className={styles.button}
            size={BUTTON_SIZE_PROP}
            variant={BUTTON_VARIANT_PROP}
            color={BUTTON_COLOR_PROP}>
            {CONNECT_TO_LEDGER_STRING}
          </BlueButton>
        </div>
      </div>
    </div>
  );
}

export default Connect;
