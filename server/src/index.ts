import { Router } from "express";
import adminRoutes from "./api/v1/Admin/admin.routes";
import { DependencyContainer } from "tsyringe";

export default function appRoutes(container: DependencyContainer) {
  const router = Router();

  router.use("/admin", adminRoutes(container));

  return router;
}
