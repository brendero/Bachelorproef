import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps';
import Polyline from '@mapbox/polyline';
import * as Permissions from 'expo-permissions';
import Searchbar from './components/Searchbar';
import ReportModal from './components/ReportModal';
import GpsButton from './components/GpsButton';
import * as Font from 'expo-font';
import { API_KEY } from './config/keys';
import { colors } from './config/styles';
import axios from 'axios'

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userLocation: null,
      markerLocation: null,
      activeRoute: null,
      endDestination: null,
      watcherId: null
    }

    this.getGeoLocation = this.getGeoLocation.bind(this)
    this.setMapLocation = this.setMapLocation.bind(this)
  }
  setMapLocation(lat, lon, zoom) {
    this.setState({
      userLocation: {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        latitudeDelta: 0.0922 * zoom,
        longitudeDelta: 0.0421 * zoom
      },
      markerLocation: {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon)
      }
    })
  }
  watchLocation() {
    const watcherId = navigator.geolocation.watchPosition(
      (position) => {
        this.setMapLocation(position.coords.latitude, position.coords.longitude, 0.2)
      },
      (err) => console.log(err),
      { enableHighAccuracy: true, timeout: 2000, maximumAge: 1000}
    )
    this.setState({
      watcherId
    })
  }
  stopLocationWatch() {
    navigator.geolocation.clearWatch(this.state.watcherId);
  }
  async getRoute(destination) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setMapLocation(position.coords.latitude, position.coords.longitude, 1)
        const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${position.coords.latitude},${position.coords.longitude}&destination=${destination}&mode=bicycling&key=${API_KEY}`

        axios
          .get(apiUrl)
          .then(res => {
            const decodedPoints = Polyline.decode(res.data.routes[0].overview_polyline.points);

            const endCoords = res.data.routes[0].legs[0].end_location;

            const coords = decodedPoints.map((point, index) => {
              return {
                latitude: point[0],
                longitude: point[1]
              }
            })
            
            this.setState({
              activeRoute: coords,
              endDestination: {
                latitude: parseFloat(endCoords.lat),
                longitude: parseFloat(endCoords.lng)
              }
            })
          })
          .catch(err => console.log(err))
      },
      (err) => console.log(err),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
    
  }
  getGeoLocation() {
    const granted = Permissions.askAsync(Permissions.LOCATION)

    granted.then(res => {
      if(res.status === 'granted') {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.setMapLocation(position.coords.latitude, position.coords.longitude, 0.2)
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
  async componentDidMount() {
    this.getGeoLocation();
  }
  render() {
    const { userLocation, markerLocation, activeRoute, endDestination} = this.state;
    return (
      <View style={styles.container}>
        <MapView 
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
          {
            activeRoute ?
              <MapView.Polyline
                coordinates={activeRoute}
                strokeWidth={6}
                strokeColor={colors.main}
              /> :
              null
          }
          {
            endDestination ?
              <MapView.Marker 
                title="End destination"
                coordinate={endDestination}
              />:
              null
          }
        </MapView>
        {
          activeRoute ?
          <GpsButton startGps={() => this.watchLocation()} stopGps={() => this.stopLocationWatch()}/> :
          <Searchbar onPress={value => this.getRoute(value)}/>
        }
        <ReportModal/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
