import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import RatingScreen from '../../screens/RatingScreen';

jest.mock('../../components/visuals/ThemeProvider', () => ({
  useThemeContext: () => ({ theme: 'light', toggleTheme: jest.fn() }),
}));

const navigation = {
  goBack: jest.fn(),
};

const route = {
  params: {
    username: 'testUser',
    profileInfo: {
      profilePicture: 'https://example.com/image.jpg',
    },
  },
};

describe('RatingScreen', () => {
  test('handleRating deducts 0.5 from selectedRating when given a value equal to selectedRating', () => {
    const { getByTestId } = render(
      <RatingScreen navigation={navigation} route={route} />
    );
    const ratingButtons = [
      getByTestId('rating-button-1'),
      getByTestId('rating-button-2'),
      getByTestId('rating-button-3'),
      getByTestId('rating-button-4'),
      getByTestId('rating-button-5'),
      
     
    ];

    fireEvent.press(ratingButtons[1]); 
    fireEvent.press(ratingButtons[1]); 

    const selectedRatingText = getByTestId('selected-rating').props.children;
    const selectedRating = parseFloat(selectedRatingText); 

    expect(selectedRating).toBe(1.5);

    
  });
  test('handleRating does not change the selectedRating if the same button is pressed thrice', () => {
    const { getByTestId } = render(
      <RatingScreen navigation={navigation} route={route} />
    );
    const ratingButton = getByTestId('rating-button-3'); 

    fireEvent.press(ratingButton);
    fireEvent.press(ratingButton);
    fireEvent.press(ratingButton);

    const selectedRatingText = getByTestId('selected-rating').props.children;
    const selectedRating = parseFloat(selectedRatingText);

    expect(selectedRating).toBe(3); 
  });

  test('handleRating does not change the selectedRating if the same button is pressed once', () => {
    const { getByTestId } = render(
      <RatingScreen navigation={navigation} route={route} />
    );
    const ratingButton = getByTestId('rating-button-3'); 

    fireEvent.press(ratingButton);

    const selectedRatingText = getByTestId('selected-rating').props.children;
    const selectedRating = parseFloat(selectedRatingText);

    expect(selectedRating).toBe(3); 
  });

  test('handleRating does not change the selectedRating if the multiple buttons are pressed', () => {
    const { getByTestId } = render(
      <RatingScreen navigation={navigation} route={route} />
    );
    const ratingButton = getByTestId('rating-button-3'); 
    const ratingButton2 = getByTestId('rating-button-2');

    fireEvent.press(ratingButton);
    fireEvent.press(ratingButton2);

    const selectedRatingText = getByTestId('selected-rating').props.children;
    const selectedRating = parseFloat(selectedRatingText);

    expect(selectedRating).toBe(2); 
  });
  test('handleRating does change the selectedRating if the multiple buttons are pressed as long as the last one was pressed twice', () => {
    const { getByTestId } = render(
      <RatingScreen navigation={navigation} route={route} />
    );
    const ratingButton = getByTestId('rating-button-3'); 
    const ratingButton2 = getByTestId('rating-button-2');

    fireEvent.press(ratingButton);
    fireEvent.press(ratingButton2);
    fireEvent.press(ratingButton2);

    const selectedRatingText = getByTestId('selected-rating').props.children;
    const selectedRating = parseFloat(selectedRatingText);

    expect(selectedRating).toBe(1.5); //2-0.5
  });

  test('handleRating works even if many different numbers are pressed.', () => {
    const { getByTestId } = render(
      <RatingScreen navigation={navigation} route={route} />
    );
    const ratingButton = getByTestId('rating-button-3'); 
    const ratingButton2 = getByTestId('rating-button-2');
    const ratingButton3 = getByTestId('rating-button-1');
    const ratingButton4 = getByTestId('rating-button-4');

    fireEvent.press(ratingButton2);
    fireEvent.press(ratingButton);
    fireEvent.press(ratingButton3);
    fireEvent.press(ratingButton4);
    fireEvent.press(ratingButton2);
    fireEvent.press(ratingButton2);

    const selectedRatingText = getByTestId('selected-rating').props.children;
    const selectedRating = parseFloat(selectedRatingText);

    expect(selectedRating).toBe(1.5); //2-0.5
  });

});
