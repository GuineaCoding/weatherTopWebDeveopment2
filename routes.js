import express from "express";
import { accountsController } from "./controllers/accounts-controller.js";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { aboutController } from "./controllers/about-controller.js";
import { stationController } from "./controllers/station-controller.js";
import { readingController } from "./controllers/reading-controller.js";

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
router.get("/dashboard/deletestation/:id", dashboardController.deleteStation);
router.get("/station/:stationid/deleteReading/:readingId", stationController.deleteReading);
router.get("/station/:stationid/editReading/:readingId", readingController.index);
router.post("/station/:stationid/updateReading/:readingId", readingController.update);
router.get("/dashboard/editStationName/:id", stationController.editStationParam);
router.post("/station/updateStationDetails/:id", stationController.updateStationName);

export default router;
