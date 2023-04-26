import { Router } from "express";
import { isLoggedIn } from "../middleware/middleware.js"
const router = Router()

import { Post } from "../models/post.js"
import { Profile } from "../models/profile.js"

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
        title: "Add Post",
        state: ['Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming']
    })
})

// POST "/posts" postsCtrl.create
router.post("/", isLoggedIn, (req,res) => {
  let userId = req.user.profile._id;
  req.body.author = userId
  console.log(req.body)
  Post.create(req.body)
    .then(posts => {
      Profile.findById(userId)
        .then(profiles => {
          profiles.myPost.push(posts._id)
          console.log("profiles:", profiles)
          profiles.save()
            .then(()=>{
              res.redirect("/posts")
            })
            .catch(err => {
            console.log(err)
            res.send("post is not saved into profile.myPost")
            })
        })
        .catch(err => {
          console.log(err)
          res.send("userId is not found")
        })
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
      const isSelf = posts.author.equals(req.user.profile._id)
      console.log(posts)
      res.render("posts/show", {
        posts,
        title: "The Tour",
        isSelf,
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
        title: "Edit Post",
        state: ['Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming']
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
      console.log(req.body)
      posts.comments.push(req.body)
      console.log(posts)
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

// GET "/posts/:postId/comments/:commentId/edit"
router.get("/:postId/comments/:commentId/edit", isLoggedIn, (req,res)=> {
  let { postId, commentId} = req.params
  console.log("postId:" , postId)
  console.log("commentId", commentId)
  Post.findById(postId)
    .then(posts => {
      console.log(posts)
      const comment = posts.comments.id(commentId)
      console.log(comment)
      if (comment.author.equals(req.user.profile._id)) {
        res.render("posts/editComment", {
          posts,
          comment,
          title: "Edit Comment"
        })
      } else {
        throw new Error("🚫 Not authorized 🚫")
      }
    })
    .catch(err => {
      console.log(err)
      res.send("This post is not Found")
    })
})

// PUT "/posts/:postId/comments/:commentId"
router.put("/:postId/comments/:commentId", isLoggedIn, (req,res) => {
  let { postId, commentId } = req.params
  console.log("postId:" , postId)
  console.log("commentId", commentId)
  Post.findById(postId)
    .then(posts => {
      console.log(posts)
      const comment = posts.comments.id(commentId)
      console.log(comment)
      if (comment.author.equals(req.user.profile._id)) {
        comment.set(req.body)
        posts.save()
        .then(() => {
          res.redirect(`/posts/${postId}`)
        })
        .catch(err => {
          console.log(err)
          res.send("Failed to update comment")
        })
      } else {
        throw new Error("🚫 Not authorized 🚫")
      }
    })
    .catch(err => {
      console.log(err)
      res.send("This post is not Found")
    })
})

// DELETE "/:postsId/comments/:commentId"
router.delete("/:postId/comments/:commentId", isLoggedIn, (req,res) => {
  let { postId, commentId } = req.params
  Post.findById(postId)
    .then(posts => {
      const comment = posts.comments.id(commentId)
      console.log(comment)
      if (comment.author.equals(req.user.profile._id)) {
        posts.comments.remove(comment)
        posts.save()
          .then(() => {
            res.redirect(`/posts/${postId}`)
          })
          .catch(err => {
            res.send("Failed to delete this comment")
          })
      } else {
        throw new Error("🚫 Not authorized 🚫")
      }
    })
    .catch(err => {
      console.log(err)
      res.send("This post is not Found")
    })
})

export { router }