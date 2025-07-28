"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { setUser } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      const res = await login(email, password);

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      setUser(res.user);

      router.replace("/dashboard");
    } catch (err) {
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 bg-white shadow p-6 rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-1">PETROS</h2>
      <p className="text-sm text-center text-gray-500 mb-6">
        Please sign in to continue
      </p>

      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 mb-4 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className="relative">
        <input
          type={secure ? "password" : "text"}
          placeholder="Password"
          className="w-full p-3 pr-10 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          className="absolute right-3 top-3 text-sm text-gray-500"
          onClick={() => setSecure(!secure)}
        >
          {secure ? "Show" : "Hide"}
        </button>
      </div>

      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Signing in..." : "Login"}
      </button>
    </div>
  );
}
