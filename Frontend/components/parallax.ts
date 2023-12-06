/**
 * @namespace parallax
 * @memberof Components
 */

import { Extrapolate, interpolate } from 'react-native-reanimated';
import type { IComputedDirectionTypes } from 'react-native-reanimated-carousel';

/**
 * @typedef {Object} TBaseConfig
 * @property {number} size - size of the carousel
 * @property {boolean} vertical - vertical carousel
 * @memberof Components.parallax
 */
interface TBaseConfig {
  size: number;
  vertical: boolean;
}

/**
 * @typedef {Object} ILayoutConfig
 * @property {number} [parallaxScrollingOffset=100] - control prev/next item offset.
 * @property {number} [parallaxScrollingScale=0.8] - control prev/current/next item offset.
 * @property {number} [parallaxAdjacentItemScale=Math.pow(parallaxScrollingScale, 2)] - control prev/next item offset.
 * @memberof Components.parallax
 */
export interface ILayoutConfig {
  /**
   * control prev/next item offset.
   * @default 100
   */
  parallaxScrollingOffset?: number;
  /**
   * control prev/current/next item offset.
   * @default 0.8
   */
  parallaxScrollingScale?: number;
  /**
   * control prev/next item offset.
   * @default Math.pow(parallaxScrollingScale, 2)
   */
  parallaxAdjacentItemScale?: number;
}

/**
 * @typedef {Object} TParallaxModeProps
 * @property {string} [mode='parallax'] - Carousel Animated transitions.
 * @property {ILayoutConfig} [modeConfig] - Custom Layout to help with home screen layout
 * @memberof Components.parallax
 */
export type TParallaxModeProps = IComputedDirectionTypes<{
  /**
   * Carousel Animated transitions.
   */
  mode?: 'parallax';
  modeConfig?: ILayoutConfig;
}>;

/**
 *
 * @function
 * @name parallaxLayout
 * @memberof Components.parallax
 * @description - Custom Layout to help with home screen layout
 * @returns {JSX.Element} home screen layout
 */
export function parallaxLayout(
  baseConfig: TBaseConfig,
  modeConfig: ILayoutConfig = {},
) {
  const { size, vertical } = baseConfig;
  const {
    parallaxScrollingOffset = 100,
    parallaxScrollingScale = 0.8,
    parallaxAdjacentItemScale = parallaxScrollingScale ** 2,
  } = modeConfig;

  return (value: number) => {
    'worklet';
    const translate = interpolate(
      value,
      [-1, 0, 1],
      [-size + parallaxScrollingOffset, 0, size - parallaxScrollingOffset],
    );

    const zIndex = interpolate(
      value,
      [-1, 0, 1],
      [0, size, 0],
      Extrapolate.CLAMP,
    );

    const scale = interpolate(
      value,
      [-1, 0, 1],
      [
        parallaxAdjacentItemScale,
        parallaxScrollingScale,
        parallaxAdjacentItemScale,
      ],
      Extrapolate.CLAMP,
    );

    return {
      transform: [
        vertical
          ? {
              translateY: translate,
            }
          : {
              translateX: translate,
            },
        {
          scale,
        },
      ],
      zIndex,
    };
  };
}
