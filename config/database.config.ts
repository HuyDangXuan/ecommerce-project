import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.DATABASE}`);
    console.log("Kết nối đến MongoDB thành công");
  } catch (error) {
    console.error("Lỗi kết nối đến MongoDB:", error);
  }
};

export default connectDB;