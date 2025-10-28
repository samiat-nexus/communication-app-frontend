// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/profile";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", avatar: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        setUser(data.user);
        setForm({ name: data.user.name || "", avatar: data.user.avatar || "" });
      } catch (err) {
        setError("Failed to load profile.");
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateProfile(form);
      setUser(updated.user);
      setMessage("✅ Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setError("❌ Failed to update profile.");
    }
  };

  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!user) return <div className="text-center">⏳ Loading profile...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-lg shadow-lg bg-white text-center">
      <h1 className="text-2xl font-bold mb-4">👤 My Profile</h1>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block font-semibold">Name:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Avatar URL:</label>
          <input
            type="text"
            name="avatar"
            value={form.avatar}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            placeholder="Enter image URL"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Changes
        </button>
      </form>

      {message && <p className="text-green-600 mt-3">{message}</p>}

      <div className="mt-6">
        <h2 className="font-semibold">Current Info:</h2>
        <p><strong>Email:</strong> {user.email}</p>
        {user.avatar && (
          <img
            src={user.avatar}
            alt="Avatar"
            className="mx-auto mt-4 rounded-full w-24 h-24 object-cover"
          />
        )}
      </div>
    </div>
  );
}
