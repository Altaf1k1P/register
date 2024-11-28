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
        if (response?.data?.message && Array.isArray(response.data.message)) {
          return response.data.message.map(post => ({
            id: post._id,
            title: post.title,
            content: post.content,
            createdAt: post.createdAt,
            owner: post.owner ? {
              id: post.owner._id,
              username: post.owner.username,
              email: post.owner.email,
            } : null,
          }));
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        return rejectWithValue(handleError(error));
      }
    }
  );
  

export const deletePost = createAsyncThunk(
    "post/deletePost",
    async (postId, { rejectWithValue }) => {
      try {
         await axiosInstance.delete(`/post/delete-post/${postId}`);
        return postId; // Return only the postId to delete it from the state
      } catch (error) {
        //console.error(error);
        return rejectWithValue(handleError(error));
      }
    }
  );
  
// Assuming you are using Redux Toolkit with createAsyncThunk

// Example of a thunk with error handling
export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ postId, title, content }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/post/update-post/${postId}`, { title, content });
      return response.data; // assuming the response is structured with data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


  
  


export const myPost = createAsyncThunk(
    "post/myPost",
    async (userId, { rejectWithValue }) => {
        try {
            //console.log("Fetching posts for user ID:", userId);
            const response = await axiosInstance.get(`/post/${userId}`);
            //console.log("API Response:", response);
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
                state.posts = action.payload || []; // Default to empty array if payload is null or undefined
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
            
              // Use _id for comparison instead of id
              const index = state.posts.findIndex((post) => post._id === action.meta.arg.postId);
              if (index !== -1) {
                state.posts[index] = { ...state.posts[index], ...action.payload };
              } else {
                console.warn(`Post with ID ${action.meta.arg.postId} not found.`);
              }
            })
            .addCase(updatePost.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload || 'An error occurred while updating the post.';
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
