import { Router } from "express";
import { isLoggedIn } from "../middleware/middleware.js"
const router = Router()

import { Profile } from "../models/profile.js"

//GET "/profile" profile.index
router.get("/", isLoggedIn, (req,res) => {
Profile.find()
    .then(profiles => {
        // res.send("this is profile")
        res.render("profiles/index", {
            profiles,
            title: "Profile"
        })
    })
    .catch(err => {
        console.log(err)
        res.redirect("/")
    })
})

//GET "/profile/:profileId" profileCtrl.show
router.get("/:profileId", isLoggedIn, (req,res) => {
    let { profileId } = req.params
    Profile.findById(profileId)
    .populate([
        {path: "myPost"},
        {path: "savedPost"},
        ])
        .then(profile => {
            const isSelf = profile._id.equals(req.user.profile._id)
                res.render("profiles/show", {
                    profile,
                    isSelf,
                    title: `${profile.name}'s profile`
                })
        })
        .catch(err => {
            console.log(err)
            // res.redirect("/")
            res.send("profile is not found")
        })
})

export { router}