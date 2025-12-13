import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../Components/Input/index.jsx";
import api from "../../Services/api";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    walletAddress: "",
    idNumber: "",
    role: "farmer",
  });

  const [idCardFile, setIdCardFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setIdCardFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (idCardFile) {
      data.append("idCardImage", idCardFile);
    }

    try {
      console.log("Registered:", Object.fromEntries(data));
      alert("Registration successful! Admin will verify your ID.");
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A2E] text-white p-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl border border-[#00FF88] shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#00FF88]">
          Farmer Sign Up
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="fullName"
            label="Full Name"
            placeholder="Enter your name"
            value={formData.fullName}
            onChange={handleChange}
          />

          <Input
            id="email"
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
          />

          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
          />

          <Input
            id="walletAddress"
            label="Wallet Address (Web3)"
            placeholder="0x..."
            value={formData.walletAddress}
            onChange={handleChange}
          />

          <Input
            id="idNumber"
            label="National ID / NIN Number"
            placeholder="Enter ID Number"
            value={formData.idNumber}
            onChange={handleChange}
          />

          <div className="w-full">
            <label className="block text-sm font-medium text-neutral mb-1">
              Upload ID Card
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#00FF88] file:text-black hover:file:bg-green-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#007BFF] hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-all mt-4"
          >
            Create Account
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-[#00FF88]">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
