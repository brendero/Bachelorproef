import React, { Component } from 'react'
import { Text, View, TextInput, StyleSheet } from 'react-native'
import { FontAwesome } from '@expo/vector-icons';

export default class Searchbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchQuery: ''
    }
  }
  render() {
    const { searchQuery } = this.state;
    
    return (
      <View style={styles.container}>
        <View style={styles.searchbar}>
          <View style={styles.formWrapper}>
            <FontAwesome name="search" />
            <TextInput
              value={searchQuery}
              style={styles.searchForm}
              placeholder="destination"
              onChangeText={value => {
                this.setState({
                  searchQuery: value
                })
              }}
              />
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    zIndex: 2
  },
  formWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 0,
    padding: 0
  },
  searchbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'blue',
    elevation: 3,
    width: '90%',
    borderRadius: 10,
    margin: 0,
    padding: 5
  },
  searchForm: {
    padding: 10,
    margin: 0,
    width: '100%'
  }
})