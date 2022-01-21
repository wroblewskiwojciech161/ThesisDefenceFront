
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs,doc, setDoc } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyBOwwk1uK7-9WQAEBehirh8g7awc08oGig",
  authDomain: "thesis-defence.firebaseapp.com",
  projectId: "thesis-defence",
  storageBucket: "thesis-defence.appspot.com",
  messagingSenderId: "342227402358",
  appId: "1:342227402358:web:1e1b2a9fb4bf334c8b6957"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

// Get a list of cities from your database
export async function getCities() {

  let data = []
  const querySnapshot = await getDocs(collection(db, "tasks"));
  querySnapshot.forEach((doc) => {
    data.push(doc.data())
  });
  return data;

}
export async function add(payload){
    // Add a new document in collection "cities"
    await setDoc(doc(db, "tasks", makeid(35)), payload);
}

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}