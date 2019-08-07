import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, Modal, StatusBar } from 'react-native'
import { height } from '../config/styles';

export default class AlertModal extends Component {
  renderImage(type) {
      let source;
      switch(type) {
        case 'tram':
          source = require('../assets/tram-marker.png')
          return (<Image source={source} style={styles.modalImage}/>)
        case 'busystreet':
          source = require('../assets/busystreet-marker.png')
          return (<Image source={source} style={styles.modalImage}/>)
        case 'obstruction':
          source = require('../assets/obstruction-marker.png')
          return (<Image source={source} style={styles.modalImage}/>)
        case 'badbikepath':
          source = require('../assets/badbikepath-marker.png')
          return (<Image source={source} style={styles.modalImage}/>)
        case 'highcurb':
          source = require('../assets/highcurb-marker.png')
          return (<Image source={source} style={styles.modalImage}/>)
        case 'intersection':
          source = require('../assets/intersection-marker.png') 
          return (<Image source={source} style={styles.modalImage}/>)
        case 'badroad':
          source = require('../assets/badroad-marker.png')
          return (<Image source={source} style={styles.modalImage}/>)
        case 'other':
          source = require('../assets/other-marker.png')                  
          return (<Image source={source} style={styles.modalImage}/>)
        default:
          source = require('../assets/other-marker.png')                
          return (<Image source={source} style={styles.modalImage}/>)
    }
  }
  render() {
    const { type } = this.props.hazard[0];
    return (
      <View style={[styles.modalWrapper, this.props.modalVisible ? '' : styles.modalInvisible]}>
        <Text style={{color: 'lightgrey', alignSelf: 'flex-start', fontSize: 18}}>60m</Text>
        {this.renderImage(type)}
        <Text style={styles.modalText}>{ type }</Text>
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
    fontSize: 20
  }
})