import React from 'react';
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    height: "10%", 
    width: "100%",
    backgroundColor: '#58293F',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 4,
    borderTopColor: '#F7A859',
  },
});

const BottomBar = () => {
    return (
      <View style={styles.bottomBar}>
      </View>
    );
}

export default BottomBar;