import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { createService, getServices, getService, updateService, deleteService } from "../controllers/serviceController.js";

const router = express.Router();

// router.route("/")
//     .get(getServices) // public
//     .post(protect, authorize("admin"), createService);

// router.route("/:id")
//     .get(getService) // public
//     .put(protect, authorize("admin"), updateService)
//     .delete(protect, authorize("admin"), deleteService);


router.route("/")
    .get(getServices)
    .post(createService);
router.route("/:id")
    .get(getService)
    .put(updateService)
    .delete(deleteService);

export default router;
