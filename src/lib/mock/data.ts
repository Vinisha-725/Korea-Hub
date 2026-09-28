import { Member, Vendor, PaymentMethod, Category, Expense, Settlement, CalendarEvent } from '@/types';

export const mockMembers: Member[] = [
  { id: '1', name: 'Vinisha', created_at: '2026-09-01T00:00:00Z' },
  { id: '2', name: 'Ishaan', created_at: '2026-09-01T00:00:00Z' },
];

export const mockVendors: Vendor[] = [
  { id: '1', name: 'Convenience Store', created_at: '2026-09-01T00:00:00Z' },
  { id: '2', name: 'LG U+', created_at: '2026-09-01T00:00:00Z' },
  { id: '3', name: 'Bus', created_at: '2026-09-01T00:00:00Z' },
  { id: '4', name: 'Uber', created_at: '2026-09-01T00:00:00Z' },
  { id: '5', name: 'Choongman Chicken', created_at: '2026-09-01T00:00:00Z' },
  { id: '6', name: "Mom's Touch", created_at: '2026-09-01T00:00:00Z' },
  { id: '7', name: 'CU', created_at: '2026-09-01T00:00:00Z' },
  { id: '8', name: 'Emart', created_at: '2026-09-01T00:00:00Z' },
];

export const mockPaymentMethods: PaymentMethod[] = [
  { id: '1', name: 'Cash', created_at: '2026-09-01T00:00:00Z' },
  { id: '2', name: 'Niyo Global', created_at: '2026-09-01T00:00:00Z' },
  { id: '3', name: 'Card', created_at: '2026-09-01T00:00:00Z' },
  { id: '4', name: 'Bank Transfer', created_at: '2026-09-01T00:00:00Z' },
];

export const mockCategories: Category[] = [
  { id: '1', name: 'Food', created_at: '2026-09-01T00:00:00Z' },
  { id: '2', name: 'Transport', created_at: '2026-09-01T00:00:00Z' },
  { id: '3', name: 'Shopping', created_at: '2026-09-01T00:00:00Z' },
  { id: '4', name: 'Study', created_at: '2026-09-01T00:00:00Z' },
  { id: '5', name: 'Accommodation', created_at: '2026-09-01T00:00:00Z' },
  { id: '6', name: 'SIM / Internet', created_at: '2026-09-01T00:00:00Z' },
  { id: '7', name: 'Entertainment', created_at: '2026-09-01T00:00:00Z' },
  { id: '8', name: 'Other', created_at: '2026-09-01T00:00:00Z' },
];

export const mockExpenses: Expense[] = [];

export const mockSettlements: Settlement[] = [];

export const mockCalendarEvents: CalendarEvent[] = [];
