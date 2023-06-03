import { useRef, useEffect, useState } from 'react';
import { AppState } from 'react-native';

export const useBackgroundCover = () => {
  const appState = useRef(AppState.currentState);
  const [isOnBackground, setIsOnBackground] = useState(false);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState.match(/inactive|background/)) {
        setIsOnBackground(true);
      }
      if (nextAppState === 'active') {
        setIsOnBackground(false);
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);
  return { isOnBackground };
};
