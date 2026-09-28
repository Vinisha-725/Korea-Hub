import { Expense, Category, WeeklyAnalytics } from '@/types';
import { startOfWeek, endOfWeek, format, eachDayOfInterval, isSameDay } from 'date-fns';

export function calculateWeeklyAnalytics(
  expenses: Expense[],
  categories: Category[],
  weekStart: Date
): WeeklyAnalytics {
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 }); // Monday start

  // Filter expenses for this week
  const weekExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= weekStart && expenseDate <= weekEnd;
  });

  const total = weekExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate days in the week
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const averagePerDay = Math.round(total / days.length);

  // Category breakdown
  const categoryMap = new Map<string, number>();
  weekExpenses.forEach((expense) => {
    // For now, we'll use a simple categorization based on vendor
    // In a real app, this would come from the expense's category_id
    const category = 'Other'; // Default
    categoryMap.set(category, (categoryMap.get(category) || 0) + expense.amount);
  });

  const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, amount]) => ({
    category,
    amount,
  }));

  // Daily spending
  const dailySpending = days.map((day) => {
    const dayExpenses = weekExpenses.filter((expense) => isSameDay(new Date(expense.date), day));
    const amount = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    return {
      date: format(day, 'EEE'),
      amount,
    };
  });

  return {
    startDate: format(weekStart, 'MMM d'),
    endDate: format(weekEnd, 'MMM d'),
    total,
    averagePerDay,
    categoryBreakdown,
    dailySpending,
  };
}
