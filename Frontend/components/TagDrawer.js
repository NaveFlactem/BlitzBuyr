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
import { useThemeContext } from './visuals/ThemeProvider';
import { getThemedStyles } from '../constants/Styles';
import { calculateTagTextFontSize } from './CalculateFontSize';

/**
 * @component
 * @namespace TagDrawer
 * @memberof Components
 */
/**
 * @function TagDrawer
 * @memberof Components.TagDrawer
 * @param {Array} tagsData - Array of objects representing the tags
 * @param {Array} conditions - Array of objects representing the conditions
 * @param {Array} transactions - Array of objects representing the transactions
 * @param {Array} currencyData - Array of objects representing the currencies
 * @param {Function} setTagsData - Function to set the tagsData state
 * @param {Function} setConditionsData - Function to set the conditionsData state
 * @param {Function} setTransactionsData - Function to set the transactionsData state
 * @param {Function} setCurrencyData - Function to set the currencyData state
 * @param {Array} selectedTags - Array of strings representing the selected tags
 * @param {Array} selectedConditions - Array of strings representing the selected conditions
 * @param {Array} selectedTransactions - Array of strings representing the selected transactions
 * @param {String} selectedCurrency - String representing the selected currency
 * @param {Function} setSelectedConditions - Function to set the selectedConditions state
 * @param {Function} setSelectedTransactions - Function to set the selectedTransactions state
 * @param {Function} setSelectedTags - Function to set the selectedTags state
 * @param {Function} setSelectedCurrency - Function to set the selectedCurrency state
 * @param {Function} fetchListings - Function to fetch the listings
 * @param {Function} handleMenuPress - Function to handle the press event for the menu button
 * @param {Function} setIsDrawerOpen - Function to set the isDrawerOpen state
 * @param {Boolean} isDrawerOpen - Boolean representing whether the drawer is open
 * @param {Animated.SharedValue} translateX - Animated shared value representing the x translation
 * @returns {React.Component} <TagDrawer />
 * @description This component renders the tag drawer that appears when the user presses the menu button on the home screen or drags the screen to the right.
 */
const TagDrawer = memo(
  ({
    tagsData,
    conditions,
    transactions,
    currencyData,
    setTagsData,
    setConditionsData,
    setTransactionsData,
    setCurrencyData,
    selectedTags,
    selectedConditions,
    selectedTransactions,
    selectedCurrency,
    setSelectedConditions,
    setSelectedTransactions,
    setSelectedTags,
    setSelectedCurrency,
    fetchListings,
    handleMenuPress,
    setIsDrawerOpen,
    isDrawerOpen,
    translateX,
  }) => {
    const theme = useThemeContext().theme;
    const styles = getThemedStyles(theme).TagDrawer;

    /**
     * Handles the press event for a tag.
     *
     * @function
     * @name handleTagPress
     * @memberof Components.TagDrawer
     * @param {number} index - The index of the tag being pressed.
     * @description Toggles the selection state of a tag and manages selected tags for home screen layout.
     * @returns {void}
     */

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

    /**
     * Handles the press event for a condition.
     *
     * @function
     * @name handleConditionPress
     * @memberof Components.TagDrawer
     * @param {number} index - The index of the condition being pressed.
     * @description Toggles the selection state of a condition and manages selected conditions.
     * @returns {void}
     */
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

    /**
     * Handles the press event for a transaction.
     *
     * @function
     * @name handleTransactionPress
     * @memberof Components.TagDrawer
     * @param {number} index - The index of the transaction being pressed.
     * @description Toggles the selection state of a transaction and manages selected transactions.
     * @returns {void}
     */
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

    /**
     * Handles the press event for a currency selection.
     *
     * @function
     * @name handleCurrencyPress
     * @memberof Components.TagDrawer
     * @param {number} index - The index of the currency being pressed.
     * @description Toggles the selection state of a currency and updates the selected currency.
     * @returns {void}
     */
    handleCurrencyPress = (index) => {
      // Update the selection status of each currency in currencyData
      const newCurrencyData = currencyData.map((currency, idx) => ({
        ...currency,
        selected: idx === index ? !currency.selected : false,
      }));

      // Determine the new selected currency
      const newSelectedCurrency = newCurrencyData[index].selected
        ? newCurrencyData[index].name
        : null;

      // Update state
      setCurrencyData(newCurrencyData);
      setSelectedCurrency(newSelectedCurrency);
    };

    clearSelections = () => {
      setTagsData(tagsData.map((tag) => ({ ...tag, selected: false })));
      setConditionsData(
        conditions.map((condition) => ({ ...condition, selected: false })),
      );
      setTransactionsData(
        transactions.map((transaction) => ({
          ...transaction,
          selected: false,
        })),
      );
      setCurrencyData(
        currencyData.map((currency) => ({ ...currency, selected: false })),
      );
    };

    const X_OFFSET_THRESHOLD = 10; // You can adjust this value as needed

    /**
     * Configuration object for handling animated gesture events.
     *
     * @constant {Object}
     * @memberof Components.TagDrawer
     * @name onGestureEvent
     * @description Manages gesture events such as start, active, and end for animations. This object is passed to the PanGestureHandler component. This object is used to animate the drawer when the user swipes left.
     */
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
                        theme === 'dark'
                          ? { backgroundColor: Colors.BB_violet }
                          : null,
                        { opacity: tag.selected ? 1 : 0.3 },
                      ]}
                    />
                    <View
                      style={[
                        styles.rhombus,
                        theme === 'dark'
                          ? { backgroundColor: Colors.white }
                          : null,
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
                        theme === 'dark'
                          ? { backgroundColor: Colors.BB_violet }
                          : null,
                        { opacity: condition.selected ? 1 : 0.3 },
                      ]}
                    />
                    <View
                      style={[
                        styles.rhombus,
                        theme === 'dark'
                          ? { backgroundColor: Colors.white }
                          : null,
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
                        theme === 'dark'
                          ? { backgroundColor: Colors.BB_violet }
                          : null,
                        { opacity: transaction.selected ? 1 : 0.3 },
                      ]}
                    />
                    <View
                      style={[
                        styles.rhombus,
                        theme === 'dark'
                          ? { backgroundColor: Colors.white }
                          : null,
                        { opacity: transaction.selected ? 0.15 : 0 },
                      ]}
                    />
                    <Text
                      style={[
                        styles.tagText,
                        {
                          fontSize: calculateTagTextFontSize(
                            transaction.name,
                            16,
                          ),
                        },
                      ]}
                    >
                      {transaction.name}
                    </Text>
                  </TouchableOpacity>
                ))}
                <View style={styles.seperationContainer}>
                  <View style={styles.separatorLine} />
                  <Text style={styles.seperationText}>Currency</Text>
                </View>
                {currencyData.map((currency, currencyIndex) => (
                  <TouchableOpacity
                    key={currencyIndex}
                    style={styles.tagContainer}
                    onPress={() => {
                      handleCurrencyPress(currencyIndex);
                    }}
                  >
                    <View
                      style={[
                        styles.tagSelected,
                        theme === 'dark'
                          ? { backgroundColor: Colors.BB_violet }
                          : null,

                        { opacity: currency.selected ? 1 : 0.3 },
                      ]}
                    />
                    <View
                      style={[
                        styles.rhombus,
                        theme === 'dark'
                          ? { backgroundColor: Colors.white }
                          : null,

                        { opacity: currency.selected ? 0.15 : 0 },
                      ]}
                    />
                    <Text style={styles.tagText}>
                      {currency.name} {currency.symbol}
                    </Text>
                  </TouchableOpacity>
                ))}
                <View style={styles.seperationContainer}>
                  <View style={styles.separatorLine} />
                </View>
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={() => {
                    setSelectedTags([]);
                    setSelectedConditions([]);
                    setSelectedTransactions([]);
                    setSelectedCurrency('');
                    clearSelections();
                    fetchListings();
                    handleMenuPress();
                  }}
                >
                  <Text style={styles.applyButtonText}>Clear</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.spacer} />
            </ScrollView>
          </View>
        </Animated.View>
      </PanGestureHandler>
    );
  },
);

/**
 * @function SwipeArea
 * @memberof Components.TagDrawer
 * @param {Animated.SharedValue} translateX - Animated shared value representing the x translation
 * @param {Boolean} isDrawerOpen - Boolean representing whether the drawer is open
 * @param {Function} setIsDrawerOpen - Function to set the isDrawerOpen state
 * @returns {React.Component} <SwipeArea />
 * @description This component renders the swipe area that the user interacts with to open the drawer.
 */
export const SwipeArea = memo(
  ({ translateX, isDrawerOpen, setIsDrawerOpen }) => {
    const styles = getThemedStyles(useThemeContext().theme).TagDrawer;
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
