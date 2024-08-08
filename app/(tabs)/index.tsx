import {
  TextInput,
  FlatList,
  View,
  Text,
  Pressable,
  ImageBackground,
} from 'react-native'

import { HelloWave } from '@/components/HelloWave'
import { ThemedText } from '@/components/ThemedText'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { SafeAreaView } from 'react-native-safe-area-context'
import { UserBar } from '@/components/UserBar'
import { styles } from '@/styles'

export type User = {
  login: string
  id: number
  avatar_url: string
}

export default function HomeScreen() {
  const [userQuery, setUserQuery] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isNoResults, setIsNoResults] = useState<boolean>(false)
  const [lastQuery, setLastQuery] = useState('')
  const [errorMessege, setErrorMessage] = useState<string>('')

  useEffect(() => {
    userQuery == '' && setIsNoResults(false)
  }, [userQuery])

  useEffect(() => {
    isLoading && setErrorMessage('')
  }, [isLoading])

  const getUsers = async (query: String) => {
    setIsLoading(true)
    setLastQuery(userQuery)
    try {
      const res = await axios.get(
        `https://api.github.com/search/users?q=${query}`,
      )
      setUsers(res.data.items.slice(0, 5))
      setIsNoResults(res.data.items.length == 0)
    } catch (error) {
      setIsNoResults(true)
      setErrorMessage('Sorry, smething went wrong')
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const listUsers = () => {
    return (
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <UserBar user={item} />}
      />
    )
  }

  function renderResults() {
    if (isLoading) {
      return <Text style={styles.loadingText}>Loading...</Text>
    } else if (!isNoResults) {
      return <>{listUsers()}</>
    } else {
      return (
        <>
          <Text style={styles.loadingText}>no results for '{lastQuery}'</Text>
          {errorMessege && (
            <Text style={styles.loadingText}>{errorMessege}</Text>
          )}
        </>
      )
    }
  }

  return (
    <>
      <SafeAreaView style={styles.mainArea}>
        <ImageBackground
          resizeMode="contain"
          source={require('@/assets/images/pngwing.com.png')}
          style={styles.basicSmall}
        />
        <View style={styles.basicLarge}>
          <View style={styles.titleContainer}>
            <ThemedText type="title">Github search</ThemedText>
            <HelloWave />
          </View>
          <View style={styles.stepContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter username to start"
              placeholderTextColor="gray"
              onChangeText={(newText) => setUserQuery(newText)}
              defaultValue={userQuery}
            />
            <Pressable
              role="button"
              style={[
                styles.searchButton,
                (!userQuery || isLoading) && styles.searchButtonDisabled,
              ]}
              disabled={!userQuery || isLoading}
              onPress={() => getUsers(userQuery)}
            >
              <ThemedText type="defaultSemiBold">search</ThemedText>
            </Pressable>
            {renderResults()}
          </View>
        </View>
      </SafeAreaView>
    </>
  )
}
