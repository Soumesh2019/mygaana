require("dotenv").config();
const firebase = require("firebase");

var firebaseConfig = {
  apiKey: process.env.API_KEY_FIREBASE,
  authDomain: "mygaanaapp-50122.firebaseapp.com",
  databaseURL: "https://mygaanaapp-50122-default-rtdb.firebaseio.com",
  projectId: "mygaanaapp-50122",
  storageBucket: "mygaanaapp-50122.appspot.com",
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};
firebase.initializeApp(firebaseConfig);

module.exports = {
  firebase,
};
