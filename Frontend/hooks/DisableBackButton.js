import { useEffect } from 'react';
import { BackHandler } from 'react-native';

const useBackButtonHandler = (handler) => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handler
    );

    return () => backHandler.remove();
  }, [handler]);
};

export default useBackButtonHandler;
