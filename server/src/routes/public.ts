import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.render("public");
});

router.get("*", (_req, res) => {
  res.render("public");
});

export default router;
