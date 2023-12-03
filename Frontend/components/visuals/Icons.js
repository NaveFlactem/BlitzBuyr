

/**
 * @namespace Icons
 * @memberof Visuals
 * @description - file serves as a utility for handling various icon sets using React Native Vector Icons.  BlitzBuyr used many icons from Matierial Communitiy Icons in particular
 */


import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Foundation from 'react-native-vector-icons/Foundation';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

export const Icons = {
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
  Feather,
  FontAwesome,
  FontAwesome5,
  AntDesign,
  Entypo,
  SimpleLineIcons,
  Octicons,
  Foundation,
  EvilIcons,
};

/**
 * 
 * @function Icon 
 * @param {string} type - the icon set to use
 * @param {string} name - the name of the icon
 * @param {string} color - the color of the icon
 * @param {number} size - the size of the icon
 * @param {object} style - the style of the icon
 * @returns {JSX.Element} - Icon component
 * @example Icon({type: 'MaterialCommunityIcons', name: 'home', color: 'black', size: 24, style: {}})
 */
const Icon = ({ type, name, color, size = 24, style }) => {
  const fontSize = 24;
  const Tag = type;
  return (
    <>
      {type && name && (
        <Tag name={name} size={size || fontSize} color={color} style={style} />
      )}
    </>
  );
};

export default Icon;
