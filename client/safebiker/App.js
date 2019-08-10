import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Font from 'expo-font';
import HomeScreen from './components/HomeScreen';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fontLoaded: false
    }
  }
  async componentDidMount() {
    await Font.loadAsync({
      'roboto': require('./assets/fonts/Roboto-Regular.ttf'),
    });
    this.setState({ fontLoaded: true });
  }
  render() {
    const {
      fontLoaded
    } = this.state;
    return (
      <View style={styles.container}>
        {
          fontLoaded ? 
            <HomeScreen />
            : null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
