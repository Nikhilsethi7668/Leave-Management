import React, { useEffect } from 'react';
import { useAuthStore } from '../utils/stores/useAuthStore';
import { useDepartmentStore } from '../utils/stores/useDepartmentStore';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';

export default function Login() {
  const {
    user,
    loaded,
    name,
    email,
    type,
    password,
    confirm,
    post,
    departmentId,
    err,
    fieldErrors,
    isSubmitting,
    setState,
    toggleType,
    submit,
  } = useAuthStore();
  const { departments, load: loadDepartments } = useDepartmentStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (loaded && user) {
      navigate('/');
    }
  }, [loaded, user, navigate]);

  useEffect(() => {
    if (type === 'signup' && (!departments || departments.length === 0)) {
      loadDepartments().catch((e) =>
        console.error('Failed to load departments', e)
      );
    }
  }, [type, departments, loadDepartments]);

  const handleSubmit = (e) => {
    e.preventDefault();
    submit(navigate);
  };

  return (
    <div className="relative min-h-screen lg:h-[screen] lg:w-[100vw] flex items-center justify-center bg-gradient-to-b from-[#9253c2] to-[#8911e5]">
      <div className="absolute top-6 left-6 flex items-center gap-2 ">
        <img src={logo} alt="Logo" className="h-10 w-auto drop-shadow-md" />
        <span className="absolute top-[7vh] left-[1vw] text-white  font-semibold text-lg">
          Leave Manager
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 max-h-[80vh] object-cover rounded-2xl shadow-xl w-full max-w-md overflow-auto"
      >
        <h2 className="text-2xl font-semibold text-[#5E218A] mb-5 text-center">
          {type === 'login' ? 'Sign in' : 'Create account'}
        </h2>

        {err && <div className="text-red-600 mb-3 text-center">{err}</div>}

        {type === 'signup' && (
          <>
            <label className="block mb-2 text-sm font-medium">Name</label>
            <input
              type="text"
              className="mb-3 p-2 border rounded w-full"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setState({ name: e.target.value })}
            />
            {fieldErrors.name && (
              <div className="text-red-600 mb-2 text-sm">{fieldErrors.name}</div>
            )}
          </>
        )}

        <label className="block mb-2 text-sm font-medium">Email</label>
        <input
          type="email"
          className="mb-3 p-2 border rounded w-full"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setState({ email: e.target.value })}
        />
        {fieldErrors.email && (
          <div className="text-red-600 mb-2 text-sm">{fieldErrors.email}</div>
        )}

        <label className="block mb-2 text-sm font-medium">Password</label>
        <input
          type="password"
          className="mb-3 p-2 border rounded w-full"
          placeholder="Password"
          value={password}
          onChange={(e) => setState({ password: e.target.value })}
        />
        {fieldErrors.password && (
          <div className="text-red-600 mb-2 text-sm">{
            fieldErrors.password
          }</div>
        )}

        {type === 'signup' && (
          <>
            <label className="block mb-2 text-sm font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              className="mb-3 p-2 border rounded w-full"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setState({ confirm: e.target.value })}
            />
            {fieldErrors.confirm && (
              <div className="text-red-600 mb-2 text-sm">{
                fieldErrors.confirm
              }</div>
            )}

            <label className="block mb-2 text-sm font-medium">Job category</label>
            <select
              className="mb-3 p-2 border rounded w-full"
              value={departmentId}
              onChange={(e) => setState({ departmentId: e.target.value })}
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
              <div className="text-red-600 mb-2 text-sm">{
                fieldErrors.departmentId
              }</div>
            )}

            <label className="block mb-2 text-sm font-medium">Job role</label>
            <input
              type="text"
              className="mb-3 p-2 border rounded w-full"
              placeholder="e.g. Frontend Engineer"
              value={post}
              onChange={(e) => setState({ post: e.target.value })}
            />
            {fieldErrors.post && (
              <div className="text-red-600 mb-2 text-sm">{fieldErrors.post}</div>
            )}
          </>
        )}

        <button
          type="submit"
          className="bg-[#5E218A] text-white px-4 py-2 rounded w-full disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? type === 'login'
              ? 'Signing in...'
              : 'Creating account...'
            : type === 'login'
            ? 'Login'
            : 'Sign Up'}
        </button>

        <div className="mt-4 text-center text-sm">
          {type === 'login' ? (
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
