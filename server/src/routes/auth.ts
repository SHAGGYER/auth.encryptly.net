import {Router} from "express";
import { RequiresAuth } from "middleware/RequiresAuth"
import {
  register,
  login,
  authorize,
  isAuthorized,
  account,
  getAppData,
  getUser,
  updateName,
  logout,
  sendPasswordResetEmail,
  checkVerificationToken,
  resetPassword,
  init,
} from "controllers/AuthController"

const router = Router();

router.get("/api/auth/init", init);
router.post("/api/auth/register", register);
router.post("/api/auth/login", login);
router.get("/api/auth/account", account);
router.get("/api/auth/getUser", getUser);
router.get("/api/auth/getAppData", getAppData);
router.post("/api/auth/send-password-reset-email", sendPasswordResetEmail);
router.post("/api/auth/check-email-verification-token", checkVerificationToken);
router.post("/api/auth/reset-password", resetPassword);
router.post("/api/auth/authorize", RequiresAuth, authorize);
router.get("/api/auth/isAuthorized", RequiresAuth, isAuthorized);
router.post("/api/auth/updateName", RequiresAuth, updateName);
router.post("/api/auth/logout", RequiresAuth, logout);

export default router;
