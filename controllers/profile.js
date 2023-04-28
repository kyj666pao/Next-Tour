import { Profile } from "../models/profile.js";

//GET "/profile" profileCtrl.index
const index = (req, res) => {
  Profile.find()
    .then((profiles) => {
      // res.send("this is profile")
      res.render("profiles/index", {
        profiles,
        title: "Profile",
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
};

//GET "/profile/:profileId" profileCtrl.show
const show = (req, res) => {
  let { profileId } = req.params;
  Profile.findById(profileId)
    .populate([
      { path: "myPost" },
      { path: "savedPost" },
      { path: "following" },
    ])
    .then((profile) => {
      const isSelf = profile._id.equals(req.user.profile._id);
      res.render("profiles/show", {
        profile,
        isSelf,
        title: `${profile.name}'s profile`,
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
};

//POST "/profile/:profileId/following"  profileCtrl.addToFollowing
const addToFollowing = (req, res) => {
  let { profileId } = req.params;
  let userId = req.user.profile._id;
  Profile.findById(userId)
    .then((profile) => {
      profile.following.push(profileId);
      profile.save().then(() => {
        res.redirect(`/profile/${profileId}`);
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
};

export { 
    index, 
    show, 
    addToFollowing 
};
