import {Router} from "express";
import assetsRoutes from "./assets";
import authRoutes from "./auth";
import appRoutes from "./app";
import publicRoutes from "./public";

const router = Router();

router.use(assetsRoutes);
router.use(authRoutes);
router.use(appRoutes);
router.use(publicRoutes);

export default router;
