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
  .populate([
    {path: "author"},
    {path: "comments.author"}
  ])
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

// GET "/posts/:postId/edit" postsCtrl.edit
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

// PUT "/posts/:postsId" postsCtrl.update
router.put("/:postId", isLoggedIn, (req,res) => {
  let { postId } = req.params
  Post.findById(postId)
    .then( posts => {
      if (posts.author.equals(req.user.profile._id)) {
        posts.updateOne(req.body)
          .then(() => {
            res.redirect(`/posts/${postId}`)
          })
          .catch(err => {
            console.log(err)
            // res.redirect("/")
            res.send("Failed to updated the post")
          })
      } else {
        throw new Error("🚫 Not authorized 🚫")
      }
    })
    .catch(err => {
      console.log(err)
      // res.redirect("/")
      res.send("Post Id is not found")
    })
})

// DELETE "/posts/:postId"
router.delete("/:postId", isLoggedIn, (req,res) => {
  let { postId } = req.params
  Post.findById(postId)
    .then( posts => {
      if (posts.author.equals(req.user.profile._id)) {
        posts.deleteOne()
        .then(() => {
          res.redirect("/posts")
        })
        .catch(err => {
          console.log(err)
          // res.redirect("/")
          res.send("Failed to delete the post")
        })
      } else {
        throw new Error("🚫 Not authorized 🚫")
      }
    })
    .catch(err => {
      console.log(err)
      // res.redirect("/")
      res.send("Post Id is not found")
    })
})

// POST "/posts/:postID/comments"
router.post("/:postId/comments", isLoggedIn, (req,res) => {
  let { postId } = req.params
  Post.findById(postId)
    .then(posts => {
      req.body.author = req.user.profile._id
      posts.comments.push(req.body)
      posts.save()
        .then(() => {
          res.redirect(`/posts/${postId}`)
        })
        .catch(err => {
          console.log(err)
          res.send("Failed to add comment")
        })
    })
    .catch(err => {
      console.log(err)
      res.send("This post is not found")
    })
})

export { router }