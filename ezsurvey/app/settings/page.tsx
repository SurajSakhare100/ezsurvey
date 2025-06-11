"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from "next/link"
import { ArrowLeft, Bell, CreditCard, MessageSquare, Shield, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || '',
      }));
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      await update({
        ...session,
        user: {
          ...session?.user,
          name: formData.name,
          email: formData.email,
        },
      });

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update password');
      }

      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));

      toast({
        title: "Success",
        description: "Password updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update password',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    router.push('/login');
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Dashboard</span>
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-cyan-600" />
              <span className="text-xl font-semibold">MicroSurvey</span>
            </div>
          </div>
          <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
            Save Changes
          </Button>
        </div>
      </header>

      <main className="flex-1 bg-slate-50 py-8">
        <div className="container max-w-4xl px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Account Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences and settings</p>
          </div>

          <div className="grid gap-6">
            {/* Profile Settings */}
            <Card className="rounded-2xl">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-cyan-600" />
                  <CardTitle>Profile Information</CardTitle>
                </div>
                <CardDescription>Update your personal information and profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleProfileUpdate}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={loading} className="mt-4">
                    {loading ? 'Updating...' : 'Update Profile'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="rounded-2xl">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-cyan-600" />
                  <CardTitle>Notifications</CardTitle>
                </div>
                <CardDescription>Choose what notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">New Responses</Label>
                    <p className="text-sm text-muted-foreground">Get notified when someone responds to your surveys</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Weekly Summary</Label>
                    <p className="text-sm text-muted-foreground">Receive a weekly summary of your survey performance</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Product Updates</Label>
                    <p className="text-sm text-muted-foreground">Stay informed about new features and improvements</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="rounded-2xl">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-cyan-600" />
                  <CardTitle>Security</CardTitle>
                </div>
                <CardDescription>Manage your account security and privacy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handlePasswordUpdate}>
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="mt-4">
                    {loading ? 'Updating...' : 'Update Password'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Billing Settings */}
            <Card className="rounded-2xl">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-cyan-600" />
                  <CardTitle>Billing & Usage</CardTitle>
                </div>
                <CardDescription>View your purchase history and usage statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">MicroSurvey License</h3>
                      <p className="text-sm text-muted-foreground">Purchased on June 1, 2025</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$29.00</div>
                      <div className="text-sm text-green-600">Lifetime Access</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="rounded-lg border p-3">
                    <div className="text-2xl font-bold text-cyan-600">12</div>
                    <div className="text-sm text-muted-foreground">Surveys Created</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-2xl font-bold text-cyan-600">247</div>
                    <div className="text-sm text-muted-foreground">Total Responses</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-2xl font-bold text-cyan-600">∞</div>
                    <div className="text-sm text-muted-foreground">Remaining</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="rounded-2xl border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
                <CardDescription>Irreversible and destructive actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4">
                  <div>
                    <h3 className="font-medium text-red-900">Delete Account</h3>
                    <p className="text-sm text-red-700">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
