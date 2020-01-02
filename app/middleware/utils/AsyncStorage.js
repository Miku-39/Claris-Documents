import { AsyncStorage } from 'react-native'



export const storeCredentials = (user, password) => {
    try {
        AsyncStorage.setItem('@bcmobileapp:user', user)
        AsyncStorage.setItem('@bcmobileapp:password', password)
    } catch (error) {
        console.warn('error occured while saving user info', error)
    }
}

export const clearStorage = async () => {
  try {
      await AsyncStorage.clear()
  } catch (error) {
      console.warn('error occured while clearing the storage', error)
  }
}

export const loadCredentials = async () => {
    try {
        const user = await AsyncStorage.getItem('@bcmobileapp:user')
        const password = await AsyncStorage.getItem('@bcmobileapp:password')
        return { remember: true, user, password }
    } catch (error) {
        console.warn('error occured while retrieving user info', error)
    }
}
