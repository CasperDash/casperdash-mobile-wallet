import { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase, useNavigation } from '@react-navigation/native';

export const useStackNavigation = <T extends ParamListBase = any>() => {
  return useNavigation<StackNavigationProp<T>>();
};
