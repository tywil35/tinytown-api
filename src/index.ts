import { UserAccessController, HealthCheckController, AdminCaptureProductController, FindProductController } from './controller';
import express from 'express';
import http from 'http';
import { EnvUtil } from './utils';
import { LogUtil } from './utils/log.util';
import cors from 'cors';
import { FindCategoryController } from './controller/find-category.controller';
import { UserProfileController } from './controller/user-profile.controller';
import { IamController } from './controller/iam.controller ';
import { AdminUserController } from './controller/admin-users.controller';
import { OrderController } from './controller/order.controller';
import cluster from 'cluster';
import * as numCPUs from 'os';
const app = express();
const port = EnvUtil.SERVER_PORT
const server = http.createServer(app);
app.use(cors({
    origin: EnvUtil.CORS_ORIGIN,
    optionsSuccessStatus: 200
}));
app.use(AdminCaptureProductController.PrefixRoute, AdminCaptureProductController.Router);
app.use(AdminUserController.PrefixRoute, AdminUserController.Router);
app.use(FindCategoryController.PrefixRoute, FindCategoryController.Router);
app.use(FindProductController.PrefixRoute, FindProductController.Router);
app.use(HealthCheckController.PrefixRoute, HealthCheckController.Router);
app.use(IamController.PrefixRoute, IamController.Router);
app.use(OrderController.PrefixRoute, OrderController.Router);
app.use(UserAccessController.PrefixRoute, UserAccessController.Router);
app.use(UserProfileController.PrefixRoute, UserProfileController.Router);
const system_cpu_count = numCPUs.cpus().length;
if (cluster.isPrimary) {
  for (var i = 0; i < system_cpu_count; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    LogUtil.info(`worker ${worker.process.pid} died`);
  });
} else {
    server.listen(port, () => {
        LogUtil.info(`deployed to ${EnvUtil.APP_DOMAIN_URL}:${port}`);
    });
}
