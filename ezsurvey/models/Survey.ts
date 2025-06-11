import mongoose, { Schema, Document } from 'mongoose';

export interface ISurvey extends Document {
  title: string;
  description?: string;
  questions: {
    id: string;
    type: 'text' | 'multiple_choice' | 'single_choice' | 'rating' | 'scale';
    question: string;
    options?: string[];
    required: boolean;
    order: number;
  }[];
  settings: {
    allowAnonymous: boolean;
    requireEmail: boolean;
    limitResponses: boolean;
    maxResponses?: number;
  };
  
  createdBy: string;
  status: 'draft' | 'published' | 'closed';
  analytics: {
    totalResponses: number;
    lastResponseAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const surveySchema = new Schema<ISurvey>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  questions: [{
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: [true, 'Question type is required'],
      enum: {
        values: ['text', 'multiple_choice', 'single_choice', 'rating', 'scale'],
        message: 'Invalid question type. Must be one of: text, multiple_choice, single_choice, rating, scale'
      }
    },
    question: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
      minlength: [2, 'Question must be at least 2 characters long'],
      maxlength: [500, 'Question cannot exceed 500 characters'],
    },
    options: [{
      type: String,
      trim: true,
      maxlength: [200, 'Option text cannot exceed 200 characters'],
    }],
    required: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      required: true,
      min: [0, 'Order must be a non-negative number'],
    },
  }],
  settings: {
    allowAnonymous: {
      type: Boolean,
      default: false,
    },
    requireEmail: {
      type: Boolean,
      default: false,
    },
    limitResponses: {
      type: Boolean,
      default: false,
    },
    maxResponses: {
      type: Number,
      default: 0,
      min: [0, 'Maximum responses must be a non-negative number'],
    },
  },
  createdBy: {
    type: String,
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: {
      values: ['draft', 'published', 'closed'],
      message: 'Status must be one of: draft, published, closed'
    },
    default: 'draft',
  },
  analytics: {
    totalResponses: {
      type: Number,
      default: 0,
      min: [0, 'Total responses cannot be negative'],
    },
    lastResponseAt: Date,
  },
}, {
  timestamps: true,
});

// Add indexes for better query performance
surveySchema.index({ createdAt: -1 });
surveySchema.index({ status: 1 });
surveySchema.index({ 'analytics.totalResponses': -1 });

// Validate questions based on type
surveySchema.pre('save', function(next) {
  // Validate question order
  const orders = this.questions.map(q => q.order);
  if (new Set(orders).size !== orders.length) {
    throw new Error('Question orders must be unique');
  }

  for (const question of this.questions) {
    // Validate question type specific requirements
    switch (question.type) {
      case 'multiple_choice':
      case 'single_choice':
        if (!question.options || question.options.length < 2) {
          throw new Error(`Question "${question.question}" requires at least 2 options`);
        }
        break;
      
      case 'rating':
      case 'scale':
        if (!question.options || question.options.length === 0) {
          question.options = ['1', '2', '3', '4', '5'];
        } else if (question.options.length < 2) {
          throw new Error(`Question "${question.question}" requires at least 2 rating/scale options`);
        }
        break;
      
      case 'text':
        // Text questions don't need options
        question.options = undefined;
        break;
    }
  }

  // Validate settings
  if (this.settings.limitResponses && (!this.settings.maxResponses || this.settings.maxResponses <= 0)) {
    throw new Error('Maximum responses must be greater than 0 when response limiting is enabled');
  }

  next();
});

const Survey = mongoose.models.Survey || mongoose.model<ISurvey>('Survey', surveySchema);

export default Survey; 