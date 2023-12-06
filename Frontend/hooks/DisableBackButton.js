import { useEffect } from 'react';
import { BackHandler } from 'react-native';

/**
 * Custom hook for handling the hardware back button press.
 *
 * @function
 * @name useBackButtonHandler
 * @memberof Hooks
 * @param {Function} handler - Function to be executed when the hardware back button is pressed
 * @returns {void}
 * @description Listens for hardware back button press events and invokes the provided handler function.
 */
const useBackButtonHandler = (handler) => {
  /**
   * makes the back gesture not work on the app to prevent undesired user experience
   */
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handler,
    );

    return () => backHandler.remove();
  }, [handler]);
};

export default useBackButtonHandler;
