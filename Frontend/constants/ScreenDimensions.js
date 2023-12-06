/**
 * @namespace ScreenDimensions
 * @description - ScreenDimensions is a file that contains the screen dimensions of the device
 */

import { Dimensions } from 'react-native';

export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;
