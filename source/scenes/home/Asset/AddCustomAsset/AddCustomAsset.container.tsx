///////////////////////////
// Modules
///////////////////////////

import React, { FC, useState, useEffect } from 'react';
import { useLinkTo } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

///////////////////////////
// Components
///////////////////////////

import Container, { CONTAINER_COLOR } from 'components/Container';
import AddCustomAsset from './AddCustomAsset';

///////////////////////////
// Types 
///////////////////////////

import { RootState } from 'state/store';
import IERC20AssetsListState, { ICustomAssetForm } from 'state/erc20assets/types';

///////////////////////////
// Utils
///////////////////////////

import { validateAddress } from 'scripts/Background/controllers/EthChainController/utils';
import { getAccountController } from 'utils/controllersUtils';
import { removeEthereumPrefix } from 'utils/addressUtil';


const AddCustomAssetContainer: FC = () => {

  const { customAssetForm }: IERC20AssetsListState = useSelector((state: RootState) => state.erc20assets);
  
  const { control, handleSubmit, register, setValue, setError, triggerValidation, errors } = useForm({
    validationSchema: yup.object().shape({
      tokenAddress: yup.string().test('valid', 'Invalid token address', (val) => validateAddress(val)).required('Token address is required'),
      tokenName: yup.string().required('Token name is required'),
      tokenSymbol: yup.string().test('len', 'Symbol must be 11 characters or fewer', (val) => val.length <= 11).required('Token symbol is required'),
      tokenDecimals: yup.string()
        .test('decimals', 'Decimals must be at least 0, and not over 36', (val) => {
            const numVal = parseInt(val);
            return !isNaN(numVal) && numVal >= 0 && numVal <= 36;
        }).required('Token decimals is required'),
    }),
  });

  const [tokenAddress, setTokenAddress] = useState<string>('');
  const [tokenName, setTokenName] = useState<string>('');
  const [tokenSymbol, setTokenSymbol] = useState<string>('');
  const [tokenDecimals, setTokenDecimals] = useState<string>('');
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  const accountController = getAccountController();
  const linkTo = useLinkTo();

  useEffect(() => {
    const {
      tokenAddress: address,
      tokenName: name,
      tokenSymbol: symbol,
      tokenDecimals: decimals,
    } = customAssetForm;

    if (tokenAddress !== address) {
      setTokenAddress(address);
      setValue('tokenAddress', address);
    }
    if (tokenName !== name) {
      handleNameChange(name);
    }
    if (tokenSymbol !== symbol) {
      handleSymbolChange(symbol);
    }
    if (tokenDecimals !== decimals) {
      handleDecimalsChange(decimals);
    }

  }, [customAssetForm.tokenAddress])

  useEffect(() => {
    const hasErrors = !!Object.keys(errors)?.length;
    const disabled = hasErrors || tokenAddress === '' || tokenName === '' || tokenSymbol === '' || tokenDecimals === '';
    setButtonDisabled(disabled);
  }, [errors, tokenAddress, tokenName, tokenSymbol, tokenDecimals]);
  


  const handleAddressChange = async (value: string) => {
    setTokenAddress(value);
    setValue('tokenAddress', value);
    triggerValidation('tokenAddress');
    try {
      await accountController.assetsController.fetchCustomToken(value);
    } catch (err) {
      console.log(err);
      setError('tokenAddress', 'invalidAddress', 'Invalid token address');
    }
  }

  const handleNameChange = (value: string) => {
    setValue('tokenName', value);
    setTokenName(value);
    triggerValidation('tokenName');
  }

  const handleSymbolChange = (value: string) => {
    setValue('tokenSymbol', value);
    setTokenSymbol(value);
    triggerValidation('tokenSymbol');
  }

  const handleDecimalsChange = (value: string) => {
    setValue('tokenDecimals', value);
    setTokenDecimals(value);
    triggerValidation('tokenDecimals');
  }
  
  const handleAddressScan = async (address: string) => {
    const filteredAddress = removeEthereumPrefix(address);
    await handleAddressChange(filteredAddress);
  }

  const onSubmit = async (asset: ICustomAssetForm): Promise<void> => {
    const { tokenAddress, tokenName, tokenSymbol, tokenDecimals } = asset;
    if (!validateAddress(tokenAddress)) {
      setError('tokenAddress', 'invalidAddress', 'Invalid token address');
      return;
    }
    await accountController.assetsController.addCustomERC20Asset(tokenAddress, tokenName, tokenSymbol, tokenDecimals);
    await accountController.assetsBalanceMonitor.start();
    linkTo('/home');
    accountController.assetsController.clearCustomToken();
  }

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <Container color={CONTAINER_COLOR.LIGHT}>
      <AddCustomAsset  
        control={control}
        register={register}
        tokenAddress={tokenAddress}
        tokenName={tokenName}
        tokenSymbol={tokenSymbol}
        tokenDecimals={tokenDecimals}
        handleAddressScan={handleAddressScan}
        handleAddressChange={handleAddressChange}
        handleNameChange={handleNameChange}
        handleSymbolChange={handleSymbolChange}
        handleDecimalsChange={handleDecimalsChange} 
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        errors={errors}
        buttonDisabled={buttonDisabled}
      />
    </Container>
  );
};

export default AddCustomAssetContainer;