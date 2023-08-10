import { CommonActions } from '@react-navigation/native';
import { StackName } from 'navigation/ScreenProps';
import { useCallback } from 'react';
import { useStackNavigation } from './useNavigation';

export const useRestack = () => {
  const navigation = useStackNavigation();

  const resetStack = useCallback(
    (stake: StackName, name: string) => {
      navigation.dispatch(
        CommonActions.reset({
          routes: [
            {
              name: stake,
              state: {
                routes: [
                  {
                    name: name,
                  },
                ],
              },
            },
          ],
        }),
      );
    },
    [navigation],
  );
  return resetStack;
};
