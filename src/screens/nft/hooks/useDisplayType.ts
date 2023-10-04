import { useSelector } from 'react-redux';
import { getDisplayType } from 'utils/selectors/nft';

export const useDisplayType = () => {
  const displayType = useSelector(getDisplayType);

  return displayType;
};
