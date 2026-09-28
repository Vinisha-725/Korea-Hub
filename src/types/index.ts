export type ExpenseType = 'solo' | 'together';
export type SplitType = 'equal' | 'custom';

export interface Member {
  id: string;
  name: string;
  created_at: string;
}

export interface Vendor {
  id: string;
  name: string;
  created_at: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export interface ExpenseParticipant {
  member_id: string;
  share_amount: number;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  vendor_id: string | null;
  date: string;
  paid_by: string;
  payment_method_id: string | null;
  expense_type: ExpenseType;
  split_type: SplitType;
  participants: ExpenseParticipant[];
  created_at: string;
  updated_at: string;
}

export interface Settlement {
  id: string;
  from_member: string;
  to_member: string;
  amount: number;
  settled_at: string | null;
  created_at: string;
}

export interface Balance {
  memberId: string;
  memberName: string;
  balance: number; // Positive = owed money, Negative = owes money
}

export interface SettlementTransaction {
  from: string;
  to: string;
  amount: number;
}

export interface ExpenseWithDetails extends Expense {
  vendor: Vendor | null;
  payment_method: PaymentMethod | null;
  payer: Member;
  participant_details: Array<{
    member: Member;
    share_amount: number;
  }>;
}

export interface WeeklyAnalytics {
  startDate: string;
  endDate: string;
  total: number;
  averagePerDay: number;
  categoryBreakdown: Array<{
    category: string;
    amount: number;
  }>;
  dailySpending: Array<{
    date: string;
    amount: number;
  }>;
}

export interface MonthlyAnalytics {
  month: string;
  year: number;
  total: number;
  togetherTotal: number;
  soloTotal: number;
  averagePerDay: number;
  categoryBreakdown: Array<{
    category: string;
    amount: number;
  }>;
  weeklyComparison: Array<{
    week: number;
    amount: number;
  }>;
}

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  type: 'class' | 'task' | 'trip' | 'other';
  time: string | null;
  completed: boolean;
  created_at: string;
}

export interface DayBusyness {
  date: string;
  totalEvents: number;
  completedEvents: number;
  busynessLevel: 'empty' | 'light' | 'moderate' | 'heavy' | 'packed';
}
