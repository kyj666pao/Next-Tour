import { Router } from "express";
import { isLoggedIn } from "../middleware/middleware.js";
const router = Router();

import * as profileCtrl from "../controllers/profile.js";

//GET "/profile" profileCtrl.index
router.get("/", isLoggedIn, profileCtrl.index);

//GET "/profile/:profileId" profileCtrl.show
router.get("/:profileId", isLoggedIn, profileCtrl.show);

//POST "/profile/:profileId/following"  profileCtrl.addToFollowing
router.post("/:profileId/following", isLoggedIn, profileCtrl.addToFollowing);

export { router };
