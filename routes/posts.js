import { Router } from "express";
import { isLoggedIn } from "../middleware/middleware.js"
const router = Router()

import { Post } from "../models/post.js"

// GET "/post"
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

// GET "/post/new"
router.get("/new", isLoggedIn, (req,res) => {
    res.render("posts/new", {
        title: "Add Post"
    })
})

// POST "/"
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

export { router }