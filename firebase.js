import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyChG3SNWQz4FTQLf-lHYoZZxWRMGGutlt0",
  databaseURL:
    "https://e-health-4d5ad-default-rtdb.europe-west1.firebasedatabase.app/",
  authDomain: "e-health-4d5ad.firebaseapp.com",
  projectId: "e-health-4d5ad",
  storageBucket: "e-health-4d5ad.appspot.com",
  messagingSenderId: "525514538551",
  appId: "1:525514538551:web:40f172dab540ea6da389b2",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth };
