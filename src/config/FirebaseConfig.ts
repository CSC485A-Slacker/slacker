// Optionally import the services that you want to use
//import {...} from "firebase/auth";
//import {...} from "firebase/database";
//import {...} from "firebase/firestore";
//import {...} from "firebase/functions";
//import {...} from "firebase/storage";
// https://firebase.google.com/docs/web/setup#available-libraries

import { initializeApp, getApps } from "firebase/app";
import {getAuth} from "firebase/auth"

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    // from Firebase Console
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};

const firebaseApp = initializeApp(firebaseConfig)

const auth = getAuth()
export { firebaseApp, auth }