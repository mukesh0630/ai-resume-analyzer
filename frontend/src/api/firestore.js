import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export async function saveAnalysisHistory(uid, data) {
  if (!uid) return;

  await addDoc(
    collection(db, "users", uid, "history"),
    {
      ...data,
      created_at: serverTimestamp(),
    }
);
}