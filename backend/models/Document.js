import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  title: String,
  content: String, // This could be the text content or description of the file
  filePath: String, // New field to store the path of the uploaded file
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

// Middleware for findOneAndUpdate
DocumentSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

export default mongoose.model('Document', DocumentSchema);