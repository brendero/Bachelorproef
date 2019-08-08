import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native'
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { MONGO_URL } from '../config/dbconfig';

export default class CustomCallout extends Component {
  constructor(props) {
    super(props);

    this.supportHazard = this.supportHazard.bind(this);
    this.reportHazard = this.reportHazard.bind(this);
  }
  reportHazard() {
    axios
      .post(`${MONGO_URL}/api/hazards/report/${this.props.hazard[0]._id}`)
      .then(res => this.props.closeModal())
      .catch(err => this.props.closeModal())
  }
  supportHazard() {
    axios
      .post(`${MONGO_URL}/api/hazards/support/${this.props.hazard[0]._id}`)
      .then(res => this.props.closeModal())
      .catch(err => this.props.closeModal())
  }
  renderHeader(type) {
    let source;
    switch(type) {
      case 'tram':
        source = require('../assets/tram-marker.png')
        return (
          <View style={styles.descriptionWrapper}>
            <Image source={source} style={styles.headerImage}/>
            <Text style={{fontWeight: "bold"}}>Tram Tracks</Text>
          </View>
        )
      case 'busystreet':
        source = require('../assets/busystreet-marker.png')
        return (
          <View style={styles.descriptionWrapper}>
            <Image source={source} style={styles.headerImage}/>
            <Text style={{fontWeight: "bold"}}>Busy Street</Text>  
          </View>
        )
      case 'obstruction':
        source = require('../assets/obstruction-marker.png')
        return (
          <View style={styles.descriptionWrapper}>
            <Image source={source} style={styles.headerImage}/>
            <Text style={{fontWeight: "bold"}}>Obstruction</Text>  
          </View> 
        )
      case 'badbikepath':
        source = require('../assets/badbikepath-marker.png')
        return (
          <View style={styles.descriptionWrapper}>
            <Image source={source} style={styles.headerImage}/>
            <Text style={{fontWeight: "bold"}}>Bad Bike Path</Text>  
          </View>
        )
      case 'highcurb':
        source = require('../assets/highcurb-marker.png')
        return (
          <View style={styles.descriptionWrapper}>
            <Image source={source} style={styles.headerImage}/>
            <Text style={{fontWeight: "bold"}}>High Curb</Text>  
          </View>
        )
      case 'intersection':
        source = require('../assets/intersection-marker.png') 
        return (
          <View style={styles.descriptionWrapper}>
            <Image source={source} style={styles.headerImage}/>
            <Text style={{fontWeight: "bold"}}>Intersection</Text>
          </View>
        )
      case 'badroad':
        source = require('../assets/badroad-marker.png')
        return (
          <View style={styles.descriptionWrapper}>
            <Image source={source} style={styles.headerImage}/>
            <Text style={{fontWeight: "bold"}}>Bad Road</Text>
          </View>
        )
      case 'other':
        source = require('../assets/other-marker.png')                  
        return (
          <View style={styles.descriptionWrapper}>
            <Image source={source} style={styles.headerImage}/>
            <Text style={{fontWeight: "bold"}}>Unnamed Danger</Text>
          </View>
        )
      default:
        source = require('../assets/other-marker.png')                
        return (
          <View style={styles.descriptionWrapper}>
            <Image source={source} style={styles.headerImage}/>
            <Text style={{fontWeight: "bold"}}>Unnamed Danger</Text>
          </View>
        )
  }
}
  render() {
    const { type } = this.props.hazard[0];
    return (
      <Modal
        visible={this.props.visible}
        transparent={true}
      >
        <View style={styles.reportView}>
        {this.renderHeader(type)}
        <View style={{flexDirection: 'column', justifyContent: 'space-between'}}>
          <TouchableOpacity style={styles.reportBtn} onPress={this.supportHazard}>
            <FontAwesome name="thumbs-up" style={{color: "#4C64BE", padding: 5}}/>
            <Text>Correct information</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reportBtn} onPress={this.reportHazard}>
            <FontAwesome name="thumbs-down" style={{color: "#BE2525", padding: 5}}/>
            <Text>Incorrect information</Text> 
          </TouchableOpacity>
        </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  descriptionWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10
  },
  headerImage: {
    resizeMode: 'cover',
    width: 40,
    height: 40
  },
  reportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10
  },
  reportView: {
    backgroundColor: "white",
    elevation: 3,
    borderRadius: 20,
    padding: 10
  }
})
