import express from "express";
import { accountsController } from "./controllers/accounts-controller.js";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { aboutController } from "./controllers/about-controller.js";
import { stationController } from "./controllers/station-controller.js";

export const router = express.Router();

router.get("/", accountsController.index);

router.get("/login", accountsController.login);
router.get("/signup", accountsController.signup);
router.get("/logout", accountsController.logout);
router.post("/register", accountsController.register);
router.post("/authenticate", accountsController.authenticate);


router.get("/dashboard", dashboardController.index); 
router.post("/dashboard/addStation", accountsController.ensureAuthenticated, dashboardController.addStation);

router.get("/about", aboutController.index);
router.get("/station/:id", stationController.index);
router.post("/station/:id/addReading", stationController.addReading);
router.get("/station/:stationid/deletestation/:id", playlistController.deleteTrack);
export default router;
