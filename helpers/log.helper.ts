import { RequestAccount } from '../interfaces/request.interface';
import AdminLog from '../models/admin-log.model';

export const logAdminAction = async (req: RequestAccount, title: string) => {
  const dataFinal = {
    adminId: req.adminId,
    method: req.method,
    route: req.originalUrl,
    title: title,
    expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  };

  const newRecord = new AdminLog(dataFinal);
  await newRecord.save();
}