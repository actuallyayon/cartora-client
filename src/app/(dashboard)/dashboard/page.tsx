'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  LogOut,
  Plus,
  ShieldCheck,
  User as UserIcon,
  Package,
  Calendar,
  ChevronRight,
  ArrowRight,
  Loader2,
  MapPin,
  Trash2,
  Check,
  Edit2,
  X,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RequireAuth } from '@/features/auth/components/require-auth';
import { useAuth, useLogout } from '@/features/auth/use-auth';
import { useUserOrders } from '@/features/orders/use-orders';
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from '@/features/address/use-address';
import { useUpdateProfile } from '@/features/profile/use-profile';
import type { Address } from '@/features/address/address.types';
import { AnalyticsDashboard } from '@/features/analytics/components/analytics-dashboard';
import { formatPrice } from '@/lib/format';
import { toast } from 'sonner';
import axios from 'axios';

interface AddressFormFields {
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

const emptyAddressForm: AddressFormFields = {
  label: 'Home',
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'United States',
  isDefault: false,
};

function DashboardContent() {
  const { user, isAdmin } = useAuth();
  const logout = useLogout();

  // Queries
  const { data: orders = [], isLoading: isOrdersLoading } = useUserOrders();
  const { data: addresses = [], isLoading: isAddressesLoading } = useAddresses();

  // Mutations
  const createAddressMutation = useCreateAddress();
  const updateAddressMutation = useUpdateAddress();
  const deleteAddressMutation = useDeleteAddress();
  const setDefaultAddressMutation = useSetDefaultAddress();
  const updateProfileMutation = useUpdateProfile();

  // Profile Edit states
  const [isEditingProfile, setIsEditingProfile] = React.useState(false);
  const [profileName, setProfileName] = React.useState('');
  const [profilePhone, setProfilePhone] = React.useState('');

  // Address form states
  const [isAddingAddress, setIsAddingAddress] = React.useState(false);
  const [editingAddressId, setEditingAddressId] = React.useState<string | null>(null);
  const [addressForm, setAddressForm] = React.useState<AddressFormFields>(emptyAddressForm);



  if (!user) return null;

  const handleUpdateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }

    updateProfileMutation.mutate(
      {
        name: profileName,
        phone: profilePhone || undefined,
      },
      {
        onSuccess: () => {
          toast.success('Profile updated successfully.');
          setIsEditingProfile(false);
        },
        onError: (err) => {
          const msg = axios.isAxiosError(err)
            ? ((err.response?.data as { message?: string })?.message ?? 'Failed to update profile')
            : 'Failed to update profile';
          toast.error(msg);
        },
      }
    );
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !addressForm.fullName.trim() ||
      !addressForm.phone.trim() ||
      !addressForm.line1.trim() ||
      !addressForm.city.trim() ||
      !addressForm.postalCode.trim() ||
      !addressForm.country.trim()
    ) {
      toast.error('Please fill in all required address fields.');
      return;
    }

    if (editingAddressId) {
      updateAddressMutation.mutate(
        {
          id: editingAddressId,
          payload: addressForm,
        },
        {
          onSuccess: () => {
            toast.success('Address updated successfully.');
            setAddressForm(emptyAddressForm);
            setEditingAddressId(null);
            setIsAddingAddress(false);
          },
          onError: (err) => {
            const msg = axios.isAxiosError(err)
              ? ((err.response?.data as { message?: string })?.message ?? 'Failed to update address')
              : 'Failed to update address';
            toast.error(msg);
          },
        }
      );
    } else {
      createAddressMutation.mutate(addressForm, {
        onSuccess: () => {
          toast.success('Address saved to address book.');
          setAddressForm(emptyAddressForm);
          setIsAddingAddress(false);
        },
        onError: (err) => {
          const msg = axios.isAxiosError(err)
            ? ((err.response?.data as { message?: string })?.message ?? 'Failed to create address')
            : 'Failed to create address';
          toast.error(msg);
        },
      });
    }
  };

  const handleSetDefault = (id: string) => {
    setDefaultAddressMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Default address updated.');
      },
    });
  };

  const handleDeleteAddress = (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    deleteAddressMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Address deleted.');
      },
    });
  };

  const startEditAddress = (addr: Address) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      label: addr.label || 'Home',
      fullName: addr.fullName,
      phone: addr.phone,
      line1: addr.line1,
      line2: addr.line2 || '',
      city: addr.city,
      state: addr.state || '',
      postalCode: addr.postalCode,
      country: addr.country,
      isDefault: addr.isDefault,
    });
    setIsAddingAddress(true);
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'pending':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'processing':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'shipped':
        return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      case 'delivered':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'cancelled':
        return 'bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Header section */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome, {isAdmin ? 'Admin' : user.name.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            You are signed in as{' '}
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                isAdmin ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {isAdmin ? <ShieldCheck className="h-3 w-3" /> : <UserIcon className="h-3 w-3" />}
              {user.role}
            </span>
          </p>
        </div>
        <Button variant="outline" onClick={() => logout.mutate()} disabled={logout.isPending}>
          <LogOut />
          Sign out
        </Button>
      </div>

      {/* Grid Account Summary & Store access */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card id="profile">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Account profile</CardTitle>
            {!isAdmin && !isEditingProfile && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => {
                  setProfileName(user.name);
                  setProfilePhone(user.phone || '');
                  setIsEditingProfile(true);
                }}
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            {isEditingProfile ? (
              <form onSubmit={handleUpdateProfileSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full rounded border border-input bg-background px-2.5 py-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Phone</label>
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full rounded border border-input bg-background px-2.5 py-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="submit" size="sm" className="h-7 text-xs flex-1">
                    Save Profile
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs flex-1"
                    onClick={() => setIsEditingProfile(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-1">
                <p>
                  <span className="text-foreground font-semibold">Name:</span> {user.name}
                </p>
                <p>
                  <span className="text-foreground font-semibold">Email:</span> {user.email}
                </p>
                <p>
                  <span className="text-foreground font-semibold">Phone:</span> {user.phone || 'Not provided'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{isAdmin ? 'Admin tools' : 'Store access'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {isAdmin ? (
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <Link href="/items/add">
                    <Plus />
                    Add product
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/items/manage">
                    <Package className="h-4 w-4" />
                    Manage products
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/items/orders">
                    <Package className="h-4 w-4" />
                    Manage orders
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/explore">View store</Link>
                </Button>
              </div>
            ) : (
              <>
                <p className="text-muted-foreground">
                  Browse products, add items to cart, and check out securely using our Stripe sandbox simulation.
                </p>
                <Button asChild variant="link" className="h-auto p-0 flex items-center gap-1">
                  <Link href="/explore">
                    Start shopping
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Admin Analytics Panel (admin only) */}
      {isAdmin && <AnalyticsDashboard />}

      {/* Saved Addresses (regular users only) */}
      {!isAdmin && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Address Book
            </CardTitle>
            {!isAddingAddress && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1"
                onClick={() => {
                  setAddressForm(emptyAddressForm);
                  setEditingAddressId(null);
                  setIsAddingAddress(true);
                }}
              >
                <Plus className="h-3.5 w-3.5" />
                Add Address
              </Button>
            )}
          </CardHeader>
          <CardContent className="pt-4">
            {isAddingAddress ? (
              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <h4 className="text-xs font-semibold text-foreground border-b pb-1">
                  {editingAddressId ? 'Edit Address' : 'New Saved Address'}
                </h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Label</label>
                    <input
                      type="text"
                      placeholder="e.g. Home, Office"
                      value={addressForm.label}
                      onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                      className="w-full rounded border border-input bg-background px-3 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Full name *</label>
                    <input
                      type="text"
                      value={addressForm.fullName}
                      onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                      className="w-full rounded border border-input bg-background px-3 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Phone number *</label>
                    <input
                      type="text"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      className="w-full rounded border border-input bg-background px-3 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Address line 1 *</label>
                    <input
                      type="text"
                      placeholder="Street address, P.O. Box"
                      value={addressForm.line1}
                      onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })}
                      className="w-full rounded border border-input bg-background px-3 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Address line 2</label>
                    <input
                      type="text"
                      placeholder="Apartment, suite, unit, building (optional)"
                      value={addressForm.line2}
                      onChange={(e) => setAddressForm({ ...addressForm, line2: e.target.value })}
                      className="w-full rounded border border-input bg-background px-3 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">City *</label>
                    <input
                      type="text"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="w-full rounded border border-input bg-background px-3 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">State / Province</label>
                    <input
                      type="text"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      className="w-full rounded border border-input bg-background px-3 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Postal code *</label>
                    <input
                      type="text"
                      value={addressForm.postalCode}
                      onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                      className="w-full rounded border border-input bg-background px-3 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Country *</label>
                    <input
                      type="text"
                      value={addressForm.country}
                      onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                      className="w-full rounded border border-input bg-background px-3 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    id="isDefaultAddress"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                    className="rounded border-input text-primary focus:ring-ring h-4 w-4"
                  />
                  <label htmlFor="isDefaultAddress" className="text-xs font-medium text-foreground">
                    Set as default address
                  </label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" size="sm" className="h-8 text-xs flex-1">
                    {editingAddressId ? 'Update Address' : 'Save Address'}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs flex-1 border"
                    onClick={() => {
                      setAddressForm(emptyAddressForm);
                      setEditingAddressId(null);
                      setIsAddingAddress(false);
                    }}
                  >
                    <X className="mr-1 h-3.5 w-3.5" />
                    Cancel
                  </Button>
                </div>
              </form>
            ) : isAddressesLoading ? (
              <div className="py-6 flex justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : addresses.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">
                No saved shipping addresses. Add one to speed up checkout!
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`rounded-lg border p-4 text-xs space-y-1 relative group hover:border-primary/40 transition-colors ${
                      addr.isDefault ? 'border-primary bg-primary/5' : 'border-border bg-card/20'
                    }`}
                  >
                    <div className="flex justify-between items-center pb-1 border-b border-border mb-2">
                      <span className="font-semibold text-foreground uppercase tracking-wider text-[10px]">
                        {addr.label || 'Home'}
                      </span>
                      {addr.isDefault && (
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.2 text-[9px] font-semibold text-primary">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="font-medium text-foreground">{addr.fullName}</p>
                    <p>{addr.line1}</p>
                    {addr.line2 && <p>{addr.line2}</p>}
                    <p>
                      {addr.city}, {addr.state ? `${addr.state} ` : ''}
                      {addr.postalCode}
                    </p>
                    <p>{addr.country}</p>
                    <p className="text-foreground pt-1">Phone: {addr.phone}</p>

                    <div className="flex gap-2 pt-3 border-t mt-3 justify-end opacity-85 group-hover:opacity-100 transition-opacity">
                      {!addr.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-[10px] p-1.5"
                          onClick={() => handleSetDefault(addr.id)}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Set default
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-[10px] p-1.5"
                        onClick={() => startEditAddress(addr)}
                      >
                        <Edit2 className="h-3 w-3 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-[10px] p-1.5 text-destructive hover:text-destructive hover:bg-destructive/5"
                        onClick={() => handleDeleteAddress(addr.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Orders section (for regular users) */}
      {!isAdmin && (
        <Card id="orders">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Your Orders
            </CardTitle>
            {!isOrdersLoading && orders.length > 0 && (
              <span className="text-xs text-muted-foreground font-semibold">
                {orders.length} order{orders.length > 1 ? 's' : ''} total
              </span>
            )}
          </CardHeader>
          <CardContent className="pt-4 px-0">
            {isOrdersLoading ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : orders.length === 0 ? (
              <div className="py-12 px-6 text-center text-muted-foreground">
                <p className="text-sm">You haven&apos;t placed any orders yet.</p>
                <Button asChild variant="link" className="mt-2 text-primary font-medium">
                  <Link href="/explore">Discover products</Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {orders.map((order) => {
                  const dateStr = new Date(order.placedAt || order.createdAt).toLocaleDateString('en-US', {
                    dateStyle: 'medium',
                  });

                  return (
                    <Link
                      key={order.id}
                      href={`/dashboard/orders/${order.orderNumber}`}
                      className="flex items-center justify-between px-6 py-4 hover:bg-muted/15 transition-colors group"
                    >
                      <div className="space-y-1 text-xs">
                        <p className="font-mono font-semibold text-foreground group-hover:text-primary transition-colors">
                          {order.orderNumber}
                        </p>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {dateStr}
                          </span>
                          <span>&bull;</span>
                          <span className="font-medium text-foreground">
                            {formatPrice(order.total)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold capitalize ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}
