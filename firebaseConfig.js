import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBnLBkwqG3O0H-quoj_m88WHP9IP9aFzSY",
  authDomain: "book-5a8a5.firebaseapp.com",
  projectId: "book-5a8a5",
  storageBucket: "book-5a8a5.appspot.com",
  messagingSenderId: "556540786605",
  appId: "1:556540786605:web:add652aad81f9cf21bd324",
  measurementId: "G-1GYC5B97P3"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);