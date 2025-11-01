// src/pages/Login.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import * as yup from "yup";
import { useAuthStore } from "../utils/stores/useAuthStore";
import { useDepartmentStore } from "../utils/stores/useDepartmentStore";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";

export default function Login() {
    const login = useAuthStore((s) => s.login);
    const signup = useAuthStore((s) => s.signup);
    const loaded = useAuthStore((s) => s.loaded);
    const user = useAuthStore((s) => s.user);
    const departments = useDepartmentStore((s) => s.departments);
    const loadDepartments = useDepartmentStore((s) => s.load);
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [type, setType] = useState("login");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [post, setPost] = useState("");
    const [departmentId, setDepartmentId] = useState("");
    const [err, setErr] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (loaded && user) {
            navigate("/");
        }
    }, [loaded, user, navigate]);

    useEffect(() => {
        if (type === "signup" && (!departments || departments.length === 0)) {
            loadDepartments().catch((e) => console.error("Failed to load departments", e));
        }
    }, [type]);

    const toggleType = () => {
        setErr("");
        setFieldErrors({});
        setPassword("");
        setConfirm("");
        setPost("");
        setDepartmentId("");
        setName("");
        setType((t) => (t === "login" ? "signup" : "login"));
    };

    const loginSchema = yup.object().shape({
        email: yup.string().email("Invalid email").required("Email is required"),
        password: yup.string().required("Password is required"),
    });

    const signupSchema = yup.object().shape({
        name: yup.string().trim().min(2, "Name is too short").required("Name is required"),
        email: yup.string().email("Invalid email").required("Email is required"),
        password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
        confirm: yup.string().oneOf([yup.ref("password"), null], "Passwords must match").required("Confirm password is required"),
        post: yup.string().trim().required("Job role is required"),
        departmentId: yup.string().required("Please select a job category"),
    });

    const submit = async (e) => {
        e.preventDefault();
        setErr("");
        setFieldErrors({});

        try {
            if (type === "login") {
                await loginSchema.validate({ email, password }, { abortEarly: false });
                setIsSubmitting(true);
                await login({ email, password });
                alert("Logged in successful");
                navigate("/");
            } else {
                await signupSchema.validate({ name, email, password, confirm, post, departmentId }, { abortEarly: false });
                setIsSubmitting(true);
                const response = await signup({ name, email, password, post, departmentId });
                if (response && response.success) {
                    alert("Signup Application sent to Admin for approval");
                    navigate("/");
                } else {
                    alert("Unable to sign up at this moment");
                }
            }
        } catch (validationError) {
            if (validationError.name === "ValidationError" && validationError.inner) {
                const out = {};
                validationError.inner.forEach((ve) => {
                    if (ve.path) out[ve.path] = ve.message;
                });
                setFieldErrors(out);
            } else {
                setErr(validationError?.response?.data?.message || validationError?.message || "Operation failed");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative min-h-screen lg:h-[screen] lg:w-[100vw] flex items-center justify-center bg-gradient-to-b from-[#9253c2] to-[#8911e5]">
            <div className="absolute top-6 left-6 flex items-center gap-2 ">
                <img src={logo} alt="Logo" className="h-10 w-auto drop-shadow-md" />
                <span className="absolute top-[7vh] left-[1vw] text-white  font-semibold text-lg">Leave Manager</span>
            </div>

            {/* Centered form */}
            <form
                onSubmit={submit}
                className="bg-white p-8 max-h-[80vh] object-cover rounded-2xl shadow-xl w-full max-w-md overflow-auto"
            >
                <h2 className="text-2xl font-semibold text-[#5E218A] mb-5 text-center">
                    {type === "login" ? "Sign in" : "Create account"}
                </h2>

                {err && <div className="text-red-600 mb-3 text-center">{err}</div>}

                {type === "signup" && (
                    <>
                        <label className="block mb-2 text-sm font-medium">Name</label>
                        <input
                            type="text"
                            className="mb-3 p-2 border rounded w-full"
                            placeholder="Your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {fieldErrors.name && <div className="text-red-600 mb-2 text-sm">{fieldErrors.name}</div>}
                    </>
                )}

                <label className="block mb-2 text-sm font-medium">Email</label>
                <input
                    type="email"
                    className="mb-3 p-2 border rounded w-full"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {fieldErrors.email && <div className="text-red-600 mb-2 text-sm">{fieldErrors.email}</div>}

                <label className="block mb-2 text-sm font-medium">Password</label>
                <input
                    type="password"
                    className="mb-3 p-2 border rounded w-full"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {fieldErrors.password && <div className="text-red-600 mb-2 text-sm">{fieldErrors.password}</div>}

                {type === "signup" && (
                    <>
                        <label className="block mb-2 text-sm font-medium">Confirm Password</label>
                        <input
                            type="password"
                            className="mb-3 p-2 border rounded w-full"
                            placeholder="Confirm password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                        />
                        {fieldErrors.confirm && <div className="text-red-600 mb-2 text-sm">{fieldErrors.confirm}</div>}

                        <label className="block mb-2 text-sm font-medium">Job category</label>
                        <select
                            className="mb-3 p-2 border rounded w-full"
                            value={departmentId}
                            onChange={(e) => setDepartmentId(e.target.value)}
                        >
                            <option value="">Select job category</option>
                            {departments &&
                                departments.map((d) => (
                                    <option key={d._id || d.id} value={d._id || d.id}>
                                        {d.name || d.title || d.label}
                                    </option>
                                ))}
                        </select>
                        {fieldErrors.departmentId && (
                            <div className="text-red-600 mb-2 text-sm">{fieldErrors.departmentId}</div>
                        )}

                        <label className="block mb-2 text-sm font-medium">Job role</label>
                        <input
                            type="text"
                            className="mb-3 p-2 border rounded w-full"
                            placeholder="e.g. Frontend Engineer"
                            value={post}
                            onChange={(e) => setPost(e.target.value)}
                        />
                        {fieldErrors.post && <div className="text-red-600 mb-2 text-sm">{fieldErrors.post}</div>}
                    </>
                )}

                <button
                    type="submit"
                    className="bg-[#5E218A] text-white px-4 py-2 rounded w-full disabled:opacity-60"
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? type === "login"
                            ? "Signing in..."
                            : "Creating account..."
                        : type === "login"
                            ? "Login"
                            : "Sign Up"}
                </button>

                <div className="mt-4 text-center text-sm">
                    {type === "login" ? (
                        <>
                            Don't have an account?{" "}
                            <button
                                type="button"
                                onClick={toggleType}
                                className="text-[#5E218A] underline"
                            >
                                Sign up
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <button
                                type="button"
                                onClick={toggleType}
                                className="text-[#5E218A] underline"
                            >
                                Sign in
                            </button>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
}
