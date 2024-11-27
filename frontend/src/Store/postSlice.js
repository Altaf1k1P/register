import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../helper/axiosInstance.js";

const initialState = {
    posts: [],
    error: null,
    loading: false,
    post: null, // renamed from "Post" to follow camelCase
};
const handleError = (error) => {
    if (error.response) {
        return error.response.data || "An error occurred";
    } else if (error.message) {
        return error.message;
    } else {
        return "Something went wrong";
    }
};
// Thunks
export const createPost = createAsyncThunk(
    "post/createPost",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/post", formData);
            return response.data;
        } catch (error) {
           // console.error(error);
            return rejectWithValue(handleError(error));
        }
    }
);

export const getAllPosts = createAsyncThunk(
    "post/getAllPosts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/posts");
            if (response && response.data) {
                console.log("get all post API Response:", response.data);
                return response.data; // Return user data if response is valid
              } else {
                // In case response or response.data is undefined
                return rejectWithValue("getallpost failed: No response data");
              }
        } catch (error) {
           // console.error(error);
            return rejectWithValue(handleError(error));
        }
    }
);

export const deletePost = createAsyncThunk(
    "post/deletePost",
    async (postId, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.delete(`/post/delete-post/${postId}`);
        return postId; // Return only the postId to delete it from the state
      } catch (error) {
        //console.error(error);
        return rejectWithValue(handleError(error));
      }
    }
  );
  

export const updatePost = createAsyncThunk(
    "post/updatePost",
    async ({ postId, data }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(`/post/update-post/${postId}`, data);
            return response.data;
        } catch (error) {
            //console.error(error);
            return rejectWithValue(handleError(error));
        }
    }
);

export const myPost = createAsyncThunk(
    "post/myPost",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/post/${userId}`);
            return response.data;
        } catch (error) {
            //console.error(error);
            return rejectWithValue(handleError(error));
        }
    }
);

// Slice
const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // createPost
            .addCase(createPost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = Array.isArray(state.posts) ? state.posts : [];
                // Avoiding duplicates by checking if the post already exists
                if (!state.posts.some(post => post.id === action.payload.id)) {
                    state.posts.push(action.payload);
                }
            })
            
            .addCase(createPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // getAllPosts
            .addCase(getAllPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload;
            })
            .addCase(getAllPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // deletePost
            .addCase(deletePost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // Slice
            .addCase(deletePost.fulfilled, (state, action) => {
                state.loading = false;
                // Assuming the response returns postId for the deleted post
                state.posts = state.posts.filter((post) => post.id !== action.payload); 
            })
            
  
            .addCase(deletePost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // updatePost
            .addCase(updatePost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                state.loading = false;
            
                if (!Array.isArray(state.posts)) {
                    console.warn("Posts state is not an array. Skipping update.");
                    return;
                }
            
                const index = state.posts.findIndex((post) => post.id === action.meta.arg.postId);
                if (index !== -1) {
                    state.posts[index] = { ...state.posts[index], ...action.payload };
                } else {
                    console.warn(`Post with ID ${action.meta.arg.postId} not found.`);
                }
            })
            
            .addCase(updatePost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // myPost
            .addCase(myPost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(myPost.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload; // Assuming API returns the user's posts
            })
            .addCase(myPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// export const selectMyPosts = (state) => state.post.posts;
// export const selectPostLoading = (state) => state.post.loading;
// export const selectPostError = (state) => state.post.error;


export default postSlice.reducer;
