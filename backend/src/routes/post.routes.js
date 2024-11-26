import Router from "express"
import {verifyJWT} from "../middleware/auth.middleware.js"
import { createPost, getAllPosts, getMyPost, updatePost, deletePost} from "../controllers/post.controller.js"

const router = Router();
router.use(verifyJWT);

// Define routes for your API endpoints here

router.route("/post").post(createPost);
// router.route("/post/:postId").get(getPostById);
router.route("/posts").get(getAllPosts);
router.route("/post/:userId").get(getMyPost);
router.route("/post/update-post/:postId").patch(updatePost);
router.route("/post/delete-post/:postId").delete(deletePost);


export default router;

