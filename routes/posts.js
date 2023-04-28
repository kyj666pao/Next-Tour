import { Router } from "express";
import { isLoggedIn } from "../middleware/middleware.js";
const router = Router();

import * as postsCtrl from "../controllers/posts.js"

// GET "/posts" postsCtrl.index
router.get("/", postsCtrl.index);

// GET "/posts/new" postsCtrl.new
router.get("/new", isLoggedIn, postsCtrl.new);

// GET "/posts/:postId" postsCtrl.show
router.get("/:postId", postsCtrl.show);

// GET "/posts/:postId/edit" postsCtrl.edit
router.get("/:postId/edit", isLoggedIn, postsCtrl.edit);

// GET "/posts/:postId/comments/:commentId/edit" postsCtrl.editComment
router.get("/:postId/comments/:commentId/edit", isLoggedIn, postsCtrl.editComment);

// POST "/posts" postsCtrl.create
router.post("/", isLoggedIn, postsCtrl.create);

// POST "/posts/:postID/comments" postsCtrl.addComment
router.post("/:postId/comments", isLoggedIn, postsCtrl.addComment);

// POST "/posts/:postId/saved" postsCtrl.addToSaved
router.post("/:postId/saved", isLoggedIn, postsCtrl.addToSaved);

// PUT "/posts/:postsId" postsCtrl.update
router.put("/:postId", isLoggedIn, postsCtrl.update);

// PUT "/posts/:postId/comments/:commentId" postsCtrl.updateComment
router.put("/:postId/comments/:commentId", isLoggedIn, postsCtrl.updateComment);

// DELETE "/posts/:postId" postsCtrl.delete
router.delete("/:postId", isLoggedIn, postsCtrl.delete);

// DELETE "/:postsId/comments/:commentId" postsCtrl.deleteComment
router.delete("/:postId/comments/:commentId", isLoggedIn, postsCtrl.deleteComment);



export { router };
