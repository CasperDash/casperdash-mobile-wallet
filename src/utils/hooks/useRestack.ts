import { useCallback } from 'react';

import { CommonActions, useNavigation } from '@react-navigation/native';

import { StackName } from 'navigation/ScreenProps';

export const useRestack = () => {
  const navigation = useNavigation();

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
