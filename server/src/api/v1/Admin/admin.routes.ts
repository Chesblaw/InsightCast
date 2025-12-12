import { Router } from "express";
import { DependencyContainer } from "tsyringe";
import QueueController from "./queue.controller";
import AdminController from "./admin.controller";
import { authenticateToken } from "../../../middleware/auth";

export default function adminRoutes(container: DependencyContainer) {
  const router = Router();

  const queueController = container.resolve(QueueController);
  const adminController = container.resolve(AdminController);

  router.get("/queue/stats", authenticateToken, queueController.getQueueStats.bind(queueController));

  router.post('/pause', adminController.pauseContract.bind(adminController));
  router.post('/unpause', adminController.unpauseContract.bind(adminController));
  router.post('/set-fee', adminController.setPlatformFee.bind(adminController));
  router.post('/add-token', adminController.addSupportedToken.bind(adminController));
  router.post('/remove-token', adminController.removeSupportedToken.bind(adminController));
  router.post('/emergency-close-market', adminController.emergencyCloseMarket.bind(adminController));
  router.post('/emergency-withdraw', adminController.emergencyWithdraw.bind(adminController));
  router.get('/state', adminController.getAdminState.bind(adminController));

  return router;
}
