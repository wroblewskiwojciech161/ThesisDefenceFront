
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs,doc, setDoc, deleteDoc } from "firebase/firestore";



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