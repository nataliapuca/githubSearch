import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { UserBar } from '../UserBar'

const mock = new MockAdapter(axios)

const user = {
  login: 'testuser',
  id: 1,
  avatar_url: 'https://example.com/avatar.png',
}

const repos = [
  { name: 'repo1', stargazers_count: 10, description: 'Test repo 1', id: 1 },
  { name: 'repo2', stargazers_count: 20, description: 'Test repo 2', id: 2 },
]

describe('UserBar', () => {
  afterEach(() => {
    mock.reset()
  })

  it('renders correctly', () => {
    const { getByText, getByRole } = render(<UserBar user={user} />)

    expect(getByText(user.login)).toBeTruthy()
    expect(getByRole('button')).toBeTruthy()
  })

  it('toggles repo list on button press', async () => {
    mock
      .onGet(`https://api.github.com/users/${user.login}/repos`)
      .reply(200, repos)

    const { getByText, getByRole, queryByText } = render(
      <UserBar user={user} />,
    )

    const button = getByRole('button')

    expect(queryByText(repos[0].name)).toBeNull()
    fireEvent.press(button)
    expect(getByText('Loading repos...')).toBeTruthy()

    await waitFor(() => expect(queryByText('Loading repos...')).toBeNull())

    repos.forEach((repo) => {
      expect(getByText(repo.name)).toBeTruthy()
      expect(getByText(repo.description)).toBeTruthy()
    })

    fireEvent.press(button)
    repos.forEach((repo) => {
      expect(queryByText(repo.name)).toBeNull()
    })
  })

  it('shows no repos message when there are no repos', async () => {
    mock
      .onGet(`https://api.github.com/users/${user.login}/repos`)
      .reply(200, [])

    const { getByText, getByRole, queryByText } = render(
      <UserBar user={user} />,
    )

    const button = getByRole('button')

    // Press button to load repos
    fireEvent.press(button)
    expect(getByText('Loading repos...')).toBeTruthy()

    await waitFor(() => expect(queryByText('Loading repos...')).toBeNull())

    expect(getByText('No repos to display')).toBeTruthy()
  })

  it('handles API errors', async () => {
    mock
      .onGet(`https://api.github.com/users/${user.login}/repos`)
      .networkError()

    const { getByText, getByRole, queryByText } = render(
      <UserBar user={user} />,
    )

    const button = getByRole('button')

    // Press button to load repos
    fireEvent.press(button)
    expect(getByText('Loading repos...')).toBeTruthy()

    await waitFor(() => expect(queryByText('Loading repos...')).toBeNull())

    expect(getByText('Sorry, smething went wrong')).toBeTruthy()
  })
})
