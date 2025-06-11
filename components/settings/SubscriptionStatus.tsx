'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  description: string;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free Plan',
    price: 0,
    description: 'Perfect for getting started',
    features: [
      'Up to 5 surveys per month',
      'Basic analytics',
      'Standard support',
      'Basic templates',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: 5,
    description: 'Best for growing businesses',
    features: [
      'Unlimited surveys',
      'Advanced analytics',
      'Priority support',
      'Custom templates',
      'API access',
      'Team collaboration',
    ],
  },
];

interface SubscriptionStatusProps {
  user: {
    email?: string;
    subscription: {
      planId: string | null;
      status: string;
      startDate: Date | null;
      endDate: Date | null;
    };
  };
}

export default function SubscriptionStatus({ user }: SubscriptionStatusProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (planId: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Initialize Razorpay
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          subscription_id: data.subscriptionId,
          name: 'MicroSurvey',
          description: `Monthly subscription to ${planId} plan`,
          handler: async (response: any) => {
            // Handle successful payment
            await fetch('/api/verify-subscription', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            
            toast.success('Monthly subscription activated successfully!');
            router.refresh();
          },
          prefill: {
            email: user.email,
          },
          theme: {
            color: '#6366f1',
          },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Your current subscription status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                {user.subscription.planId || 'Free Plan'}
              </h3>
              <p className="text-sm text-gray-500">
                {user.subscription.status === 'active'
                  ? `Valid until ${new Date(user.subscription.endDate!).toLocaleDateString()}`
                  : 'No active subscription'}
              </p>
            </div>
            <Badge className={getStatusColor(user.subscription.status)}>
              {user.subscription.status.charAt(0).toUpperCase() +
                user.subscription.status.slice(1)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <Card key={plan.id} className="relative">
            {plan.id === 'pro' && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-indigo-600">Popular</Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-gray-500">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-6 w-full"
                variant={plan.id === 'pro' ? 'default' : 'outline'}
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading || (user.subscription.planId === plan.id && user.subscription.status === 'active')}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : user.subscription.planId === plan.id && user.subscription.status === 'active' ? (
                  'Current Plan'
                ) : (
                  plan.id === 'free' ? 'Downgrade' : 'Upgrade'
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 