import { Router } from "express";
import { isLoggedIn } from "../middleware/middleware.js"
const router = Router()

import { Destination } from "../models/dextination.js";
import { Profile } from "../models/profile.js";

// GET "/destinations"
router.get("/", (req,res) => {
    Destination.find()
        .then(destinations => {
            res.render("destinations/index", {
                title: "All Destinations",
                destinations
            })
        })
        .catch(err => {
            console.log(err)
            res.redirect("/")
        })
})

export { router }