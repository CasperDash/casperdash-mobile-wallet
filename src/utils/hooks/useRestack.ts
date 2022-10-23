import { CommonActions, useNavigation } from '@react-navigation/native';
import { StackName } from 'navigation/ScreenProps';

export const useRestack = () => {
  const navigation = useNavigation();

  const resetStack = (stake: StackName, name: string) => {
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
  };
  return resetStack;
};
