import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {BASE_URL} from "../constant.js"
import axiosInstance from "../helper/axiosInstance.js"

const initialState = {
    user: '',
    accessToken: null,
    refreshToken: null,
    status: 'idle', // Options: 'idle', 'loading', 'succeeded', 'failed'
    error: null,
};

// ** User Registration Thunk **
export const createAccount = createAsyncThunk("user/signup",async (formData)=>{
    try {
        const response = await axiosInstance.post("/auth/signup", formData)
        return response.data; // Response includes user data
    } catch (error) {
        return rejectWithValue(error.response.data || 'Signup failed');
    }
});

export const refreshAccessToken = createAsyncThunk("refreshAccessToken", async () => {
  const response = await axiosInstance.post("/auth/refresh-token");
  localStorage.setItem("accessToken", response.data.accessToken);  // Store the new token
  return response.data;
});

export const loginUser = createAsyncThunk(
    "user/login",
    async (credentials, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post("/auth/login", credentials, { withCredentials: true });
        
        // Ensure the response object and data are present before accessing
        if (response && response.data) {
          //console.log("Login API Response:", response.data);
          return response.data; // Return user data if response is valid
        } else {
          // In case response or response.data is undefined
          return rejectWithValue("Login failed: No response data");
        }
      } catch (error) {
        // Improved error handling: Check for error response or provide fallback
        console.error("Login error:", error);
        if (error.response) {
          return rejectWithValue(error.response.data || "Login failed");
        } else {
          return rejectWithValue("Login failed: Network error or server is down");
        }
      }
    }
  );
  

  export const logoutUser = createAsyncThunk("user/logout", async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
      localStorage.removeItem("accessToken");  // Clear token from localStorage
      localStorage.removeItem("refreshToken");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Logout failed");
    }
  });
  

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // User Login Thunk
        setUser: (state, action) => {
            state.user = action.payload;
            state.status ='succeeded';
        },
        clearUser: (state) => {
            state.user = '';
            state.status = 'idle';
        },

    },
    extraReducers: (builder) => {
        builder
            // User Registration Thunk
            .addCase(createAccount.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createAccount.fulfilled, (state, action) => {
                const { user, accessToken, refreshToken } = action.payload || {};
                state.status = "succeeded";
                state.user = user || null;
                state.accessToken = accessToken || null;
                state.refreshToken = refreshToken || null;
            })
            
            .addCase(createAccount.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                const { loginUser, accessToken, refreshToken } = action.payload || {}; // Destructure the API response
              
                if (!loginUser) {
                  console.warn("User data is missing in the response");
                }
              
                state.status = 'succeeded';
                state.user = loginUser || ''; // Assign loginUser as user data
                state.accessToken = accessToken || null;
                state.refreshToken = refreshToken || null;
              })
              
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Login failed'; // Set error
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.status = 'idle';
                state.user = '';
                state.accessToken = null;
                state.refreshToken = null;
            })
            .addCase(refreshAccessToken.pending, (state) => {
              state.status = 'loading';
          })
          .addCase(refreshAccessToken.fulfilled, (state, action) => {
              state.status = 'succeeded';
              state.accessToken = action.payload.accessToken;
          })
          .addCase(refreshAccessToken.rejected, (state, action) => {
              state.status = 'failed';
              state.error = action.payload;
          });
          
        },
});


export const { setUser, clearUser } = authSlice.actions;
export const selectUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAccessToken = (state) => state.auth.accessToken;

export default authSlice.reducer;

