import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export async function testFirebase() {
  try {
    const querySnapshot = await getDocs(collection(db, "test"));
    console.log("✅ Firebase connected! Documents:", querySnapshot.docs.length);
  } catch (error) {
    console.error("❌ Firebase connection error:", error);
  }
}
