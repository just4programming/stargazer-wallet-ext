import { Control, FieldError, FieldValues, NestDataObject, OnSubmit } from "react-hook-form";
import { ICustomAssetForm } from "state/erc20assets/types";

export default interface IAddCustomAsset {
  control?: Control<FieldValues>;
  register: any;
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimals: string;
  handleAddressScan?: (value: string) => Promise<void>;
  handleAddressChange: (value: string) => Promise<void>;
  handleNameChange: (value: string) => void;
  handleSymbolChange: (value: string) => void;
  handleDecimalsChange: (value: string) => void;
  handleSubmit: (callback: OnSubmit<FieldValues>) => (e?: React.BaseSyntheticEvent<object, any, any>) => Promise<void>;
  onSubmit: (asset: ICustomAssetForm) => Promise<void>;
  errors: NestDataObject<FieldValues, FieldError>;
  buttonDisabled: boolean;
}