import React, { useState } from "react";
import { Label } from "./ui/Label";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../actions/userAction.js";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [state, setState] = useState({ success: false, error: null });
  const [isPending, setIsPending] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const response = await login(formData);
      if (response.success) {
        setState({ success: true, error: null });
        setTimeout(() => {
          navigate("/"); // Redirect to dashboard after login
        }, 2000);
      } else {
        setState({ success: false, error: response.error });
      }
    } catch (error) {
      setState({ success: false, error: "Login failed!" });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center transform -translate-y-16">
      <h1 className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 font-bold text-4xl text-center mb-4 text-transparent bg-clip-text">
        Todo App
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-xl w-full px-8">
        <div className="flex flex-col gap-2">
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Logging in..." : "Login"}
        </Button>
        {state.error && <p className="text-red-500">{state.error}</p>}
        <span className="text-[#63657b] text-center">
          Don't have an account?{" "}
          <Link to="/register" className="icon-hover text-primary hover:text-primary-dark hover:underline transition-colors duration-300">
            Register
          </Link>
        </span>
      </form>
    </div>
  );
}

export default Login;