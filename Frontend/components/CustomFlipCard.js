'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  View,
  TouchableOpacity,
  Animated,
  Platform,
  StyleSheet,
} from 'react-native';

import { ViewPropTypes } from 'deprecated-react-native-prop-types';

/**
 * @class FlipCard
 * @description Component that flips between a front and a back view using a perspective effect.
 * @extends React.Component
 * @example  <FlipCard> <Component1 /> <Component2 /> </FlipCard>
 * @prop {bool} flip - Set to true to flip the card and see the back view, false to see the front view.
 * @prop {number} friction - Value used to determine the speed at which the card flips. Defaults to 6.
 * @prop {number} perspective - Determines the distance of the card from the rest of the scene, in pixels. Defaults to 1000.
 * @prop {bool} flipHorizontal - Set to true to flip the card horizontally (with a default value of false to flip it vertically).
 * @prop {bool} flipVertical - Set to true to flip the card vertically (with a default value of true to flip it vertically).
 * @prop {bool} clickable - Set to false to disable the card flip on tap. Defaults to true.
 * @prop {func} doubleTap - Function to be called when the card is double tapped.
 * @prop {func} onFlipEnd - Function to be called when the card has flipped.
 * @prop {func} onFlipStart - Function to be called when the card is flipped.
 * @prop {bool} alignHeight - Set to true to adjust the card height to the biggest component height.
 * @prop {bool} alignWidth - Set to true to adjust the card width to the biggest component width.
 * @prop {bool} useNativeDriver - Set to true to use native animations. Defaults to true.
 */
export default class FlipCard extends Component {
  static propTypes = {
    style: ViewPropTypes.style,
  };

  constructor(props) {
    super(props);

    // set reversed boolean for detect other side size
    const isFlipped =
      this.props.alignHeight || this.props.alignWidth
        ? !props.flip
        : props.flip;

    this.state = {
      isFlipped: isFlipped,
      isFlipping: false,
      rotate: new Animated.Value(Number(props.flip)),
      mesured: false, // the flag to check whether it is measured or not.
      height: 0,
      width: 0,
      face: { width: 0, height: 0 },
      back: { width: 0, height: 0 },
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.isFlipped !== nextProps.flip) {
      return { flip: nextProps.flip };
    } else return null;
  }
  componentDidUpdate(prevProps) {
    if (prevProps.flip !== this.props.flip) {
      this._toggleCard();
    }
  }
  _toggleCard() {
    this.setState({ isFlipping: true });
    this.props.onFlipStart(this.state.isFlipped);
    this._animation(!this.state.isFlipped);
  }
  _animation(isFlipped) {
    if (!this.timer) {
      this.timer = setTimeout(() => {
        this.setState({ isFlipped: !this.state.isFlipped });
        this.timer = null;
      }, 120);
    }
    Animated.spring(this.state.rotate, {
      toValue: Number(isFlipped),
      friction: this.props.friction,
      useNativeDriver: this.props.useNativeDriver,
    }).start((param) => {
      this.setState({ isFlipping: false });
      this.props.onFlipEnd(this.state.isFlipped);
    });
  }

  componentDidMount() {
    if (this.props.alignHeight || this.props.alignWidth) {
      // need to check the other side width or height or both
      this.measureOtherSideTimeout = setTimeout(
        this.measureOtherSide.bind(this),
        32,
      );
    }
  }

  componentWillUnmount() {
    clearTimeout(this.measureOtherSideTimeout);
    clearTimeout(this.tapTimeout);
  }

  measureOtherSide() {
    this.setState({
      isFlipped: !this.state.isFlipped,
      mesured: true,
    });
  }

  handleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 220;

    if (this.lastTap && now - this.lastTap < DOUBLE_PRESS_DELAY) {
      // Double tap detected
      this.props.doubleTap && this.props.doubleTap();
      clearTimeout(this.tapTimeout); // Prevents the single tap action
      this.lastTap = null;
    } else {
      this.lastTap = now;
      // Set a timeout for a single tap action
      this.tapTimeout = setTimeout(() => {
        if (this.lastTap) {
          this._toggleCard();
          this.lastTap = null;
        }
      }, DOUBLE_PRESS_DELAY);
    }
  };

  render() {
    var c = this.props.children;
    var transform = this.props.perspective
      ? [{ perspective: this.props.perspective }]
      : [];
    var render_side = false;

    if (this.props.flipHorizontal) {
      transform.push({
        rotateY: this.state.rotate.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        }),
      });
    }

    if (this.props.flipVertical) {
      transform.push({
        rotateX: this.state.rotate.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        }),
      });
    }

    if (this.state.isFlipped) {
      render_side = (
        <Back
          style={[
            this.state.height > 0 && { height: this.state.height },
            this.state.width > 0 && { width: this.state.width },
          ]}
          flipHorizontal={this.props.flipHorizontal}
          flipVertical={this.props.flipVertical}
          perspective={this.props.perspective}
          onLayout={(event) => {
            var { x, y, width, height } = event.nativeEvent.layout;
            var _update = Object.assign(this.state.back, {
              width: width,
              height: height,
            });
            this.setState({ back: _update });
            if (this.state.mesured) {
              if (this.props.alignHeight) {
                this.setState({
                  height: Math.max(
                    this.state.face.height,
                    this.state.back.height,
                  ),
                });
              }
              if (this.props.alignWidth) {
                this.setState({
                  width: Math.max(this.state.face.width, this.state.back.width),
                });
              }
            }
          }}
        >
          {c[1]}
        </Back>
      );
    } else {
      render_side = (
        <Face
          style={[
            this.state.height > 0 && { height: this.state.height },
            this.state.width > 0 && { width: this.state.width },
          ]}
          onLayout={(event) => {
            var { x, y, width, height } = event.nativeEvent.layout;
            var _update = Object.assign(this.state.face, {
              width: width,
              height: height,
            });
            this.setState({ face: _update });
            if (this.state.mesured) {
              if (this.props.alignHeight) {
                this.setState({
                  height: Math.max(
                    this.state.face.height,
                    this.state.back.height,
                  ),
                });
              }
              if (this.props.alignWidth) {
                this.setState({
                  width: Math.max(this.state.face.width, this.state.back.width),
                });
              }
            }
          }}
        >
          {c[0]}
        </Face>
      );
    }

    // FIX: ScrollView inside Flip Card not scrollable
    // TODO: Replace below fix with by using "disabled" function (RN 0.21 exclusive)
    // REF: https://github.com/facebook/react-native/pull/5931
    //      https://github.com/facebook/react-native/issues/2103
    if (this.props.clickable) {
      let opacity = 0;
      if (
        ((this.props.alignHeight || this.props.alignWidth) &&
          this.state.mesured) ||
        !(this.props.alignHeight || this.props.alignWidth)
      ) {
        // if you set alignXXX property, we show this side after mesured
        // Otherwise, it's showed immediately
        opacity = 1;
      }
      return (
        <TouchableOpacity
          style={{ flex: 1 }}
          testID={this.props.testID}
          activeOpacity={1}
          onPress={this.handleTap}
        >
          <Animated.View
            {...this.props}
            style={[
              styles.flipCard,
              {
                transform,
                opacity,
              },
              this.props.style,
            ]}
          >
            {render_side}
          </Animated.View>
        </TouchableOpacity>
      );
    } else {
      return (
        <Animated.View
          {...this.props}
          style={[styles.flipCard, { transform: transform }, this.props.style]}
        >
          {render_side}
        </Animated.View>
      );
    }
  }
}
FlipCard.propTypes = {
  flip: PropTypes.bool,
  friction: PropTypes.number,
  perspective: PropTypes.number,
  flipHorizontal: PropTypes.bool,
  flipVertical: PropTypes.bool,
  clickable: PropTypes.bool,
  doubleTap: PropTypes.func,
  onFlipEnd: PropTypes.func,
  onFlipStart: PropTypes.func,
  alignHeight: PropTypes.bool,
  alignWidth: PropTypes.bool,
  useNativeDriver: PropTypes.bool,
  children(props, propName, componentName) {
    const prop = props[propName];
    if (React.Children.count(prop) !== 2) {
      return new Error(
        '`' +
          componentName +
          '` ' +
          'should contain exactly two children. ' +
          'The first child represents the front of the card. ' +
          'The second child represents the back of the card.',
      );
    }
  },
};

FlipCard.defaultProps = {
  flip: false,
  friction: 6,
  perspective: 1000,
  flipHorizontal: false,
  flipVertical: true,
  clickable: true,
  doubleTap: () => {},
  onFlipEnd: () => {},
  onFlipStart: () => {},
  alignHeight: false,
  alignWidth: false,
  useNativeDriver: true,
};

export class Face extends Component {
  render() {
    return (
      <View
        style={[styles.face, this.props.style]}
        onLayout={this.props.onLayout}
      >
        {this.props.children}
      </View>
    );
  }
}

Face.propTypes = {
  children(props, propName, componentName) {},
};

export class Back extends Component {
  render() {
    var transform = [];
    if (this.props.flipHorizontal) {
      transform.push({ scaleX: -1 });
      if (Platform.OS === 'android') {
        transform.push({ perspective: this.props.perspective });
      }
    }
    if (this.props.flipVertical) {
      transform.push({ scaleY: -1 });
      if (Platform.OS === 'android') {
        transform.push({ perspective: this.props.perspective });
      }
    }

    return (
      <View
        style={[styles.back, this.props.style, { transform: transform }]}
        onLayout={this.props.onLayout}
      >
        {this.props.children}
      </View>
    );
  }
}

Back.defaultProps = {
  flipHorizontal: false,
  flipVertical: true,
  perspective: 1000,
};

Back.propTypes = {
  flipHorizontal: PropTypes.bool,
  flipVertical: PropTypes.bool,
  perspective: PropTypes.number,
  children(props, propName, componentName) {},
};

const styles = StyleSheet.create({
  flipCard: {
    flex: 1,
  },

  face: {
    flex: 1,
  },

  back: {
    flex: 1,
  },
});
