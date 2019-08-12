import React, { Component } from 'react'
import { View, Vibration, Alert, BackAndroid } from 'react-native'
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
      passedHazards: []
    }

    this.getGeoLocation = this.getGeoLocation.bind(this)
    this.setMapLocation = this.setMapLocation.bind(this)
  }
  setMapLocation(lat, lon, zoom, heading, altitude, pitch) {
    // make Camera object with Location data
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

    // Animate map to new Location
    this.map.animateCamera(camera)

    this.setState({
      // Set the locationstate to cameraobject
      userLocation: camera,
      // set location of bike marker
      markerLocation: {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon)
      }
    })
  }
  async watchLocation() {
    // set locationWatched as true for locationtracking to begin
    this.setState({
      locationWatched: true
    })
    // start watching position
    // set WatcherId to response from watchpositionAsync
    const watcherId = await Location.watchPositionAsync({accuracy: 6, timeInterval: 1000, distanceInterval: 5},
      async (position) => {
        // Get location informtion from response using destructuring
        const { latitude, longitude, altitude } = position.coords;
        // initialize heading variable
        let heading;
        // get the viewing direction
        await Location.getHeadingAsync()
          .then(res => {
            // set heading variable to the viewing direction
            heading = res.trueHeading;
          })
          .catch(err => console.log(err))

        // set the Map location using the location data from the position watch
        // parameters: latitude, longitude, zoom, heading, altitude, viewing angle
        this.setMapLocation(latitude, longitude, 18, heading, altitude, 90)

        // make a turf point out of the current location
        const currentLocation = turf.point([position.coords.longitude, position.coords.latitude])

        // map through all hazardMarkers
        this.state.hazardMarkers.map((hazard, index) => {
          // create a diameter of 60 meters around hazard
          const circle = turf.circle([hazard[0].location.coordinates[0], hazard[0].location.coordinates[1]],60,{steps: 10, units: 'meters'})
          // check if current location is inside diameter of hazard and if alert hasn't already been shown
          if(turf.booleanContains(circle, currentLocation) === true && !this.state.passedHazards.includes(hazard[0]._id)) {
            //  Open Modal with data of hazard
            this.setState({
              // set the passed Hazard Id in array
              passedHazards: [...this.state.passedHazards, hazard[0]._id],
              // set Hazard for modal to show
              nearbyHazard: hazard,
              alertVisible: true
            })
            // make phone vibrate for 1S
            Vibration.vibrate(1000)
            // close alertModal after 5 seconds
            setTimeout(() => {
              this.setState({
                alertVisible: false
              })
            }, 5000);
          }
        })
      })
    // set watcherId state for quick removal later
    this.setState({
      watcherId
    })
  }
  stopLocationWatch() {
    // use provided watcherId state to stop locaiton watch
    this.state.watcherId.remove()    

    // clear states of locationWatching
    this.setState({
      locationWatched: false,
      activeRoute: null,
      endDestination: null,
      hazardMarkers: []
    })
  }
  async getRoute(destination) {
    // get the current position
    await Location.getCurrentPositionAsync({accuracy: 6, maximumAge: 1000 })
      .then(position => {
        // get location info from response using destructuring
        const { latitude, longitude, heading, altitude } = position.coords;

        // set the Map location using the location data from the position
        // parameters: latitude, longitude, zoom, heading, altitude, viewing angle
        this.setMapLocation(latitude, longitude, 14, heading, altitude, 0)

        // create URL for google directions API using current position coordinates and provided destination
        const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${position.coords.latitude},${position.coords.longitude}&destination=${destination}&mode=bicycling&key=${API_KEY}`

        // make response to API URL
        axios
          .get(apiUrl)
          .then(res => {
            // decode encoded polygon coordinates using Polyline from mapbox
            const decodedPoints = Polyline.decode(res.data.routes[0].overview_polyline.points);

            // get coordinatres of endlocation for later use in marker
            const endCoords = res.data.routes[0].legs[0].end_location;

            // map through decoded points and put coordinates in right structure 
            const coords = decodedPoints.map((point, index) => {
              return {
                latitude: point[0],
                longitude: point[1]
              }
            })

            this.setState({
              // set the activeRoute state with coords object
              activeRoute: coords,
              // set endDestination state to location object for use in marker
              endDestination: {
                latitude: parseFloat(endCoords.lat),
                longitude: parseFloat(endCoords.lng)
              }
            })

            // call function using coords of polyline
            this.getPointsOnRoute(coords);
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }
  getPointsOnRoute(coords) {
    // loop through all the points of polyline
    for (let i = 0; i < coords.length; i = i+4) {
      // make a GET response to mongoDB with coords as parameter
      // backend server will give hazards in proximity of point
      axios
        .get(`${MONGO_URL}/api/hazards/search`, {
          params: {
            coordinates: coords[i]
          }
        })
        .then(res => {
          // check if res isn't empty
          if(res.data.length !== 0) {
            this.setState({
              // add new hazard to existing hazardMarker state array using spread operator
              hazardMarkers: [...this.state.hazardMarkers, res.data]
            })
          }
        })
        .catch(err => console.log(err))
    }
  }
  getGeoLocation() {
    // ask permission for using userLocation
    const granted = Permissions.askAsync(Permissions.LOCATION)

    granted.then(res => {
      // check response to see if user has granted access to location
      if(res.status === 'granted') {
        // get the currenty position
        Location.getCurrentPositionAsync({ accuracy: 6, maximumAge: 1000 })
          .then(position => {
              // get locatiokn data from response using destructuring
              const { latitude, longitude, heading, altitude } = position.coords;

              // set the Map location using the location data from the position 
              // parameters: latitude, longitude, zoom, heading, altitude, viewing angle
              this.setMapLocation(latitude, longitude, 15, heading, altitude, 0)
            }
            )
            .catch(err => console.log(err))
      }
      else {
        // if user doesn't give permission to use location give alert and close application
        Alert.alert(
          'You must give acces to your location',
          "can't get your location, go to settings and turn on permission for location",
          [
            {text: 'OK', onPress: () => BackAndroid.exitApp()},
          ],
          {cancelable: false},
        );
      }
    }
    )
    .catch(err => console.log(err))
  }
  openCallout(hazard) {
    // open callout onClick hazardmarker
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
    // get Geolocation when component mounts
    await this.getGeoLocation();
  }
  render() {
    // get variable from state using destructuring
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
              // initializer source variable
              let source;
              // use switch to give marker correct image source
              // little messy but require doesn't support dynamic strings
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
