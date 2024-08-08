import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#8ecae6',
  },

  arrow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 4,
    elevation: 3,
  },

  searchButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    elevation: 3,
    backgroundColor: '#f79d65',
    borderRadius: 6,
  },

  searchButtonDisabled: {
    backgroundColor: '#e0e1dd',
  },

  searchButtonActive: {
    backgroundColor: '#c8b6ff',
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 10,
    backgroundColor: 'transparent',
  },

  input: {
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
    padding: 10,
    marginBottom: 10,
  },

  loadingText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },

  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },

  mainArea: {
    flex: 1,
    paddingHorizontal: 20,
    position: 'relative',
    marginBottom: 120,
  },

  basicSmall: {
    flex: 1,
  },

  basicLarge: {
    flex: 2,
  },

  userContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },

  reposContainer: {
    marginTop: 10,
  },

  accountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  repoCard: {
    backgroundColor: '#f8d488',
    marginVertical: 5,
    padding: 10,
    borderRadius: 4,
    gap: 10,
  },

  repoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  image: {
    height: 50,
    width: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },

  reposAction: {
    paddingLeft: 10,
    marginTop: 20,
    color: 'gray',
  },

  repoText: {
    margin: 10,
  },
})
