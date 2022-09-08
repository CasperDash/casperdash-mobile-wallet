import Clipboard from '@react-native-clipboard/clipboard';
import { useDispatch } from 'react-redux';
import { MessageType } from 'components/CMessge/types';
import { allActions } from 'redux_manager';

export const useCopyToClipboard = () => {
  const dispatch = useDispatch();

  const copyToClipboard = async (value: string) => {
    Clipboard.setString(value);
    const message = {
      message: 'Copied to Clipboard',
      type: MessageType.normal,
    };
    dispatch(allActions.main.showMessage(message, 500));
  };
  return copyToClipboard;
};
