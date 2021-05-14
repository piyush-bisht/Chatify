import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyCYfxvApGLIE16biL6QNmOy91I3OKPavuM",
  authDomain: "web-android-chatapp.firebaseapp.com",
  projectId: "web-android-chatapp",
  storageBucket: "web-android-chatapp.appspot.com",
  messagingSenderId: "541021420197",
  appId: "1:541021420197:web:71ce00b5147aa2b635ab4c",
  measurementId: "G-TSL83EX4SP",
  databaseURL: "https://web-android-chatapp-default-rtdb.firebaseio.com/",
  
};
firebase.initializeApp(firebaseConfig);
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

reportWebVitals();
