import { Router } from "express";
import { isLoggedIn } from "../middleware/middleware.js";
const router = Router();

import * as destinationsCtrl from "../controllers/destinations.js";

// GET "/destinations" destinationsCtrl.index
router.get("/", destinationsCtrl.index);

// GET "/destinations/:destinationId" destinationsCtrl.show
router.get("/:destinationId", destinationsCtrl.show);

// POST "/destinations" destinationsCtrl.create
router.post("/", isLoggedIn, destinationsCtrl.create);

export { router };
