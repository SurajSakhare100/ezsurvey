import mongoose, { Schema, Document } from 'mongoose';

interface IQuestion {
  id: string;
  question: string;
  required: boolean;
}

interface IAnswer {
  questionId: string;
  answer: string;
}

interface IResponse extends Document {
  surveyId: string;
  answers: IAnswer[];
  email?: string;
  metadata?: {
    userAgent?: string;
    ip?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const answerSchema = new Schema<IAnswer>({
  questionId: {
    type: String,
    required: true,
    index: true
  },
  answer: {
    type: String,
    required: true,
    trim: true
  }
});

const responseSchema = new Schema<IResponse>(
  {
    surveyId: {
      type: String,
      required: true,
      index: true
    },
    answers: {
      type: [answerSchema],
      required: true,
      validate: {
        validator: function(answers: IAnswer[]) {
          return answers && answers.length > 0;
        },
        message: 'At least one answer is required'
      }
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function(email: string) {
          if (!email) return true; // Email is optional
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        },
        message: 'Invalid email format'
      }
    },
    metadata: {
      userAgent: String,
      ip: String
    }
  },
  {
    timestamps: true
  }
);

// Indexes for better query performance
responseSchema.index({ createdAt: -1 });
responseSchema.index({ 'answers.questionId': 1 });

// Pre-save middleware to validate answers
responseSchema.pre('save', async function(this: mongoose.Document & IResponse, next) {
  try {
    // Get the survey to validate question IDs
    const survey = await mongoose.model('Survey').findById(this.surveyId);
    if (!survey) {
      throw new Error('Survey not found');
    }

    // Validate that all question IDs exist in the survey
    const surveyQuestionIds = (survey.questions as IQuestion[]).map(q => q.id);
    const responseQuestionIds = this.answers.map(a => a.questionId);

    const invalidQuestionIds = responseQuestionIds.filter(
      id => !surveyQuestionIds.includes(id)
    );

    if (invalidQuestionIds.length > 0) {
      throw new Error(`Invalid question IDs found: ${invalidQuestionIds.join(', ')}`);
    }

    // Validate that all required questions are answered
    const requiredQuestions = (survey.questions as IQuestion[]).filter(q => q.required);
    const answeredQuestionIds = new Set(responseQuestionIds);

    const missingRequiredQuestions = requiredQuestions.filter(
      q => !answeredQuestionIds.has(q.id)
    );

    if (missingRequiredQuestions.length > 0) {
      throw new Error(
        `Missing answers for required questions: ${missingRequiredQuestions
          .map(q => q.question)
          .join(', ')}`
      );
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to get response statistics
responseSchema.statics.getStats = async function(surveyId: string) {
  return this.aggregate([
    { $match: { surveyId: surveyId } },
    { $unwind: '$answers' },
    {
      $group: {
        _id: '$answers.questionId',
        totalAnswers: { $sum: 1 },
        uniqueAnswers: { $addToSet: '$answers.answer' }
      }
    },
    {
      $project: {
        questionId: '$_id',
        totalAnswers: 1,
        uniqueAnswers: { $size: '$uniqueAnswers' }
      }
    }
  ]);
};

const Response = mongoose.models.Response || mongoose.model<IResponse>('Response', responseSchema);

export default Response; 