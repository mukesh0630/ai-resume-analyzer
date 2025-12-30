import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export async function saveUserProfile(user, extra = {}) {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);

  await setDoc(
    userRef,
    {
      name: user.displayName || extra.name || "New User",
      email: user.email,
      provider: user.providerData[0]?.providerId || "password",
      createdAt: serverTimestamp(),
      avgATS: 0,
      level: "Beginner",
    },
    { merge: true }
  );
}
