import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyBIUtN5vudbgGv-ETuk05aK_o3PpoQZ43A",
  authDomain: "project-b2e3d.firebaseapp.com",
  projectId: "project-b2e3d",
  storageBucket: "project-b2e3d.appspot.com",
  messagingSenderId: "130432773360",
  appId: "1:130432773360:web:b094d8ceef37e99efaa635",
  measurementId: "G-60BDCZ5KG4"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

