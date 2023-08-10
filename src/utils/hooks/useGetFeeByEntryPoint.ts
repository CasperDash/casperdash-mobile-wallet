import { useConfigurations } from 'utils/hooks/useConfigurations';
import { ENTRY_POINT_DELEGATE, ENTRY_POINT_REDELEGATE, ENTRY_POINT_UNDELEGATE } from 'utils/constants/key';

export const useGetFeeByEntryPoint = (defaultEntryPoint?: string) => {
  const { data: configurations, isLoading } = useConfigurations();

  const getFeeByEntryPoint = (entryPoint?: string) => {
    if (!configurations) {
      return 0;
    }

    switch (entryPoint) {
      case ENTRY_POINT_REDELEGATE:
        return configurations.CSPR_AUCTION_REDELEGATE_FEE || 2.5;
      case ENTRY_POINT_UNDELEGATE:
        return configurations.CSPR_AUCTION_UNDELEGATE_FEE;
      case ENTRY_POINT_DELEGATE:
        return configurations.CSPR_AUCTION_DELEGATE_FEE;
      default:
        return 2.5;
    }
  };

  return {
    fee: getFeeByEntryPoint(defaultEntryPoint),
    isLoading,
    getFeeByEntryPoint,
  };
};
