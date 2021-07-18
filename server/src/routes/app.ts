import { getMyApps, generateApp, removeApp } from "controllers/AppController";
import { Router } from "express";
import { RequiresAuth } from "middleware/RequiresAuth";

const router = Router();

router.get("/api/apps/my", RequiresAuth, getMyApps);
router.delete("/api/apps/:id", RequiresAuth, removeApp);
router.post("/api/apps/generateApp", generateApp);

export default router;
