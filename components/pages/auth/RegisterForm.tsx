"use client";
import { useState } from "react";
import { register } from "@/services/authService";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyId, setCompanyId] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password || !companyId) {
      alert("All fields are required");
      return;
    }

    try {
      await register(name, email, password, companyId);
      alert("Account created. Please login.");
      router.push("/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 bg-white shadow p-6 rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>

      <input
        type="text"
        placeholder="Name"
        className="w-full p-3 mb-4 border rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 mb-4 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 mb-4 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="text"
        placeholder="Company ID"
        className="w-full p-3 mb-4 border rounded"
        value={companyId}
        onChange={(e) => setCompanyId(e.target.value)}
      />

      <button
        onClick={handleRegister}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Register
      </button>

      <p
        onClick={() => router.push("/login")}
        className="mt-4 text-center text-sm text-blue-600 cursor-pointer"
      >
        Already have an account? Login
      </p>
    </div>
  );
}
