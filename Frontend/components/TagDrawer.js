import React, { memo } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '../constants/Colors';
import { screenHeight, screenWidth } from '../constants/ScreenDimensions.js';

const TagDrawer = memo(
  ({
    tags,
    handleTagPress,
    conditions,
    handleConditionPress,
    transactions,
    handleTransactionPress,
    fetchListings,
    handleMenuPress,
    isDrawerOpen,
  }) => {
    return (
      <View style={styles.drawerContainer}>
        {isDrawerOpen && (
          <TouchableOpacity onPress={handleMenuPress}>
            <View style={styles.outsideDrawer} />
          </TouchableOpacity>
        )}
        <ScrollView style={styles.drawerScroll}>
          <View style={styles.drawer}>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => {
                fetchListings();
                handleMenuPress();
              }}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
            <View style={styles.seperationContainer}>
              <View style={styles.separatorLine} />
              <Text style={styles.seperationText}>Tags</Text>
            </View>

            {tags.map((tag, tagIndex) => (
              <TouchableOpacity
                key={tagIndex}
                style={styles.tagContainer}
                onPress={() => {
                  handleTagPress(tagIndex);
                }}
              >
                <View
                  style={[
                    styles.tagSelected,
                    { opacity: tag.selected ? 1 : 0.3 },
                  ]}
                />
                <View
                  style={[styles.rhombus, { opacity: tag.selected ? 0.15 : 0 }]}
                />
                <Text style={styles.tagText}>{tag.name}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.seperationContainer}>
              <View style={styles.separatorLine} />
              <Text style={styles.seperationText}>Condition</Text>
            </View>
            {conditions.map((condition, conditionIndex) => (
              <TouchableOpacity
                key={conditionIndex}
                style={styles.tagContainer}
                onPress={() => {
                  handleConditionPress(conditionIndex);
                }}
              >
                <View
                  style={[
                    styles.tagSelected,
                    { opacity: condition.selected ? 1 : 0.3 },
                  ]}
                />
                <View
                  style={[
                    styles.rhombus,
                    { opacity: condition.selected ? 0.15 : 0 },
                  ]}
                />
                <Text style={styles.tagText}>{condition.name}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.seperationContainer}>
              <View style={styles.separatorLine} />
              <Text style={styles.seperationText}>Transactions</Text>
            </View>
            {transactions.map((transaction, transactionIndex) => (
              <TouchableOpacity
                key={transactionIndex}
                style={styles.tagContainer}
                onPress={() => {
                  handleTransactionPress(transactionIndex);
                }}
              >
                <View
                  style={[
                    styles.tagSelected,
                    { opacity: transaction.selected ? 1 : 0.3 },
                  ]}
                />
                <View
                  style={[
                    styles.rhombus,
                    { opacity: transaction.selected ? 0.15 : 0 },
                  ]}
                />
                <Text style={styles.tagText}>{transaction.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.spacer} />
        </ScrollView>
      </View>
    );
  }
);

export default TagDrawer;

const styles = StyleSheet.create({
  drawerContainer: {
    position: 'absolute',
    height: screenHeight,
    width: 0.3 * screenWidth,
    zIndex: 110,
    left: 0.55 * screenWidth,
    backgroundColor: Colors.BB_darkRedPurple,
  },
  drawerScroll: {
    top: 0.08 * screenHeight,
    width: 0.4 * screenWidth,
    height: '100%',
    backgroundColor: Colors.BB_darkRedPurple,
    borderRightWidth: 2,
    borderRightColor: Colors.BB_orange,
  },
  drawer: {
    alignSelf: 'center',
    left: '5%',
    borderRadius: 20,
    paddingTop: 20,
    height: 'auto',
    width: 'auto',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 12,
    backgroundColor: Colors.BB_darkerRedPurple,
    ...Platform.select({
      ios: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  outsideDrawer: {
    position: 'absolute',
    height: screenHeight,
    width: screenWidth,
    zIndex: 11,
  },
  tagContainer: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 20,
    alignContent: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    height: 0.055 * screenHeight,
    width: 0.3 * screenWidth,
    zIndex: 120,
    ...Platform.select({
      ios: {
        shadowColor: 'white',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  tagText: {
    color: Colors.white,
    fontSize: 18,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  rhombus: {
    alignSelf: 'center',
    position: 'absolute',
    width: 0.035 * screenHeight,
    aspectRatio: 1,
    backgroundColor: Colors.BB_darkPink,
    opacity: 0.15,
    transform: [{ rotate: '45deg' }],
  },
  tagSelected: {
    alignSelf: 'center',
    backgroundColor: Colors.BB_darkRedPurple,
    borderRadius: 20,
    height: '100%',
    width: '100%',
    position: 'absolute',
    borderColor: Colors.BB_bone,
    borderWidth: 1,
  },
  applyButton: {
    borderRadius: 20,
    height: 0.06 * screenHeight,
    width: 0.3 * screenWidth,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.BB_pink,
    borderColor: Colors.BB_bone,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: Colors.BB_bone,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  applyButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  swipeArea: {
    position: 'absolute',
    width: 0.05 * screenWidth,
    height: screenHeight,
    left: 0,
    zIndex: 200,
  },
  seperationContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: 0.06 * screenHeight,
    width: '90%',
    marginTop: 10,
    marginBottom: 10,
  },
  seperationText: {
    color: Colors.white,
    backgroundColor: Colors.BB_darkerRedPurple,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
    width: 'auto',
    top: '9%',
    textAlign: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  separatorLine: {
    position: 'absolute',
    height: 1,
    backgroundColor: 'white',
    width: '80%',
    marginTop: 5,
  },
  spacer: {
    position: 'relative',
    height: 0.2 * screenHeight,
  },
});
