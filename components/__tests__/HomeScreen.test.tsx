import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import HomeScreen from '@/app/(tabs)'
import '@testing-library/jest-native/extend-expect'

const mock = new MockAdapter(axios)

describe('HomeScreen', () => {
  afterEach(() => {
    mock.reset()
  })

  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(<HomeScreen />)

    expect(getByPlaceholderText('Enter username to start')).toBeTruthy()
    expect(getByText('Github search')).toBeTruthy()
    expect(getByText('search')).toBeTruthy()
  })

  it('enables the search button when userQuery is not empty', () => {
    const { getByPlaceholderText, getByRole } = render(<HomeScreen />)

    const input = getByPlaceholderText('Enter username to start')
    const button = getByRole('button')

    expect(button).toBeDisabled()

    fireEvent.changeText(input, 'testuser')
    expect(button).not.toBeDisabled()
  })

  it('shows loading state and fetches users on search', async () => {
    const users = [
      { login: 'user1', id: 1, avatar_url: 'https://example.com/avatar1.png' },
      { login: 'user2', id: 2, avatar_url: 'https://example.com/avatar2.png' },
    ]
    mock.onGet('https://api.github.com/search/users?q=testuser').reply(200, {
      items: users,
    })

    const { getByPlaceholderText, getByText, queryByText, getByTestId } =
      render(<HomeScreen />)

    const input = getByPlaceholderText('Enter username to start')
    const button = getByText('search')

    fireEvent.changeText(input, 'testuser')
    fireEvent.press(button)

    expect(getByText('Loading...')).toBeTruthy()

    await waitFor(() => expect(queryByText('Loading...')).toBeNull())

    users.forEach((user) => {
      expect(getByText(user.login)).toBeTruthy()
    })
  })

  it('shows no results message when no users are found', async () => {
    mock.onGet('https://api.github.com/search/users?q=testuser').reply(200, {
      items: [],
    })

    const { getByPlaceholderText, getByText, queryByText } = render(
      <HomeScreen />,
    )

    const input = getByPlaceholderText('Enter username to start')
    const button = getByText('search')

    fireEvent.changeText(input, 'testuser')
    fireEvent.press(button)

    expect(getByText('Loading...')).toBeTruthy()

    await waitFor(() => expect(queryByText('Loading...')).toBeNull())

    expect(getByText("no results for 'testuser'")).toBeTruthy()
  })

  it('handles API errors gracefully', async () => {
    mock.onGet('https://api.github.com/search/users?q=testuser').networkError()

    const { getByPlaceholderText, getByText, queryByText } = render(
      <HomeScreen />,
    )

    const input = getByPlaceholderText('Enter username to start')
    const button = getByText('search')

    fireEvent.changeText(input, 'testuser')
    fireEvent.press(button)

    expect(getByText('Loading...')).toBeTruthy()

    await waitFor(() => expect(queryByText('Loading...')).toBeNull())

    expect(getByText('Sorry, smething went wrong')).toBeTruthy()
  })
})
