import express, {Router} from "express"
import path from "path"

const router = Router();
router.use(
  "/assets",
  express.static(path.join(__dirname, "../../..", "client/dist"))
);

export default router;
