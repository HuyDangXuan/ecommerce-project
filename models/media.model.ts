import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  folder: String,
  filename: String,
  mimetype: String,
  size: Number,
  deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
}, {
  timestamps: true,
})

const Media = mongoose.model('Media', schema, 'media');

export default Media;