import React, { Component } from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import { FontAwesome } from '@expo/vector-icons';
import { colors } from '../config/styles';

export default class GpsButton extends Component {
  constructor(props) {
    super(props);

    this.state= {
      locationWatching: false
    }
    this.toggleGps = this.toggleGps.bind(this);
  }
  toggleGps() {
    if(this.state.locationWatching === false) {
      this.setState({
        locationWatching: true
      })
      this.props.startGps();
    }
    if(this.state.locationWatching === true) {
      this.setState({
        locationWatching: false
      })
      this.props.stopGps();
    }
  }
  render() {
    const { locationWatching } = this.state;
    return (
      <View style={styles.container}>
        {
          locationWatching ?
            <TouchableOpacity style={styles.stopBtn} onPress={this.toggleGps}>
              <FontAwesome name='times' style={{color:'white'}} />
              <Text style={styles.goBtnText}>
                Stop
              </Text>
            </TouchableOpacity> :
            <TouchableOpacity style={styles.goBtn} onPress={this.toggleGps}>
              <FontAwesome name="paper-plane" style={{color: 'white'}}/>
              <Text style={styles.goBtnText}>
                Go
              </Text>
            </TouchableOpacity>
        }
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
  goBtn: {
    backgroundColor: colors.main,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    elevation: 2
  },
  goBtnText: {
    color: 'white',
    width: '90%',
    paddingHorizontal: 10,
    fontFamily: 'roboto'
  },
  stopBtn: {
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    elevation: 2
  }
})