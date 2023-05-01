import { Post } from "../models/post.js";
import { Profile } from "../models/profile.js";
import { Destination } from "../models/destination.js";

// GET "/posts" postsCtrl.index
const index = (req, res) => {
  Post.find()
    .then((posts) => {
      posts.sort((a, b) => {
        return b.date.toISOString().localeCompare(a.date.toISOString());
      });
      res.render("posts/index", {
        posts,
        title: "All Post",
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
};

// GET "/posts/new" postsCtrl.new
const newPost = (req, res) => {
  Destination.find()
    .then((destinations) => {
      res.render("posts/new", {
        title: "Add Post",
        destinations,
        state: [
          "Alabama",
          "Alaska",
          "American Samoa",
          "Arizona",
          "Arkansas",
          "California",
          "Colorado",
          "Connecticut",
          "Delaware",
          "District of Columbia",
          "Federated States of Micronesia",
          "Florida",
          "Georgia",
          "Guam",
          "Hawaii",
          "Idaho",
          "Illinois",
          "Indiana",
          "Iowa",
          "Kansas",
          "Kentucky",
          "Louisiana",
          "Maine",
          "Marshall Islands",
          "Maryland",
          "Massachusetts",
          "Michigan",
          "Minnesota",
          "Mississippi",
          "Missouri",
          "Montana",
          "Nebraska",
          "Nevada",
          "New Hampshire",
          "New Jersey",
          "New Mexico",
          "New York",
          "North Carolina",
          "North Dakota",
          "Northern Mariana Islands",
          "Ohio",
          "Oklahoma",
          "Oregon",
          "Palau",
          "Pennsylvania",
          "Puerto Rico",
          "Rhode Island",
          "South Carolina",
          "South Dakota",
          "Tennessee",
          "Texas",
          "Utah",
          "Vermont",
          "Virgin Island",
          "Virginia",
          "Washington",
          "West Virginia",
          "Wisconsin",
          "Wyoming",
        ],
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
};

// GET "/posts/:postId" postsCtrl.show
const show = (req, res) => {
  let { postId } = req.params;
  Post.findById(postId)
    .populate([{ path: "author" }, { path: "comments.author" }])
    .then((post) => {
      res.render("posts/show", {
        post,
        title: "The Tour",
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
};

// GET "/posts/:postId/edit" postsCtrl.edit
const edit = (req, res) => {
  let { postId } = req.params;
  Post.findById(postId)
    .then((post) => {
      res.render("posts/edit", {
        post,
        title: "Edit Post",
        state: [
          "Alabama",
          "Alaska",
          "American Samoa",
          "Arizona",
          "Arkansas",
          "California",
          "Colorado",
          "Connecticut",
          "Delaware",
          "District of Columbia",
          "Federated States of Micronesia",
          "Florida",
          "Georgia",
          "Guam",
          "Hawaii",
          "Idaho",
          "Illinois",
          "Indiana",
          "Iowa",
          "Kansas",
          "Kentucky",
          "Louisiana",
          "Maine",
          "Marshall Islands",
          "Maryland",
          "Massachusetts",
          "Michigan",
          "Minnesota",
          "Mississippi",
          "Missouri",
          "Montana",
          "Nebraska",
          "Nevada",
          "New Hampshire",
          "New Jersey",
          "New Mexico",
          "New York",
          "North Carolina",
          "North Dakota",
          "Northern Mariana Islands",
          "Ohio",
          "Oklahoma",
          "Oregon",
          "Palau",
          "Pennsylvania",
          "Puerto Rico",
          "Rhode Island",
          "South Carolina",
          "South Dakota",
          "Tennessee",
          "Texas",
          "Utah",
          "Vermont",
          "Virgin Island",
          "Virginia",
          "Washington",
          "West Virginia",
          "Wisconsin",
          "Wyoming",
        ],
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
};

// GET "/posts/:postId/comments/:commentId/edit" postsCtrl.editComment
const editComment = (req, res) => {
  let { postId, commentId } = req.params;
  Post.findById(postId)
    .then((post) => {
      const comment = post.comments.id(commentId);
      if (comment.author.equals(req.user.profile._id)) {
        res.render("posts/editComment", {
          post,
          comment,
          title: "Edit Comment",
        });
      } else {
        throw new Error("🚫 Not authorized 🚫");
      }
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
};

// POST "/posts" postsCtrl.create
const create = (req, res) => {
  let userId = req.user.profile._id;
  req.body.author = userId;
  if (req.body.destinationId) {
    Destination.findById(req.body.destinationId)
      .then((destination) => {
        req.body.location = destination.name;
        req.body.state = destination.state;
        Post.create(req.body)
          .then((post) => {
            destination.postOfThisDestination.push(post._id);
            destination
              .save()
              .then(() => {
                Profile.findById(userId)
                  .then((profiles) => {
                    profiles.myPost.push(post._id);
                    profiles
                      .save()
                      .then(() => {
                        res.redirect("/posts");
                      })
                  })
              })
          })
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/");
      });
  } else {
    Post.create(req.body)
      .then((post) => {
        req.body.name = req.body.location;
        Destination.create(req.body)
          .then((destination) => {
            destination.postOfThisDestination.push(post._id);
            destination
              .save()
              .then(() => {
                Profile.findById(userId)
                  .then((profiles) => {
                    profiles.myPost.push(post._id);
                    profiles
                      .save()
                      .then(() => {
                        res.redirect("/posts");
                      })
                  })
              })
          })
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/");
      });
  }
};

// POST "/posts/:postID/comments" postsCtrl.addComment
const addComment = (req, res) => {
  let { postId } = req.params;
  Post.findById(postId)
    .then((posts) => {
      req.body.author = req.user.profile._id;
      posts.comments.push(req.body);
      posts
        .save()
        .then(() => {
          res.redirect(`/posts/${postId}`);
        })
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
};

// PUT "/posts/:postsId" postsCtrl.update
const update = (req, res) => {
  let { postId } = req.params;
  Post.findById(postId)
    .then((posts) => {
      if (posts.author.equals(req.user.profile._id)) {
        posts
          .updateOne(req.body)
          .then(() => {
            res.redirect(`/posts/${postId}`);
          })
      } else {
        throw new Error("🚫 Not authorized 🚫");
      }
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
};

// PUT "/posts/:postId/comments/:commentId" postsCtrl.updateComment
const updateComment = (req, res) => {
  let { postId, commentId } = req.params;
  Post.findById(postId)
    .then((posts) => {
      const comment = posts.comments.id(commentId);
      if (comment.author.equals(req.user.profile._id)) {
        comment.set(req.body);
        posts
          .save()
          .then(() => {
            res.redirect(`/posts/${postId}`);
          })
      } else {
        throw new Error("🚫 Not authorized 🚫");
      }
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
};

// DELETE "/posts/:postId" postsCtrl.delete
const deletePost = (req, res) => {
  let { postId } = req.params;
  Post.findById(postId)
    .then((posts) => {
      if (posts.author.equals(req.user.profile._id)) {
        posts
          .deleteOne()
          .then(() => {
            res.redirect("/posts");
          })
      } else {
        throw new Error("🚫 Not authorized 🚫");
      }
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
};

// DELETE "/:postsId/comments/:commentId" postsCtrl.deleteComment
const deleteComment = (req, res) => {
  let { postId, commentId } = req.params;
  Post.findById(postId)
    .then((posts) => {
      const comment = posts.comments.id(commentId);
      if (comment.author.equals(req.user.profile._id)) {
        posts.comments.remove(comment);
        posts
          .save()
          .then(() => {
            res.redirect(`/posts/${postId}`);
          })
      } else {
        throw new Error("🚫 Not authorized 🚫");
      }
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
};

// POST "/posts/:postId/saved" postsCtrl.addToSaved
const addToSaved = (req, res) => {
  let { postId } = req.params;
  let userId = req.user.profile._id;
  Post.findById(postId)
    .then((posts) => {
      Profile.findById(userId)
        .then((profile) => {
          profile.savedPost.push(postId);
          profile
            .save()
            .then(() => {
              res.redirect(`/posts/${postId}`);
            })
            .catch((err) => {
              console.log(err);
              res.redirect("/");
            });
        })
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
};

export {
  index,
  newPost as new,
  create,
  show,
  edit,
  update,
  deletePost as delete,
  addComment,
  editComment,
  updateComment,
  deleteComment,
  addToSaved,
};
