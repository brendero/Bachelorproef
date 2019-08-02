import React, { Component } from 'react'
import { Text, View, TextInput, StyleSheet } from 'react-native'
import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { colors } from '../config/styles';

export default class Searchbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchQuery: 'Stevenson Park, Mountain View'
    }
  }
  render() {
    const { searchQuery } = this.state;
    
    return (
      <View style={styles.container}>
        <View style={styles.formWrapper}>
          <FontAwesome name="search" />
          <TextInput
            value={searchQuery}
            style={styles.searchForm}
            placeholder="Give in your destination"
            onChangeText={value => {
              this.setState({
                searchQuery: value
              })
            }}
            />
        </View>
        <TouchableOpacity style={styles.routeBtn} onPress={() => this.props.onPress(this.state.searchQuery)}>
          <FontAwesome name="bicycle" style={{color: 'white'}}/>
          <Text style={styles.routeBtnText}>
            Show route
          </Text>
        </TouchableOpacity>
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
    top: 30,
    zIndex: 2
  },
  formWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 0,
    padding: 0,
    backgroundColor: 'white', 
    elevation: 3,
    borderRadius: 10,
    paddingHorizontal: 10
  },
  searchForm: {
    padding: 10,
    margin: 0,
    width: '90%'
  },
  routeBtn: {
    marginTop: 10,
    backgroundColor: colors.main,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    elevation: 2
  },
  routeBtnText: {
    color: 'white',
    width: '90%',
    paddingHorizontal: 10
  }
})