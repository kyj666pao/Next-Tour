import { Router } from "express";
import { isLoggedIn } from "../middleware/middleware.js"
const router = Router()

import { Post } from "../models/post.js"

// GET "/posts" postsCtrl.index
router.get("/", (req,res) => {
    // res.send("this is /post page")
    Post.find()
      .then(posts => {
        res.render("posts/index", {
            posts,
            title: "All Post"
        })
      })
      .catch(err => {
        console.log(err)
        res.redirect("/")
      })
})

// GET "/posts/new" postsCtrl.new
router.get("/new", isLoggedIn, (req,res) => {
    res.render("posts/new", {
        title: "Add Post"
    })
})

// POST "/posts" postsCtrl.create
router.post("/", isLoggedIn, (req,res) => {
  req.body.author = req.user.profile._id;
  // req.body.date = new Date()
  console.log(req.body)
  Post.create(req.body)
    .then(posts => {
      res.redirect("/posts")
    })
    .catch(err => {
      console.log(err)
      res.redirect("/")
    })
})

// GET "/posts/:postId" postsCtrl.show 
router.get("/:postId", (req,res) => {
  let { postId } = req.params
  Post.findById(postId)
  .populate({path: "author"})
    .then(posts => {
      res.render("posts/show", {
        posts,
        title: "The Tour"
      })
    })
    .catch(err => {
      console.log(err)
      res.redirect("/")
    })
})

// GET "/posts/:postId/edit"
router.get("/:postId/edit", isLoggedIn, (req,res) => {
  let { postId } = req.params
  Post.findById(postId)
    .then(posts => {
      res.render("posts/edit", {
        posts,
        title: "Edit Post"
      })
    })
    .catch(err => {
      console.log(err)
      res.redirect("/")
    })
})


export { router }