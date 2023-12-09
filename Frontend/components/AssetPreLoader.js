/**
 * @namespace AssetPreLoader
 * @memberof Components
 */

import React, { memo, useEffect, useState } from 'react';
import { Asset } from 'expo-asset';

/**
 * @constant assetsToPreload
 * @type {Array}
 * @description Array of assets to be preloaded at the start of booting the app to improve performance and user experience
 * @memberof Components.AssetPreLoader
*/
import { assetsToPreload } from '../constants/AssetFileNames';

  /**
   * @function
   * @name AssetPreLoader
   * @returns {React.useEffect} - React useEffect hook which preloads assets to improve performance and user experience.
   * @memberof Components.AssetPreLoader
   * @description Preloads assets to improve performance and user experience.
   * @async
   */
export const assetPreLoader = async () => {
    useEffect(() => {
        /**
         * @function loadAssetsAsync
         * @memberof Components.AssetPreLoader
         * @returns {Promise<void>}
         * @async
         * @description Loads and caches the assets when the component mounts.
         */
        async function loadAssetsAsync() {
          const assetPromises = assetsToPreload.map((asset) =>
            Asset.fromModule(asset).downloadAsync(),
          );
          await Promise.all(assetPromises);
        }
    
        loadAssetsAsync();
      }, []);
}