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
        {path: "following"}
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

router.post("/:profileId/following", isLoggedIn, (req, res) => {
    let { profileId } = req.params
    let userId = req.user.profile._id
    console.log("following:", profileId)
    console.log("user:", userId)
    Profile.findById(userId)
    .then(profile => {
        profile.following.push(profileId)
        profile.save()
            .then(()=>{
                res.redirect(`/profile/${profileId}`)
            })
            .catch(err => {
                console.log(err)
                res.send("Failed to follow this author")
            })
    })
    .catch(err => {
        console.log(err)
        res.send("Profile is not found")
    })

})

export { router}