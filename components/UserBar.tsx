import { Pressable, View, Text, FlatList, ImageBackground } from 'react-native'
import { ThemedText } from './ThemedText'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { User } from '@/app/(tabs)'
import { styles } from '@/styles'

interface UserBarProps {
  user: User
}

export type Repo = {
  name: string
  stargazers_count: number
  description: string
  id: number
}

export const UserBar = ({ user }: UserBarProps) => {
  const [userRepos, setUserRepos] = useState<Repo[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isNoResults, setIsNoResults] = useState<boolean>(false)
  const [isReposDisplayed, setIsReposDisplayed] = useState<boolean>(false)
  const [errorMessege, setErrorMessage] = useState<string>('')

  useEffect(() => {
    isLoading && setErrorMessage('')
  }, [isLoading])

  const fetchAllRepos = async (username: string, page = 1, repos = []) => {
    setIsLoading(true)
    setIsReposDisplayed(true)
    try {
      const res = await axios.get(
        `https://api.github.com/users/${username}/repos`,
        {
          params: { page, per_page: 100 },
        },
      )

      const newRepos = repos.concat(res.data)

      if (res.data.length === 100) {
        return fetchAllRepos(username, page + 1, newRepos)
      } else {
        setUserRepos(newRepos)
        setIsNoResults(newRepos.length == 0)
      }
    } catch (error) {
      setIsNoResults(true)
      setErrorMessage('Sorry, smething went wrong')
      console.log(error)
    }
  }

  const getRepos = async (username: string) => {
    await fetchAllRepos(username)
    setIsLoading(false)
  }

  const listRepos = () => {
    return (
      <View style={styles.reposContainer}>
        <FlatList
          data={userRepos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.repoCard}>
              <View style={styles.repoHeader}>
                <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                <Text>{item.stargazers_count} ⭐</Text>
              </View>
              <Text>{item.description}</Text>
            </View>
          )}
        />
      </View>
    )
  }

  function renderResults() {
    if (isLoading) {
      return <Text style={styles.reposAction}>Loading repos...</Text>
    } else if (isReposDisplayed) {
      if (!isNoResults) {
        return <>{listRepos()}</>
      } else {
        return (
          <>
            <Text style={styles.reposAction}>No repos to display</Text>
            {errorMessege && (
              <Text style={styles.reposAction}>{errorMessege}</Text>
            )}
          </>
        )
      }
    }
  }
  return (
    <View style={styles.userContainer}>
      <View style={styles.accountContainer}>
        <View style={styles.accountContainer}>
          <ImageBackground
            style={styles.image}
            source={{
              uri: user.avatar_url,
            }}
          />
          <ThemedText type="defaultSemiBold" style={styles.repoText}>
            {user.login}
          </ThemedText>
        </View>
        <Pressable
          role="button"
          disabled={isLoading}
          onPress={() =>
            isReposDisplayed ? setIsReposDisplayed(false) : getRepos(user.login)
          }
          style={styles.arrow}
        >
          <Text> {isReposDisplayed ? '🔺' : '🔻'}</Text>
        </Pressable>
      </View>
      {renderResults()}
    </View>
  )
}
