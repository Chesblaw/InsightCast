import "reflect-metadata";
import { container } from "tsyringe";

import AdminService from "./api/v1/Admin/admin.service";
import AdminStateService from "./api/v1/Admin/adminState.service";
import AdminController from "./api/v1/Admin/admin.controller";
import QueueController from "./api/v1/Admin/queue.controller";

container.registerSingleton(AdminService);
container.registerSingleton(AdminStateService);
container.registerSingleton(AdminController);
container.registerSingleton(QueueController);

export { container };
