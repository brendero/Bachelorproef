import React, { Component } from 'react'
import { View, Vibration } from 'react-native'
import MapView from 'react-native-maps';
import { API_KEY } from '../config/keys';
import { colors } from '../config/styles';
import { MONGO_URL } from '../config/dbconfig';
import Polyline from '@mapbox/polyline';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as turf from '@turf/turf';
import axios from 'axios';
import Searchbar from './Searchbar';
import ReportModal from './ReportModal';
import GpsButton from './GpsButton';
import AlertModal from './AlertModal';
import CustomCallout from './CustomCallout';

export default class HomeScreen extends Component {
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
      nearbyHazard: null,
      calloutVisible: false,
      selectedHazard: null,
      locationWatched: false,
    }

    this.getGeoLocation = this.getGeoLocation.bind(this)
    this.setMapLocation = this.setMapLocation.bind(this)
  }
  setMapLocation(lat, lon, zoom, heading, altitude, pitch) {
    const camera = {
      center: {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
      },
      heading,
      pitch: pitch,
      zoom,
      altitude
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
  async watchLocation() {
    this.setState({
      locationWatched: true
    })
    const watcherId = await Location.watchPositionAsync({accuracy: 6, timeInterval: 1000, distanceInterval: 5},
      async (position) => {
        const { latitude, longitude, altitude } = position.coords;
        let heading;
        await Location.getHeadingAsync()
          .then(res => {
            heading = res.trueHeading;
          })
          .catch(err => console.log(err))

        this.setMapLocation(latitude, longitude, 18, heading, altitude, 90)

        const currentLocation = turf.point([position.coords.longitude, position.coords.latitude])

        this.state.hazardMarkers.map((hazard, index) => {
          const circle = turf.circle([hazard[0].location.coordinates[0], hazard[0].location.coordinates[1]],60,{steps: 10, units: 'meters'})
          if(turf.booleanContains(circle, currentLocation) === true) {
            //  Open Modal with data of hazard
            this.setState({
              nearbyHazard: hazard,
              alertVisible: true
            })
            Vibration.vibrate(1000)
            setTimeout(() => {
              this.setState({
                alertVisible: false
              })
            }, 5000);
          }
        })
      })

    this.setState({
      watcherId
    })
  }
  stopLocationWatch() {
    this.state.watcherId.remove()    

    this.setState({
      locationWatched: false,
      activeRoute: null,
      endDestination: null,
      hazardMarkers: []
    })
  }
  async getRoute(destination) {
    await Location.getCurrentPositionAsync({accuracy: 6, maximumAge: 1000 })
      .then(position => {
        const { latitude, longitude, heading, altitude } = position.coords;
        this.setMapLocation(latitude, longitude, 14, heading, altitude, 0)

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
      })
      .catch(err => console.log(err))
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
        Location.getCurrentPositionAsync({ accuracy: 6, maximumAge: 1000 })
          .then(position => {
              const { latitude, longitude, heading, altitude } = position.coords;
              this.setMapLocation(latitude, longitude, 15, heading, altitude, 0)
            }
            )
            .catch(err => console.log(err))
      }
      else {
        alert(`can't get your location`)
      }
    }
    )
    .catch(err => console.log(err))
  }
  openCallout(hazard) {
    this.setState({
      selectedHazard: hazard,
      calloutVisible: true
    })
  }
  closeCallout() {
    this.setState({
      calloutVisible: false,
      selectedHazard: null
    })
  }
  async componentDidMount() {
    await this.getGeoLocation();
  }
  render() {
    const {
      userLocation,
      markerLocation,
      activeRoute,
      endDestination,
      hazardMarkers,
      alertVisible,
      nearbyHazard,
      calloutVisible,
      selectedHazard,
      locationWatched
    } = this.state
    return (
      <View style={{flex:1}}>
        <MapView
          ref={ref => this.map = ref}
          style={{flex: 1}}
          initialCamera={userLocation}
          showsUserLocation={true}
          followsUserLocation={locationWatched}
          showsCompass={false}
          >
          {
            markerLocation ?
            <MapView.Marker
            coordinate={markerLocation}
            icon={require('../assets/Marker.png')}
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
                  source = require('../assets/tram-marker.png')
                  break;
                case 'busystreet':
                  source = require('../assets/busystreet-marker.png')
                  break;
                case 'obstruction':
                  source = require('../assets/obstruction-marker.png')
                  break;
                case 'badbikepath':
                  source = require('../assets/badbikepath-marker.png')
                  break;
                case 'highcurb':
                  source = require('../assets/highcurb-marker.png')
                  break;
                case 'intersection':
                  source = require('../assets/intersection-marker.png')
                  break;
                case 'badroad':
                  source = require('../assets/badroad-marker.png')
                  break;
                case 'other':
                  source = require('../assets/other-marker.png')
                  break;
                default:
                  source = require('../assets/other-marker.png')
                  break;
              }
              return (
                <MapView.Marker
                key={index}
                image={source}
                coordinate={{ latitude: hazard[0].location.coordinates[1], longitude: hazard[0].location.coordinates[0] }}
                onPress={() => this.openCallout(hazard)}
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
          alertVisible ?
            <AlertModal hazard={nearbyHazard} modalVisible={alertVisible}/> :
          null
        }
        {
          selectedHazard ?
            <CustomCallout closeModal={() => this.closeCallout()} visible={calloutVisible} hazard={selectedHazard}/>:
            null
        }
      </View>
    )
  }
}
