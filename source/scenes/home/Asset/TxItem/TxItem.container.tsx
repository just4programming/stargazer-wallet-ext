import React, { FC, ChangeEvent } from 'react';
import IVaultState from 'state/vault/types';
import { useSelector } from 'react-redux';
import { RootState } from 'state/store';
import IAssetListState from 'state/assets/types';
import { ITransactionInfo } from 'scripts/types';

import Container from 'components/Container';

import WalletController from 'scripts/Background/controllers/WalletController';

import useGasEstimate from 'hooks/useGasEstimate';

import TxItem from './TxItem';
import GasSettings from '../GasSettings';
import { formatDistanceDate } from '../../helpers';

import { ITxItem } from './types';

const MAX_GAS_NUMBER = 200;

const TxItemContainer: FC<ITxItem> = ({
  tx,
  isETH,
  isSelf,
  isReceived,
  isGasSettingsVisible,
  showGroupBar,
  txTypeLabel,
  currencySymbol,
  amount,
  fiatAmount,
  onItemClick,
}) => {
  const minGasPrice = tx.gasPrice ? tx.gasPrice * 1.1 : 0;

  const { activeAsset }: IVaultState = useSelector((state: RootState) => state.vault);

  const assets: IAssetListState = useSelector((state: RootState) => state.assets);

  const { estimateGasFee, gasSpeedLabel, gasFee, setGasPrice, gasLimit, gasPrices, gasPrice } = useGasEstimate({
    toAddress: tx.toAddress,
    asset: assets[activeAsset.id],
    data: tx.data,
  });

  const onGasPriceChanged = (_event: ChangeEvent<{}>, value: number | number[]) => {
    setGasPrice(value as number);
    estimateGasFee(value as number);
  };

  const onSpeedUpClick = (gas: number) => {
    const txConfig: ITransactionInfo = {
      fromAddress: tx.fromAddress,
      toAddress: tx.toAddress,
      amount: tx.amount,
      timestamp: new Date().getTime(),
      ethConfig: {
        gasPrice: gas,
        gasLimit,
        memo: tx.data,
        nonce: tx.nonce,
      },
    };

    WalletController.account.updateTempTx(txConfig);
    WalletController.account.confirmContractTempTx(activeAsset);
    WalletController.account.txController.removePendingTxHash(tx.txHash);
  };

  const receivedOrSentText = `${isSelf ? 'Self' : isReceived ? 'Received' : 'Sent'} ${currencySymbol}`;
  const formattedDistanceDate = formatDistanceDate(tx.timestamp);

  const renderGasSettings = () => {
    return (
      <GasSettings
        values={{
          min: minGasPrice,
          max: MAX_GAS_NUMBER,
          current: gasPrice,
        }}
        gasPrices={gasPrices}
        speedLabel={gasSpeedLabel}
        gasFeeLabel={gasFee}
        onSliderChange={onGasPriceChanged}
        onSpeedUpClick={onSpeedUpClick}
        gasPrice={gasPrice}
      />
    );
  };

  return (
    <TxItem
      tx={tx}
      isETH={isETH}
      isSelf={isSelf}
      isReceived={isReceived}
      isGasSettingsVisible={isGasSettingsVisible}
      showGroupBar={showGroupBar}
      txTypeLabel={txTypeLabel}
      currencySymbol={currencySymbol}
      amount={amount}
      fiatAmount={fiatAmount}
      onItemClick={onItemClick}
      receivedOrSentText={receivedOrSentText}
      formattedDistanceDate={formattedDistanceDate}
      renderGasSettings={renderGasSettings}
    />
  );
};

export default TxItemContainer;