const password = require('./passwords').mongoPassword;

module.exports = {
  mongoURI: `mongodb+srv://brendero:${password}>@bap-0ucny.mongodb.net/test?retryWrites=true&w=majority`,
  secretOrKey: 'secret'
}