import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export async function saveAnalysisHistory(uid, data) {
  if (!uid) throw new Error("User not authenticated");

  const ref = collection(db, "users", uid, "history");

  await addDoc(ref, {
    ...data,
    created_at: serverTimestamp(),
  });
}
