import { fireEvent, render, waitFor } from '@testing-library/react-native';
import * as React from 'react';
import EditContactInfo from '../../screens/ContactInfoScreen';

// Mocking the navigation prop
const navigation = { navigate: jest.fn() };
const route = {
  params: {
    prevContactInfo: {
      email: { data: 'user@example.com', icon: 'mail' },
      phone: { data: '5103263261', icon: 'phone' },
    },
  },
};

// Mocking the saveContactInfo function
jest.mock('../../network/Service', () => ({
  saveContactInfo: jest.fn(),
}));

// Mocking the useThemeContext hook
jest.mock('../../components/visuals/ThemeProvider', () => ({
  useThemeContext: () => ({ theme: 'light', toggleTheme: jest.fn() }),
}));

// Mocking the getStoredUsername function
jest.mock('../../screens/auth/Authenticate', () => ({
  getStoredUsername: jest.fn(() => 'mockedUsername'),
}));

describe('EditContactInfo', () => {
  it('renders correctly', () => {
    const { getByText, getByTestId } = render(
      <EditContactInfo navigation={navigation} route={route} />
    );

    // Ensure the header text is rendered
    expect(getByText('Contact Info')).toBeTruthy();

    // Ensure Apply Changes button is rendered
    expect(getByText('Apply Changes')).toBeTruthy();
  });

  it('updates contact info on phone input change', async () => {
    const setContactInfo = jest.fn();
    const useState = [useState, setContactInfo];
    jest.spyOn(React, 'useState').mockImplementation(useState);

    const { getByTestId } = render(
      <EditContactInfo navigation={navigation} route={route} />
    );

    // Mocked input change
    fireEvent.changeText(getByTestId('phone'), '1234567890'); // Replace with the actual testID

    // Wait for the component to re-render if there are asynchronous operations
    await waitFor(() => {});

    // Assert that the phone number has been updated
    expect(getByTestId('phone').props.value).toBe('1234567890');
  });
});
