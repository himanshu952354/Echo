import mongoose from 'mongoose';

const abandonedCallSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('AbandonedCall', abandonedCallSchema);
