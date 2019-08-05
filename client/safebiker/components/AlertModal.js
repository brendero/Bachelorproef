import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, Modal, StatusBar } from 'react-native'
import { height } from '../config/styles';

export default class AlertModal extends Component {
  render() {
    const { type } = this.props.hazard[0];
    return (
      <View style={[styles.modalWrapper, this.props.modalVisible ? '' : styles.modalInvisible]}>
        <Text style={{color: 'lightgrey', alignSelf: 'flex-start', fontSize: 12}}>60m</Text>
        <Image source={require('../assets/tram-marker.png')} style={styles.modalImage}/>
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
    height: height / 5,
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