import React, { Component } from 'react'
import { Text, View, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native'
import { width, height, colors } from '../config/styles'

export default class ReportModal extends Component {
  state = {
    modalVisible: false
  }
  setModalVisible(visible) {
    this.setState({
      modalVisible: visible
    })
  }
  render() {
    const { modalVisible } = this.state;
    return (
      <View style={{width: '100%', position: 'absolute'}}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          >
          <View style={styles.modalWrapper}>
            <View style={styles.reportWrapper}>
              <TouchableOpacity style={styles.reportBtn}>
                <Image 
                  style={styles.reportIcon}
                  source={require('../assets/tram.png')}/>
                <Text style={styles.reportText}>Tram tracks</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reportBtn}>
                <Image 
                  style={styles.reportIcon}
                  source={require('../assets/busy-street.png')}/>
                <Text style={styles.reportText}>Busy street</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reportBtn}>
                <Image 
                  style={styles.reportIcon}
                  source={require('../assets/obstruction.png')}/>
                <Text style={styles.reportText}>Obstruction</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reportBtn}>
                <Image 
                  style={styles.reportIcon}
                  source={require('../assets/bike-path.png')}/>
                <Text style={styles.reportText}>Bad bike path</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reportBtn}>
                <Image 
                  style={styles.reportIcon}
                  source={require('../assets/curb.png')}/>
                <Text style={styles.reportText}>High curb</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reportBtn}>
                <Image 
                  style={styles.reportIcon}
                  source={require('../assets/intersection.png')}/>
                <Text style={styles.reportText}>Dangerous intersection</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reportBtn}>
                <Image 
                  style={styles.reportIcon}
                  source={require('../assets/bad-road.png')}/>
                <Text style={styles.reportText}>Bad road</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reportBtn}>
                <Image 
                  style={styles.reportIcon}
                  source={require('../assets/Report.png')}/>
                <Text style={styles.reportText}>Unnamed danger</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.closeBtn}
              onPress={() => this.setModalVisible(!modalVisible)}
            >
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <TouchableOpacity onPress={() => this.setModalVisible(!modalVisible)} style={styles.openBtn}>
          <Image source={require('../assets/Report.png')}/>
        </TouchableOpacity>
      </View>

    )
  }
}

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1
  },
  reportWrapper: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  reportBtn: {
    width: width/2,
    height: (height - 80)/4,
    borderColor: colors.main,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeBtn: {
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center'
  },
  openBtn: {
    position: 'absolute',
    zIndex: 999,
    right: 20,
    top: height - 100
  },
  reportIcon: {
    width: '50%',
    height: 60,
    resizeMode: 'contain'
  },
  reportText: {
    marginTop: 10,
  }
})