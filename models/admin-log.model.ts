import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    adminId: String,
    method: String,
    route: String,
    title: String,
    expiredAt: {
      type: Date,
      expires: 0,
    },
  },
  {
    timestamps: true,
  }
);

const AdminLog = mongoose.model('AdminLog', schema, "admin-logs");

export default AdminLog;