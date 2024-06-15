import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  lastEditedBy: {
    type: String,
    default: '',
  },
});

// Middleware to set updatedAt on document update
DocumentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Document', DocumentSchema);