//////////////////////
// Modules Imports
/////////////////////

import React from 'react';
import queryString from 'query-string';
import { browser } from 'webextension-polyfill-ts';
import { useController } from 'hooks/index';
import { useSelector } from 'react-redux';
import { AssetType } from 'state/vault/types';

//////////////////////
// Common Layouts
/////////////////////

import CardLayout from 'scenes/external/Layouts/CardLayout'

///////////////////////////
// Styles
///////////////////////////

import styles from './index.module.scss';

import walletsSelectors from 'selectors/walletsSelectors'
import { StargazerSignatureRequest } from 'scripts/Provider/StargazerProvider';

//////////////////////
// Component
/////////////////////

const SignatureRequest = () => {
  //////////////////////
  // Hooks
  /////////////////////

  const controller = useController();
  const wallets = useSelector(walletsSelectors.selectAllAccounts);

  const { data: stringData } = queryString.parse(location.search);

  const { signatureRequestEncoded, asset }:
    { signatureRequestEncoded: string, asset: string } = JSON.parse(stringData as string);
  const provider = asset === 'DAG' ? controller.stargazerProvider : controller.ethereumProvider;
  const account = provider.getAssetByType(asset === 'DAG' ? AssetType.Constellation : AssetType.Ethereum);
  const signatureRequest = JSON.parse(window.atob(signatureRequestEncoded)) as StargazerSignatureRequest;


  //////////////////////
  // Callbacks
  /////////////////////

  const onNegativeButtonClick = async () => {
    const background = await browser.runtime.getBackgroundPage();
    const { windowId } = queryString.parse(window.location.search);
    const cancelEvent = new CustomEvent('messageSigned', {
      detail: { windowId, result: false }
    });

    background.dispatchEvent(cancelEvent);
    window.close();
  };

  const onPositiveButtonClick = async () => {
    const signature = provider.signMessage(asset === 'DAG' ? signatureRequestEncoded : signatureRequest.content);

    const background = await browser.runtime.getBackgroundPage();

    const { windowId } = queryString.parse(window.location.search);

    const signatureEvent = new CustomEvent('messageSigned', {
      detail: {
        windowId, result: true, signature: {
          hex: signature,
          requestEncoded: signatureRequestEncoded
        }
      }
    });

    background.dispatchEvent(signatureEvent);
    window.close();
  };

  //////////////////////
  // Renders
  /////////////////////

  return (
    <CardLayout
      stepLabel={``}
      originDescriptionLabel={'Requested by:'}
      headerLabel={'Signature Request'}
      footerLabel={'Signed messages do not incur gas fees.\nOnly sign messages on sites you trust.'}
      captionLabel={''}
      negativeButtonLabel={'Reject'}
      onNegativeButtonClick={onNegativeButtonClick}
      positiveButtonLabel={'Sign'}
      onPositiveButtonClick={onPositiveButtonClick}
    >
      <div className={styles.content}>
        <section>
          <label>
            Account
          </label>
          <div>
            {wallets.find(w => w.address === account.address)?.label ?? account.address}
          </div>
        </section>
        <section className={styles.message}>
          <label>
            Message
          </label>
          <div>
            {signatureRequest.content}
          </div>
        </section>
        {Object.keys(signatureRequest.metadata).length > 0 && <section className={styles.metadata}>
          <label>
            Metadata
          </label>
          <div>
            {Object.entries(signatureRequest.metadata).map(
              ([key, value]) => (<small>{key} = {value}</small>)
            )}
          </div>
        </section>}
      </div>
    </CardLayout>
  );
};

export default SignatureRequest;
