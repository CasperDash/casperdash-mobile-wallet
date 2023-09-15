import { request } from 'services/request';

export interface IContractPackage {
  contract_package_hash: string;
  owner_public_key: string;
  contract_type_id: number;
  contract_name: string;
  contract_description: any;
  icon_url: any;
  metadata: IContractPackageMetadata;
  timestamp: string;
  contract_hash: string;
  deploy_hash: string;
  contract_version: number;
  is_disabled: boolean;
  protocol_version: string;
}

export interface IContractPackageMetadata {
  symbol: string;
  nft_kind: number;
  burn_mode: number;
  events_mode: number;
  holder_mode: number;
  minting_mode: number;
  ownership_mode: number;
  whitelist_mode: number;
  identifier_mode: number;
  nft_metadata_kind: number;
  total_supply_uref: string;
  metadata_mutability: number;
}

export const getContractPackageInfo = async (contractPackageHash: string): Promise<IContractPackage> => {
  const response = await request.get<IContractPackage>(`/contractPackages/${contractPackageHash}`);

  return response.data;
};
