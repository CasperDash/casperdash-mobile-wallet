import { useSelector } from 'react-redux';
import { getViewType } from 'utils/selectors/nft';

export const useViewType = () => {
  const viewType = useSelector(getViewType);

  return viewType;
};
