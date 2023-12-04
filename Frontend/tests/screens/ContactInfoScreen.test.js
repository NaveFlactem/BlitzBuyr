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

  it('updates contact info on email input change', async () => {
    const { getByTestId } = render(
      <EditContactInfo navigation={navigation} route={route} />
    );

    fireEvent.changeText(getByTestId('email'), 'newemail@example.com');

    await waitFor(() => {});

    expect(getByTestId('email').props.value).toBe('newemail@example.com');
  });

  it('applies changes when the Apply Changes button is clicked', async () => {
    const { getByText, getByTestId } = render(
      <EditContactInfo navigation={navigation} route={route} />
    );

    fireEvent.changeText(getByTestId('phone'), '1234567890');

    fireEvent.press(getByText('Apply Changes'));

    await waitFor(() => {});

    expect(saveContactInfo).toHaveBeenCalledWith({
      phone: { data: '1234567890', icon: 'phone' },
    });
    expect(getStoredUsername).toHaveBeenCalled();
    expect(navigation.navigate).toHaveBeenCalledWith('SettingsScreen');
  });

  it('navigates to BottomNavOverlay when back/cancel button is clicked', () => {
    const { getByTestId } = render(
      <EditContactInfo navigation={navigation} route={route} />
    );

    fireEvent.press(getByTestId('back-button'));

    expect(navigation.navigate).toHaveBeenCalledWith('BottomNavOverlay');
  });
});
