import mongoose from 'mongoose';

// ... existing code ...
const AnalysisSchema = new mongoose.Schema({
  callerName: { type: String, required: true, default: 'Unknown' },
  transcript: { type: String, required: true },
  sentimentScore: { type: Number, required: true },
  positiveKeywords: { type: [String], default: [] },
  negativeKeywords: { type: [String], default: [] },
  date: { type: Date, default: Date.now },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export default mongoose.model('Analysis', AnalysisSchema);