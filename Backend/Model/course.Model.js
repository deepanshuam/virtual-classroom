import { Schema, model } from 'mongoose';

const courseSchema = new Schema({
  title: { type: String, required: true },
  instructor: { type: Schema.Types.ObjectId, ref: 'User' },
  units: [{
    title: { type: String, required: true },
    sessions: [{
      title: { type: String, required: true },
      materials: [String], // URLs to PDFs, videos, etc.
      comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
    }]
  }]
}, { timestamps: true });

export default model('Course', courseSchema);
