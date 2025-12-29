export default function Profile() {
  return (
    <div className="bg-white/10 p-8 rounded-2xl border border-white/10">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>

      <p className="text-gray-300 mb-2">User: Demo User</p>
      <p className="text-gray-300 mb-4">Level: Intermediate</p>

      <button className="btn-primary">Logout</button>
    </div>
  );
}
