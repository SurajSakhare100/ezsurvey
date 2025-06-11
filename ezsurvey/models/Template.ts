import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'customer_satisfaction',
      'employee_feedback',
      'market_research',
      'product_feedback',
      'nps',
      'event_feedback',
      'user_experience',
      'training_evaluation',
      'demographic',
      'exit_survey'
    ]
  },
  questions: [{
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['text', 'multiple_choice', 'single_choice', 'rating', 'scale']
    },
    question: {
      type: String,
      required: true,
      trim: true
    },
    options: [{
      type: String,
      trim: true
    }],
    required: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      required: true
    }
  }],
  settings: {
    allowAnonymous: {
      type: Boolean,
      default: false
    },
    requireEmail: {
      type: Boolean,
      default: false
    },
    limitResponses: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
templateSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Template = mongoose.models.Template || mongoose.model('Template', templateSchema);

export default Template; 