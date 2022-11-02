
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs,doc, setDoc, deleteDoc } from "firebase/firestore";



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBo3EteqTrLhuFXvwbZcTAI-EXYpqr9b3I",
  authDomain: "medpomarania.firebaseapp.com",
  projectId: "medpomarania",
  storageBucket: "medpomarania.appspot.com",
  messagingSenderId: "830598243443",
  appId: "1:830598243443:web:e21156107398be5fd9f606"
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
  console.log(payload)
    const uuid =  makeid(35)
    payload.uuid = uuid
    await setDoc(doc(db, "tasks",uuid), payload);
}

export async function remove(uuid){
  await deleteDoc(doc(db, "tasks", uuid));
}

export async function edit(payload){
  await setDoc(doc(db, "tasks",payload.uuid), payload);
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