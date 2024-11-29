import Router from "express"
import {verifyJWT} from "../middleware/auth.middleware.js"
import { createPost, getAllPosts, getMyPost, updatePost, deletePost} from "../controllers/post.controller.js"

const router = Router();


// Define routes for your API endpoints here

router.route("/post").post(verifyJWT,createPost);
// router.route("/post/:postId").get(getPostById);
router.route("/posts").get(verifyJWT,getAllPosts);
router.route("/post/:userId").get(verifyJWT,getMyPost);
router.route("/post/update-post/:postId").patch(verifyJWT,updatePost);
router.route("/post/delete-post/:postId").delete(verifyJWT,deletePost);


export default router;

