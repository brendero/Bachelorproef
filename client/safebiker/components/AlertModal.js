import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, Modal, StatusBar } from 'react-native'
import { height } from '../config/styles';

export default class AlertModal extends Component {
  renderHeader(type) {
      // initialize source variable
      let source;
      // use switch to return right image based on type
      switch(type) {
        case 'tram':
          source = require('../assets/tram-marker.png')
          return (
            <View style={styles.modalTextWrapper}>
              <Image source={source} style={styles.modalImage}/>
              <Text style={styles.modalText}>Tram tracks</Text>
            </View>
            )
        case 'busystreet':
          source = require('../assets/busystreet-marker.png')
          return (
            <View style={styles.modalTextWrapper}>
              <Image source={source} style={styles.modalImage}/>
              <Text style={styles.modalText}>Busy street</Text>
            </View>
          )
        case 'obstruction':
          source = require('../assets/obstruction-marker.png')
          return (
            <View style={styles.modalTextWrapper}>
              <Image source={source} style={styles.modalImage}/>
              <Text style={styles.modalText}>Obstruction</Text>
            </View>
            )
        case 'badbikepath':
          source = require('../assets/badbikepath-marker.png')
          return (
            <View style={styles.modalTextWrapper}>
              <Image source={source} style={styles.modalImage}/>
              <Text style={styles.modalText}>Bad bike path</Text>
            </View>
          )
        case 'highcurb':
          source = require('../assets/highcurb-marker.png')
          return (
            <View style={styles.modalTextWrapper}>
              <Image source={source} style={styles.modalImage}/>
              <Text style={styles.modalText}>High curb</Text>
            </View>
          )
        case 'intersection':
          source = require('../assets/intersection-marker.png') 
          return (
            <View style={styles.modalTextWrapper}>
              <Image source={source} style={styles.modalImage}/>
              <Text style={styles.modalText}>Intersection</Text>
            </View>
          )
        case 'badroad':
          source = require('../assets/badroad-marker.png')
          return (
            <View style={styles.modalTextWrapper}>
              <Image source={source} style={styles.modalImage}/>
              <Text style={styles.modalText}>Bad road</Text>
            </View>
          )
        case 'other':
          source = require('../assets/other-marker.png')                  
          return (
            <View style={styles.modalTextWrapper}>
              <Image source={source} style={styles.modalImage}/>
              <Text style={styles.modalText}>Unnamed danger</Text>
            </View>
          )
        default:
          source = require('../assets/other-marker.png')                
          return (
            <View style={styles.modalTextWrapper}>
              <Image source={source} style={styles.modalImage}/>
              <Text style={styles.modalText}>Unnamed danger</Text>
            </View>
          )
    }
  }
  render() {
    const { type } = this.props.hazard[0];
    return (
      <View style={[styles.modalWrapper, this.props.modalVisible ? '' : styles.modalInvisible]}>
        <Text style={styles.distanceText}>60m</Text>
        {this.renderHeader(type)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  modalWrapper: {
    position: "absolute",
    top: StatusBar.currentHeight,
    width: "100%",
    backgroundColor: "white",
    padding: 30,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3
  },
  modalInvisible: {
    opacity: 0
  },
  modalImage: {
    width: 50,
    height: 50,
    marginVertical: 10,
    resizeMode: "cover"
  },
  modalText: {
    fontWeight: "bold",
    fontFamily: 'roboto',
    fontSize: 20
  },
  distanceText: {
    color: 'lightgrey',
    alignSelf: 'flex-start',
    fontSize: 18,
    fontFamily: 'roboto'
  },
  modalTextWrapper: {
    flexDirection: 'column',
    alignItems: 'center'
  }
})