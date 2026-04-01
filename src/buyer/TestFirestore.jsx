// src/buyer/TestFirestore.jsx
import React from "react";
import { db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function TestFirestore() {
  const testSave = async () => {
    try {
      await setDoc(doc(db, "debug", "testDoc"), {
        message: "Firestore write success",
        time: serverTimestamp(),
      });
      alert("Saved successfully");
      console.log("Saved successfully");
    } catch (error) {
      console.error("Firestore save failed:", error);
      alert(error.code || error.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={testSave}>Test Firestore Save</button>
    </div>
  );
}