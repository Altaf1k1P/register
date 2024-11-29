import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../helper/axiosInstance.js";

// Thunks

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/posts");
     // console.log("API response:", response.data.message);
      return response.data.message || response.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch posts");
    }
  }
);

export const addPost = createAsyncThunk(
  "posts/addPost",
  async (postData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/post", postData);
      console.log("API response:", response.data.message);
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to add post");
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/post/delete-post/${postId}`);
      return postId; // Returning postId for state update
    } catch (error) {
      return rejectWithValue("Failed to delete post");
    }
  }
);


export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ postId, title, content }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/post/update-post/${postId}`, {
        title,
        content,
      });
      return response.data; // Returning the updated post
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update post");
    }
  }
);

export const myPost = createAsyncThunk(
  "post/myPost",
  async (userId, { rejectWithValue }) => {
      try {
          console.log("Fetching posts for user ID:", userId);
          const response = await axiosInstance.get(`/post/${userId}`);
          console.log("API Response:", response);
          return response.data.message || [];
      } catch (error) {
          //console.error("Error fetching posts:", error);
          return rejectWithValue(
              error.response?.data?.message || "Failed to fetch posts"
          );
      }
  }
);

// Slice

const postsSlice = createSlice({
  name: "posts",
  initialState: { posts: [], loading: false, error: null, post: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Posts
      .addCase(fetchPosts.fulfilled, (state, { payload }) => {
        //console.log("Payload received:", payload);
        state.posts = payload.message || payload; // Adjust for API response
        state.loading = false;
      })

      // Add Post
      .addCase(addPost.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.posts.push(payload);
      })

      // Delete Post
      .addCase(deletePost.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.posts = state.posts.filter((post) => post._id !== payload); // Assuming posts have `_id` as unique identifiers
      })

      // Update Post
      .addCase(updatePost.fulfilled, (state, { payload }) => {
        state.loading = false;
        const index = state.posts.findIndex((post) => post._id === payload._id);
        if (index !== -1) {
          state.posts[index] = payload; // Update the post with the new data
        }
      })

      .addCase(myPost.fulfilled, (state, {payload}) => {
        console.log("Payload received:", payload);
        state.loading = false;
        state.posts = payload.message || payload; // Assuming API returns the user's posts
    })

      // Handle Pending State
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      // Handle Rejected State
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, { payload }) => {
          state.loading = false;
          state.error = payload || "An error occurred";
        }
      );
  },
});

export default postsSlice.reducer;
