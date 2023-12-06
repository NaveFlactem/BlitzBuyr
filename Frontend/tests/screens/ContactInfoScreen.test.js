import { fireEvent, render, waitFor } from '@testing-library/react-native';
import * as React from 'react';
import * as ServiceModule from '../../network/Service';
import * as AuthenticateModule from '../../screens/auth/Authenticate';
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
const saveContactInfoMock = jest.fn();
jest
  .spyOn(ServiceModule, 'saveContactInfo')
  .mockImplementation(saveContactInfoMock);

// Mocking the getStoredUsername function
const getStoredUsernameMock = jest.fn(() => 'mockedUsername');
jest
  .spyOn(AuthenticateModule, 'getStoredUsername')
  .mockImplementation(getStoredUsernameMock);

// Mocking the useThemeContext hook
jest.mock('../../components/visuals/ThemeProvider', () => ({
  useThemeContext: () => ({ theme: 'light', toggleTheme: jest.fn() }),
}));

describe('EditContactInfo', () => {
  it('renders correctly', () => {
    const { getByText, getByTestId } = render(
      <EditContactInfo navigation={navigation} route={route} />,
    );

    // Ensure the header text is rendered
    expect(getByText('Contact Info')).toBeTruthy();

    // Ensure Apply Changes button is rendered
    expect(getByText('Apply Changes')).toBeTruthy();
  });

  it('updates contact info on phone input change', async () => {
    const { getByTestId } = render(
      <EditContactInfo navigation={navigation} route={route} />,
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
      <EditContactInfo navigation={navigation} route={route} />,
    );

    fireEvent.changeText(getByTestId('email'), 'newemail@example.com');

    await waitFor(() => {});

    expect(getByTestId('email').props.value).toBe('newemail@example.com');
  });

  it('applies changes when the Apply Changes button is clicked', async () => {
    const { getByText, getByTestId } = render(
      <EditContactInfo navigation={navigation} route={route} />,
    );

    fireEvent.changeText(getByTestId('phone'), '1234567890');
    fireEvent.press(getByText('Apply Changes'));

    // Wait for the component to re-render if there are asynchronous operations
    await waitFor(() => {});

    // Expect that the saveContactInfo function has been called
    expect(saveContactInfoMock).toHaveBeenCalledWith({
      email: { data: 'user@example.com', icon: 'mail' },
      phone: { data: '1234567890', icon: 'phone' },
    });

    // Expect that getStoredUsername function has been called
    expect(getStoredUsernameMock).toHaveBeenCalled();

    // Expect that navigation.navigate has been called with 'SettingsScreen'
    expect(navigation.navigate).toHaveBeenCalledWith('BottomNavOverlay');
  });

  it('navigates to BottomNavOverlay when back/cancel button is clicked', () => {
    const { getByTestId } = render(
      <EditContactInfo navigation={navigation} route={route} />,
    );

    fireEvent.press(getByTestId('back-button'));

    expect(navigation.navigate).toHaveBeenCalledWith('BottomNavOverlay');
  });
});
