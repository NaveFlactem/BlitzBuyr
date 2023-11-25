import React, { memo } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import { screenHeight, screenWidth } from '../constants/ScreenDimensions.js';

const TagDrawer = memo(
  ({
    tagsData,
    conditions,
    transactions,
    setTagsData,
    setConditionsData,
    setTransactionsData,
    selectedTags,
    selectedConditions,
    selectedTransactions,
    setSelectedConditions,
    setSelectedTransactions,
    setSelectedTags,
    fetchListings,
    handleMenuPress,
    setIsDrawerOpen,
    isDrawerOpen,
    translateX,
  }) => {
    handleTagPress = (index) => {
      // Update the tagsData state
      const newTagsData = tagsData.map((tag, idx) => {
        if (idx === index) {
          return { ...tag, selected: !tag.selected };
        }
        return tag;
      });

      // Update the selectedTags state
      const pressedTagName = newTagsData[index].name;
      const isAlreadySelected = selectedTags.includes(pressedTagName);
      let newSelectedTags;
      if (isAlreadySelected) {
        newSelectedTags = selectedTags.filter(
          (tagName) => tagName !== pressedTagName,
        );
      } else {
        newSelectedTags = [...selectedTags, pressedTagName];
      }

      setTagsData(newTagsData);
      setSelectedTags(newSelectedTags);
      console.log(selectedTags);
    };

    handleConditionPress = (index) => {
      //update selectedConditions state
      const newConditionsData = conditions.map((condition, idx) => {
        if (idx === index) {
          return { ...condition, selected: !condition.selected };
        }
        return condition;
      });

      // Update the selectedConditions state
      const pressedConditionName = newConditionsData[index].name;
      const isAlreadySelected =
        selectedConditions.includes(pressedConditionName);
      let newSelectedConditions;
      if (isAlreadySelected) {
        newSelectedConditions = selectedConditions.filter(
          (conditionName) => conditionName !== pressedConditionName,
        );
      } else {
        newSelectedConditions = [...selectedConditions, pressedConditionName];
      }

      setConditionsData(newConditionsData);
      setSelectedConditions(newSelectedConditions);
      console.log(selectedConditions);
    };

    handleTransactionPress = (index) => {
      //update selectedTransactions state
      const newTransactionsData = transactions.map((transaction, idx) => {
        if (idx === index) {
          return { ...transaction, selected: !transaction.selected };
        }
        return transaction;
      });

      // Update the selectedTransactions state
      const pressedTransactionName = newTransactionsData[index].name;
      const isAlreadySelected = selectedTransactions.includes(
        pressedTransactionName,
      );
      let newSelectedTransactions;
      if (isAlreadySelected) {
        newSelectedTransactions = selectedTransactions.filter(
          (transactionName) => transactionName !== pressedTransactionName,
        );
      } else {
        newSelectedTransactions = [
          ...selectedTransactions,
          pressedTransactionName,
        ];
      }

      setTransactionsData(newTransactionsData);
      setSelectedTransactions(newSelectedTransactions);
      console.log(selectedTransactions);
    };

    const X_OFFSET_THRESHOLD = 10; // You can adjust this value as needed

    const onGestureEvent = useAnimatedGestureHandler({
      onStart: (_, context) => {
        context.startX = translateX.value;
        if (Platform.OS === 'android') {
          context.hasMovedPastThreshold = false;
        }
      },
      onActive: (event, context) => {
        if (Platform.OS === 'android' && !context.hasMovedPastThreshold) {
          if (Math.abs(event.translationX) > X_OFFSET_THRESHOLD) {
            context.hasMovedPastThreshold = true;
          }
          return; // Early return until threshold is passed
        }

        if (event.translationX < 0) {
          // Detect left swipe
          translateX.value = Math.max(
            -screenWidth,
            context.startX + event.translationX,
          );
        }
      },
      onEnd: (_, context) => {
        if (Platform.OS === 'android' && !context.hasMovedPastThreshold) {
          return; // Do nothing if the threshold was not passed
        }

        const shouldClose = translateX.value < -screenWidth * 0.65;
        translateX.value = withTiming(
          shouldClose ? -screenWidth : -screenWidth * 0.6,
          { duration: 300 },
        );
        if (shouldClose) {
          runOnJS(setIsDrawerOpen)(false);
        }
      },
    });

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: translateX.value }],
      };
    });

    return (
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 0.45 * screenWidth,
              flex: 110,
            },
            animatedStyle,
          ]}
        >
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

                {tagsData.map((tag, tagIndex) => (
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
                      style={[
                        styles.rhombus,
                        { opacity: tag.selected ? 0.15 : 0 },
                      ]}
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
        </Animated.View>
      </PanGestureHandler>
    );
  },
);

export const SwipeArea = memo(
  ({ translateX, isDrawerOpen, setIsDrawerOpen }) => {
    const onSwipeAreaGestureEvent = useAnimatedGestureHandler({
      onStart: (_, context) => {
        context.startX = translateX.value;
      },
      onActive: (event, context) => {
        if (event.translationX > 0) {
          // Detect right swipe
          let newTranslateX = context.startX + event.translationX;
          translateX.value = Math.min(newTranslateX, -screenWidth * 0.6);
        }
      },
      onEnd: (_) => {
        const shouldOpen = translateX.value > -screenWidth * 0.9;
        translateX.value = withTiming(
          shouldOpen ? -screenWidth * 0.6 : -screenWidth,
          { duration: 300 },
        );
        if (shouldOpen) {
          runOnJS(setIsDrawerOpen)(true);
        }
      },
    });

    return (
      <PanGestureHandler onGestureEvent={onSwipeAreaGestureEvent}>
        <Animated.View style={styles.swipeArea} />
      </PanGestureHandler>
    );
  },
);

export default TagDrawer;

const styles = StyleSheet.create({
  drawerContainer: {
    position: 'absolute',
    height: 0.9 * screenHeight,
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
  swipeArea: {
    position: 'absolute',
    width: 0.05 * screenWidth,
    height: screenHeight,
    left: 0,
    zIndex: 200,
  },
  spacer: {
    position: 'relative',
    height: Platform.OS == 'ios' ? 0.05 * screenHeight : 0.03 * screenHeight,
  },
});
