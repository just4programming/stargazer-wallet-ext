import React, { FC } from 'react';
import clsx from 'clsx';
import CachedIcon from '@material-ui/icons/Cached';
import CallMadeIcon from '@material-ui/icons/CallMade';
import { Checkbox } from '@material-ui/core';
import { dag4 } from '@stardust-collective/dag4';
// import { KeyboardReturnOutlined } from '@material-ui/icons';

import Button from 'components/Button';
import Select from 'components/Select';
import TextInput from 'components/TextInput';
import FileSelect from 'components/FileSelect';

import LedgerIcon from 'assets/images/svg/ledger.svg';
import styles from './ImportAccount.scss';

import IImportAccountSettings, { HardwareWallet } from './types';

const ImportAccount: FC<IImportAccountSettings> = ({
  accountName,
  hardwareStep,
  loadingWalletList,
  handleSubmit,
  showErrorAlert,
  register,
  handleImportPrivKey,
  onFinishButtonPressed,
  hardwareWalletList,
  importType,
  setImportType,
  loading,
  setLoading,
  jsonFile,
  setJsonFile,
}) => {
  const onSubmit = async (data: any): Promise<any> => {
    // setAccountName(undefined);
    if (importType === 'priv') {
      setLoading(true);
      handleImportPrivKey(data.privKey, data.label);
    } else if (importType === 'json' && jsonFile) {
      const fileReader = new FileReader();
      fileReader.readAsText(jsonFile, 'UTF-8');
      fileReader.onload = (ev: ProgressEvent<FileReader>) => {
        if (ev.target) {
          try {
            const json = JSON.parse(ev.target.result as string);
            if (!dag4.keyStore.isValidJsonPrivateKey(json)) {
              showErrorAlert('Error: Invalid private key json file');
              return;
            }

            setLoading(true);
            dag4.keyStore
              .decryptPrivateKey(json, data.password)
              .then((privKey: string) => {
                handleImportPrivKey(privKey, data.label);
              })
              .catch(() => {
                showErrorAlert('Error: Invalid password to decrypt private key json file');
                setLoading(false);
              });
          } catch (error) {
            showErrorAlert('Error: Invalid private key json file');
            setLoading(false);
          }
        }
      };
    } else if (importType === 'hardware') {
      return window.open('/ledger.html', '_newtab');
    } else {
      return showErrorAlert('Error: A private key json file is not chosen');
    }
  };

  const renderWallet = (hwItem: HardwareWallet, index: number) => {
    return (
      <tr key={`wallet-${index}`}>
        <td>
          <Checkbox color="primary" />
        </td>
        <td>{index + 1}</td>
        <td>{hwItem.address}</td>
        <td>{hwItem.balance.toFixed(5)} ETH</td>
        <td className={styles.expand}>
          <CallMadeIcon />
        </td>
      </tr>
    );
  };

  return (
    <form className={styles.import} onSubmit={handleSubmit(onSubmit)}>
      {accountName ? (
        <div className={styles.generated}>
          <span>Your new private key account has been imported.</span>
          <span>You can view the public address in the asset view.</span>

          <div className={clsx(styles.actions, styles.centered)}>
            <Button
              id="importAccount-finishButton"
              type="button"
              variant={styles.button}
              onClick={onFinishButtonPressed}
            >
              Finish
            </Button>
          </div>
        </div>
      ) : (
        <>
          <section className={styles.content}>
            <div className={styles.select}>
              Select Type:
              <div className={styles.inner}>
                <Select
                  id="importAccount-importTypeSelect"
                  value={importType}
                  options={[
                    { priv: 'Private key' },
                    { json: 'JSON file' },
                     { hardware: 'Hardware wallet' },
                  ]}
                  onChange={(ev) => setImportType(ev.target.value as string)}
                  fullWidth
                  disabled={loading}
                />
              </div>
            </div>
            {importType === 'priv' ? (
              <>
                <span>Paste your private key string here:</span>
                <TextInput
                  id="importAccount-privateKeyInput"
                  multiline
                  fullWidth
                  variant={styles.textarea}
                  inputRef={register}
                  name="privKey"
                  disabled={loading}
                />
              </>
            ) : importType === 'json' ? (
              <>
                <FileSelect id="importAccount-fileInput" onChange={(val) => setJsonFile(val)} disabled={loading} />
                <span>Please enter your JSON file password:</span>
                <TextInput
                  id="importAccount-jsonPasswordInput"
                  fullWidth
                  inputRef={register}
                  name="password"
                  type="password"
                  visiblePassword
                  disabled={loading}
                />
              </>
            ) : (
              <>
                {hardwareStep === 1 && (
                  <>
                    <div className={styles.hardwareList}>
                      <div className={styles.walletModel} style={{ textAlign: 'center' }}>
                        <svg viewBox="0 0 64 64" width="32" height="32"  >
                          <path fill="#FFCA21" d="M11 27H1l15 26h10zM26 .7H16L1 27h10z"></path><path fill="#FFCA21" d="M16 .7h20v10.2H16z"></path><path fill="#FFCA21" d="M36 1l-5.8 5.4L41 27h10z"></path><path fill="#FFCA21" d="M41.8 26.4l9.2-.3L41.8 43h-8.9z"></path><path className="o-logo__text" fill="#060055"></path><path className="o-logo__text" fill="#060055" d=""></path><path className="o-logo__text" fill="#060055" d=""></path><path className="o-logo__text" fill="#060055" d=""></path><g><path className="o-logo__text" fill="#060055" d=""></path><path className="o-logo__text" fill="#060055" d=""></path></g><g><path className="o-logo__text" fill="#060055" d=""></path><path className="o-logo__text" fill="#060055" d=""></path></g><g><path fill="#FFCA21" d="M46 54H16c-.4 0-.7-.2-.9-.5l-15-26c-.2-.3-.2-.7 0-1l15-26c.2-.3.5-.5.9-.5h30c.4 0 .7.2.9.5l15 26c.2.3.2.7 0 1l-15 26c-.2.3-.5.5-.9.5zm-29.4-2h28.8l14.4-25L45.4 2H16.6L2.2 27l14.4 25z"></path><path fill="#FFCA21" d="M26 54c-.3 0-.7-.2-.9-.5l-15-26c-.2-.3-.2-.7 0-1l9.2-16c.2-.3.5-.5.9-.5h11.5c.6 0 1 .4 1 1s-.4 1-1 1H20.8l-8.7 15 14.7 25.5c.3.5.1 1.1-.4 1.4-.1 0-.2.1-.4.1z"></path><path fill="#FFCA21" d="M30.2 44c-.3 0-.7-.2-.9-.5l-9.2-16c-.2-.3-.2-.7 0-1l9.2-16c.3-.5.9-.6 1.4-.4.5.3.6.9.4 1.4L22.2 27l8.9 15.5c.3.5.1 1.1-.4 1.4-.1 0-.3.1-.5.1z"></path><path fill="#FFCA21" d="M41.8 44H30.2c-.6 0-1-.4-1-1s.4-1 1-1h10.9l8.7-15L35.1 1.5c-.2-.5-.1-1.1.4-1.4.5-.2 1.1-.1 1.4.4l15 26c.2.3.2.7 0 1l-9.2 16c-.3.3-.6.5-.9.5z"></path><path fill="#FFCA21" d="M31.8 44c-.2 0-.3 0-.5-.1-.5-.3-.6-.9-.4-1.4 0 0 7.4-12.8 8.9-15.5l-8.9-15.5c-.3-.5-.1-1.1.4-1.4.5-.3 1.1-.1 1.4.4l9.2 16c.3.5.3.5-1.4 3.5l-7.8 13.5c-.3.3-.6.5-.9.5z"></path></g><circle fill="#FFCA21" cx="31" cy="27" r="5"></circle>
                        </svg>
                        <br/>
                        <span>Bitfi</span>
                      </div>
                    </div>
                  </>
                )}
                {hardwareStep === 2 && (
                  <>
                    <span>Please select an account:</span>
                    <div
                      className={clsx(styles.walletList, {
                        [styles.loading]: loadingWalletList,
                      })}
                    >
                      {loadingWalletList ? (
                        <>
                          <CachedIcon />
                          <span>Loading your Hardware Wallet</span>
                        </>
                      ) : (
                        <>
                          <div className={styles.wallet}>
                            <table>
                              <tbody>
                                {hardwareWalletList.map((hwItem: HardwareWallet, index: number) =>
                                  renderWallet(hwItem, index)
                                )}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}
                    </div>
                    {!loadingWalletList && (
                      <div className={styles.pagination}>
                        <span className={styles.previous}>Previous</span>
                        <span>Next</span>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
            {hardwareStep === 1 && (
              <>
                <span>
                  {importType === 'hardware'
                    ? 'Connect to your ledger hardware wallet to import accounts'
                    : 'Please name your new account:'}
                </span>
                {importType !== 'hardware' && (
                  <TextInput
                    id="importAccount-accountNameInput"
                    fullWidth
                    inputRef={register}
                    name="label"
                    disabled={loading}
                  />
                )}
              </>
            )}
          </section>
          <section className={styles.actions}>
            <Button
              type="button"
              theme="secondary"
              variant={clsx(styles.button, styles.cancel)}
              onClick={onFinishButtonPressed}
            >
              Cancel
            </Button>
            <Button id="importAccount-confirmNextButton" type="submit" variant={styles.button} loading={loading}>
              {importType === 'hardware' ? 'Next' : 'Import'}
            </Button>
          </section>
        </>
      )}
    </form>
  );
};

export default ImportAccount;
