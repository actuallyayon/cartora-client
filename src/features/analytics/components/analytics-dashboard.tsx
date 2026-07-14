'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAdminAnalytics } from '@/features/analytics/use-analytics';
import { formatPrice } from '@/lib/format';

const COLORS = [
  '#f97316', // orange-500
  '#10b981', // emerald-500
  '#6366f1', // indigo-500
  '#f59e0b', // amber-500
  '#ec4899', // pink-500
  '#14b8a6', // teal-500
  '#8b5cf6', // violet-500
  '#ef4444', // red-500
];

export function AnalyticsDashboard() {
  const { data, isLoading, isError } = useAdminAnalytics();

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col justify-center items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">Compiling platform metrics...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="py-12 border border-dashed rounded-xl bg-card/40 text-center text-xs text-muted-foreground">
        Error compiling analytics report. Please verify connection credentials.
      </div>
    );
  }

  const { kpis, recentOrders, revenueOverTime, salesByCategory } = data;

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
    <div className="space-y-6">
      {/* 4 KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:border-primary/30 transition-colors shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Revenue
            </CardTitle>
            <div className="bg-primary/10 p-2 rounded-full text-primary">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatPrice(kpis.totalRevenue)}
            </div>
            <p className="text-[10px] text-emerald-500 flex items-center gap-1 mt-1 font-medium">
              <TrendingUp className="h-3 w-3" />
              Lifetime earnings
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/30 transition-colors shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Orders
            </CardTitle>
            <div className="bg-primary/10 p-2 rounded-full text-primary">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {kpis.totalOrders}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Active checkouts processed
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/30 transition-colors shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Products Active
            </CardTitle>
            <div className="bg-primary/10 p-2 rounded-full text-primary">
              <Package className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {kpis.totalProducts}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Catalog count items online
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/30 transition-colors shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Registered customers
            </CardTitle>
            <div className="bg-primary/10 p-2 rounded-full text-primary">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {kpis.totalCustomers}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Platform account members
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Row 1: Charts (Revenue over time + sales distribution by category) */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue over time area chart */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Revenue over time</CardTitle>
            <CardDescription className="text-xs">
              Daily revenue trends for the last 7 calendar days.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72 pl-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueOverTime} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  fontSize={10}
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(str) => {
                    const parts = str.split('-');
                    return parts.length >= 3 ? `${parts[1]}/${parts[2]}` : str;
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={10}
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: 'hsl(var(--foreground))',
                  }}
                  formatter={(val: unknown) => {
                    const num = typeof val === 'number' ? val : Number(val) || 0;
                    return [formatPrice(num), 'Revenue'];
                  }}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category distribution pie chart */}
        <Card className="lg:col-span-1 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Sales by category</CardTitle>
            <CardDescription className="text-xs">
              Item distribution count sold by category.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72 flex flex-col justify-center items-center">
            {salesByCategory[0]?.name === 'None' || salesByCategory.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-12">No category sales metrics available.</p>
            ) : (
              <>
                <div className="w-full h-44 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={salesByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {salesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '11px',
                          color: 'hsl(var(--foreground))',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Category Legends */}
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center mt-3 text-[10px] w-full max-h-16 overflow-y-auto">
                  {salesByCategory.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-1">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-muted-foreground">
                        {entry.name}: <span className="font-semibold text-foreground">{entry.value}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Daily Order Frequencies & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order count bar chart */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Order frequencies</CardTitle>
            <CardDescription className="text-xs">
              Daily counts of invoices completed.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72 pl-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueOverTime} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  fontSize={10}
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(str) => {
                    const parts = str.split('-');
                    return parts.length >= 3 ? `${parts[1]}/${parts[2]}` : str;
                  }}
                />
                <YAxis tickLine={false} axisLine={false} fontSize={10} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: 'hsl(var(--foreground))',
                  }}
                  formatter={(val: unknown) => {
                    const num = typeof val === 'number' ? val : Number(val) || 0;
                    return [num, 'Orders'];
                  }}
                />
                <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent orders table */}
        <Card className="lg:col-span-1 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Recent activity</CardTitle>
            <CardDescription className="text-xs">
              Latest orders submitted on the store.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            {recentOrders.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-12">No orders recorded yet.</p>
            ) : (
              <div className="divide-y divide-border">
                {recentOrders.map((ord) => {
                  const dateStr = new Date(ord.createdAt).toLocaleDateString('en-US', {
                    dateStyle: 'short',
                  });
                  return (
                    <Link
                      key={ord.id}
                      href={`/items/orders?search=${ord.orderNumber}`}
                      className="flex items-center justify-between px-6 py-3.5 hover:bg-muted/15 transition-colors group text-xs"
                    >
                      <div className="space-y-0.5">
                        <p className="font-mono font-semibold text-foreground group-hover:text-primary transition-colors">
                          {ord.orderNumber}
                        </p>
                        <div className="flex gap-2 text-muted-foreground">
                          <span>{dateStr}</span>
                          <span>&bull;</span>
                          <span className="font-semibold text-foreground">{formatPrice(ord.total)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full border px-1.5 py-0.2 text-[9px] font-semibold capitalize ${getStatusColor(ord.orderStatus)}`}>
                          {ord.orderStatus}
                        </span>
                        <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
