import { MessageType } from 'components/CMessge/types';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { allActions } from 'redux_manager';

export const useShowMessage = () => {
  const dispatch = useDispatch();

  const showMessage = useCallback(
    (message: string, type?: string) => {
      const messages = {
        message: message,
        type: type ?? MessageType.normal,
      };
      dispatch(allActions.main.showMessage(messages, type && type !== MessageType.normal ? 2000 : 30000));
    },
    [dispatch],
  );

  return showMessage;
};
