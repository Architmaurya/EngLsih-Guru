import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getStoredAuth } from '../services/auth/authService';

const initialState = {
  status: 'idle', // 'loading' | 'ready'
  isLoggedIn: false,
  hasCompletedOnboarding: false,
  user: null,
};

export const hydrateAuth = createAsyncThunk('auth/hydrateAuth', async () => {
  const { user, token } = await getStoredAuth();
  if (user && token) {
    return {
      isLoggedIn: true,
      hasCompletedOnboarding: !!user.isOnboardingComplete,
      user,
    };
  }
  return {
    isLoggedIn: false,
    hasCompletedOnboarding: false,
    user: null,
  };
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSucceeded(state, action) {
      const { user } = action.payload || {};
      state.isLoggedIn = true;
      state.hasCompletedOnboarding = !!user?.isOnboardingComplete;
      state.user = user || null;
      state.status = 'ready';
    },
    logoutSucceeded(state) {
      state.isLoggedIn = false;
      state.hasCompletedOnboarding = false;
      state.user = null;
      state.status = 'ready';
    },
    markOnboardingComplete(state, action) {
      state.hasCompletedOnboarding = true;
      const updates = action.payload;
      if (state.user && updates) {
        state.user = { ...state.user, ...updates, isOnboardingComplete: true };
      } else if (state.user) {
        state.user = { ...state.user, isOnboardingComplete: true };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hydrateAuth.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(hydrateAuth.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
        state.hasCompletedOnboarding = action.payload.hasCompletedOnboarding;
        state.user = action.payload.user;
        state.status = 'ready';
      })
      .addCase(hydrateAuth.rejected, (state) => {
        state.status = 'ready';
      });
  },
});

export const { loginSucceeded, logoutSucceeded, markOnboardingComplete } = authSlice.actions;

export default authSlice.reducer;

