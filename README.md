# SafeLane
> Community driven react-native application made to improve the safety of cyclists

> Author: Brent De Roeck

This project was created as a bachelor thesis for Artevelde University College in Ghent. 

## Demo
This app was hosted on expo. you can try it on your android device by scanning the qr code below or you can [open it directly on expo](https://expo.io/@brendero/safelane)

![QR Code](./qr-code.png)

## installation
### client
```bash
# Clone the repository
git clone https://github.com/brendero/Bachelorproef.git
#Navigate inside the client repository
cd client/safebiker
#install the node_modules using yarn
yarn install
# run the application using yarn
yarn start
```
### Server
the server is hosted on heroku: [https://safelane.herokuapp.com](https://safelane.herokuapp.com)

*To get a hazard based on a location*
```
GET /api/hazards/search
```
this endpoint needs to have the following query parameters
> coordinates: this has to be an object with latitude and longitude values

example:
```json
coordinates: {
	"latitude": 37.40299,
	"longitude"; -122.08464
}
```

*To create a new hazard*
```
POST /api/hazards
```
this endpoint needs to be send the following parameters
> type: the type of hazard you want to declare 
> the only possible values are: 'tram', 'obstruction', 'busystreet', 'badbikepath', 'highcurb', 'intersection', 'badroad', 'other'

> location: This has to be a GeoJSON object with a type value of point. 

example:
```json
"type": "tram",
location: {
 	"type": "Point",
 	"longitude": -20.08662,
 	"latitude": 37.41861
 }
```
To run the server locally follow the steps below
```bash
# Clone the repository
git clone https://github.com/brendero/Bachelorproef.git
# Navigate inside the client repository
cd server
# Install the node_modules using npm
npm install
# Run the application using yarn
npm start
```

## License
Licensed under the MIT license

