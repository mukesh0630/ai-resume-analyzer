export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Welcome Back
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none"
        />

        <button className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-xl font-semibold transition">
          Login
        </button>

        <p className="text-sm text-gray-400 mt-4 text-center">
          Don’t have an account? <span className="text-blue-400 cursor-pointer">Sign up</span>
        </p>
      </div>
    </div>
  );
}
