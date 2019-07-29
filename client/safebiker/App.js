import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps';
import * as Permissions from 'expo-permissions';
import Searchbar from './components/Searchbar';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userLocation: null,
      markerLocation: null
    }

    this.getGeoLocation = this.getGeoLocation.bind(this)
    this.setMapLocation = this.setMapLocation.bind(this)
  }
  setMapLocation(lat, lon) {
    this.setState({
      userLocation: {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      markerLocation: {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon)
      }
    })
  }
  getGeoLocation() {
    const granted = Permissions.askAsync(Permissions.LOCATION)

    granted.then(res => {
      if(res.status === 'granted') {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.setMapLocation(position.coords.latitude, position.coords.longitude)
          },
          (err) => console.log(err),
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
        );
      }
      else {
        alert(`can't get your location`)
      }
    }
    )
    .catch(err => console.log(err))
  }
  componentDidMount() {
    this.getGeoLocation();
  }
  render() {
    const { userLocation, markerLocation } = this.state;
    return (
      <View style={styles.container}>
        <Searchbar/>
        {/* <MapView 
          style={{flex: 1}}
          initialRegion={userLocation}
          region={userLocation}
        >
          {
            markerLocation ? 
              <MapView.Marker
                coordinate={markerLocation}
                image={require('./assets/Marker.png')}
              /> : 
              null

          }
        </MapView> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
