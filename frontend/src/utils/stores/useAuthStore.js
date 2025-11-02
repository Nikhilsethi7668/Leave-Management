import { create } from 'zustand';
import api from '../axiosInstance';
import * as yup from 'yup';

export const useAuthStore = create((set, get) => ({
  user: null,
  loaded: false, // becomes true after me() attempt finishes
  error: null,
  isMe: false,

  // Form state
  name: '',
  email: '',
  type: 'login',
  password: '',
  confirm: '',
  post: '',
  departmentId: '',
  err: '',
  fieldErrors: {},
  isSubmitting: false,

  me: async () => {
    try {
      const { data } = await api.get('/users/me');
      set({ user: data.user, loaded: true, isMe: true });
      return data.user;
    } catch {
      set({ user: null, loaded: true, isMe: false });
      return null;
    }
  },

  login: async (payload) => {
    await api.post('/users/login', payload);
    const { data } = await api.get('/users/me');
    set({ user: data.user, loaded: true, isMe: true });
  },

  signup: async (payload) => {
    const response = await api.post('/users/signup', payload);
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/users/logout');
    } catch {
      alert('Error logging out, please try again.');
    } finally {
      set({ user: null, loaded: true, isMe: false });
    }
  },

  setState: (newState) => set(newState),

  toggleType: () => {
    set((state) => ({
      type: state.type === 'login' ? 'signup' : 'login',
      err: '',
      fieldErrors: {},
      password: '',
      confirm: '',
      post: '',
      departmentId: '',
      name: '',
    }));
  },

  submit: async (navigate) => {
    const { type, email, password, name, confirm, post, departmentId, login, signup } = get();
    set({ err: '', fieldErrors: {}, isSubmitting: true });

    const loginSchema = yup.object().shape({
      email: yup.string().email('Invalid email').required('Email is required'),
      password: yup.string().required('Password is required'),
    });

    const signupSchema = yup.object().shape({
      name: yup.string().trim().min(2, 'Name is too short').required('Name is required'),
      email: yup.string().email('Invalid email').required('Email is required'),
      password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      confirm: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm password is required'),
      post: yup.string().trim().required('Job role is required'),
      departmentId: yup.string().required('Please select a job category'),
    });

    try {
      if (type === 'login') {
        await loginSchema.validate({ email, password }, { abortEarly: false });
        await login({ email, password });
        alert('Logged in successful');
        navigate('/');
      } else {
        await signupSchema.validate({ name, email, password, confirm, post, departmentId }, { abortEarly: false });
        const response = await signup({ name, email, password, post, departmentId });
        if (response && response.success) {
          alert('Signup Application sent to Admin for approval');
          navigate('/');
        } else {
          alert('Unable to sign up at this moment');
        }
      }
    } catch (validationError) {
      if (validationError.name === 'ValidationError' && validationError.inner) {
        const out = {};
        validationError.inner.forEach((ve) => {
          if (ve.path) out[ve.path] = ve.message;
        });
        set({ fieldErrors: out });
      } else {
        set({ err: validationError?.response?.data?.message || validationError?.message || 'Operation failed' });
      }
    } finally {
      set({ isSubmitting: false });
    }
  },
}));
