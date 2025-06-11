declare module 'razorpay' {
  interface RazorpayOptions {
    key_id: string;
    key_secret: string;
  }

  interface PlanOptions {
    period: 'monthly';
    interval: number;
    item: {
      name: string;
      amount: number;
      currency: string;
    };
  }

  interface SubscriptionOptions {
    plan_id: string;
    customer_notify: number;
    total_count: number;
  }

  class Razorpay {
    constructor(options: RazorpayOptions);
    plans: {
      create(options: PlanOptions): Promise<any>;
    };
    subscriptions: {
      create(options: SubscriptionOptions): Promise<any>;
    };
  }

  export = Razorpay;
} 