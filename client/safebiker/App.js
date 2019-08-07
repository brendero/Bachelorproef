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
import { MONGO_URL } from './config/dbconfig';
import * as turf from '@turf/turf';
import AlertModal from './components/AlertModal';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userLocation: null,
      markerLocation: null,
      activeRoute: null,
      endDestination: null,
      hazardMarkers: [],
      watcherId: null,
      alertVisible: false,
      nearbyHazard: null
    }

    this.getGeoLocation = this.getGeoLocation.bind(this)
    this.setMapLocation = this.setMapLocation.bind(this)
  }
  setMapLocation(lat, lon, zoom, heading, altitude) {
    const camera = {
      center: {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
      },
      altitude,
      heading,
      pitch: 1,
      zoom
    };

    this.map.animateCamera(camera)
    
    this.setState({
      userLocation: camera,
      markerLocation: {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon)
      }
    })
  }
  watchLocation() {
    const watcherId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, heading, altitude } = position.coords;
        this.setMapLocation(latitude, longitude, 18, heading, altitude)

        const currentLocation = turf.point([position.coords.longitude, position.coords.latitude])
        
        this.state.hazardMarkers.map((hazard, index) => {
          const circle = turf.circle([hazard[0].location.coordinates[0], hazard[0].location.coordinates[1]],60,{steps: 10, units: 'meters'})
          if(turf.booleanContains(circle, currentLocation) === true) {
            // TODO: Open Modal with data of hazard
            this.setState({
              nearbyHazard: hazard,
              alertVisible: true
            })

            setTimeout(() => {
              this.setState({
                alertVisible: false
              })
            }, 5000);
          }
        })
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

    this.setState({
      activeRoute: null,
      endDestination: null,
      hazardMarkers: []
    })
  }
  async getRoute(destination) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        
        const { latitude, longitude, heading, altitude } = position.coords;
        this.setMapLocation(latitude, longitude, 14, heading, altitude)

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

            this.getPointsOnRoute(coords);
          })
          .catch(err => console.log(err))
      },
      (err) => console.log(err),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    ); 
  }
  getPointsOnRoute(coords) {
    for (let i = 0; i < coords.length; i = i+4) {
      axios
        .get(`${MONGO_URL}/api/hazards/search`, {
          params: {
            coordinates: coords[i]
          }
        })
        .then(res => {
          if(res.data.length !== 0) {
            this.setState({
              hazardMarkers: [...this.state.hazardMarkers, res.data]
            })
          }
        })
        .catch(err => console.log(err))
    }
  }
  getGeoLocation() {
    const granted = Permissions.askAsync(Permissions.LOCATION)

    granted.then(res => {
      if(res.status === 'granted') {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude, heading, altitude } = position.coords;
            this.setMapLocation(latitude, longitude, 15, heading, altitude)
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
    const { userLocation, markerLocation, activeRoute, endDestination, hazardMarkers} = this.state;
    return (
      <View style={styles.container}>
        <MapView 
          ref={ref => this.map = ref}
          style={{flex: 1}}
          initialCamera={userLocation}
          showsUserLocation={true}
          followsUserLocation={true}
          >
          {
            markerLocation ? 
            <MapView.Marker
            coordinate={markerLocation}
            icon={require('./assets/Marker.png')}
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
          {
            JSON.stringify(hazardMarkers) !== '[]' ?
            hazardMarkers.map((hazard, index) => {
              let source;
              switch(hazard[0].type) {
                case 'tram':
                  source = require('./assets/tram-marker.png')
                  break;
                case 'busystreet':
                  source = require('./assets/busystreet-marker.png')
                  break;
                case 'obstruction':
                  source = require('./assets/obstruction-marker.png')
                  break;
                case 'badbikepath':
                  source = require('./assets/badbikepath-marker.png')
                  break;
                case 'highcurb':
                  source = require('./assets/highcurb-marker.png')
                  break;
                case 'intersection':
                  source = require('./assets/intersection-marker.png') 
                  break;
                case 'badroad':
                  source = require('./assets/badroad-marker.png')
                  break;
                case 'other':
                  source = require('./assets/other-marker.png')   
                  break;               
                default:
                  source = require('./assets/other-marker.png')    
                  break;              
              }

              return (
                <MapView.Marker 
                key={index}
                title={hazard[0].type}
                image={source}
                coordinate={{ latitude: hazard[0].location.coordinates[1], longitude: hazard[0].location.coordinates[0] }}
                />
              )
            }) :
              null
          }
        </MapView>
        {
          activeRoute ?
          <GpsButton startGps={() => this.watchLocation()} stopGps={() => this.stopLocationWatch()}/> :
          <Searchbar onPress={value => this.getRoute(value)}/>
        }
        <ReportModal/>
        {
          this.state.alertVisible ?
          <AlertModal hazard={this.state.nearbyHazard} modalVisible={this.state.alertVisible}/> : 
          null
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
