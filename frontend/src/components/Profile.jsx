import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) setProfile(snap.data());
    }

    loadProfile();
  }, []);

  if (!profile) return null;

  return (
    <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
      <h2 className="text-3xl font-bold mb-4">Profile</h2>

      <p className="text-gray-300">Name: {profile.name}</p>
      <p className="text-gray-300">Email: {profile.email}</p>
      <p className="text-gray-300">Provider: {profile.provider}</p>

      <div className="mt-6">
        <p className="text-gray-400">User Level</p>
        <h3 className="text-2xl font-semibold text-purple-400">
          {profile.level}
        </h3>
      </div>
    </div>
  );
}
