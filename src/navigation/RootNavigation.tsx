import * as React from 'react';
import { CommonActions } from '@react-navigation/native';

export const isReadyRef = React.createRef<any>();

export const navigationRef = React.createRef<any>();

export function navigate(name: any, params: any) {
  if (isReadyRef.current && navigationRef.current) {
    // Perform navigation if the app has mounted
    navigationRef.current.navigate(name, params);
  }
}

export function dispatch(action: any) {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current.dispatch(action);
  }
}

export function reset(action: any) {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current.dispatch(CommonActions.reset(action));
  }
}
