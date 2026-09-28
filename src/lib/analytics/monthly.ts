import { Expense, Category, MonthlyAnalytics } from '@/types';
import { startOfMonth, endOfMonth, format, eachWeekOfInterval, startOfWeek, endOfWeek } from 'date-fns';

export function calculateMonthlyAnalytics(
  expenses: Expense[],
  categories: Category[],
  month: Date
): MonthlyAnalytics {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);

  // Filter expenses for this month
  const monthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= monthStart && expenseDate <= monthEnd;
  });

  const total = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const togetherTotal = monthExpenses
    .filter((e) => e.expense_type === 'together')
    .reduce((sum, expense) => sum + expense.amount, 0);

  const soloTotal = monthExpenses
    .filter((e) => e.expense_type === 'solo')
    .reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate days in the month
  const daysInMonth = monthEnd.getDate();
  const averagePerDay = Math.round(total / daysInMonth);

  // Category breakdown
  const categoryMap = new Map<string, number>();
  monthExpenses.forEach((expense) => {
    const category = 'Other';
    categoryMap.set(category, (categoryMap.get(category) || 0) + expense.amount);
  });

  const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, amount]) => ({
    category,
    amount,
  }));

  // Weekly comparison
  const weeks = eachWeekOfInterval({ start: monthStart, end: monthEnd }, { weekStartsOn: 1 });
  const weeklyComparison = weeks.map((weekStart, index) => {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    const weekExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= weekStart && expenseDate <= weekEnd;
    });
    const amount = weekExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    return {
      week: index + 1,
      amount,
    };
  });

  return {
    month: format(month, 'MMMM'),
    year: month.getFullYear(),
    total,
    togetherTotal,
    soloTotal,
    averagePerDay,
    categoryBreakdown,
    weeklyComparison,
  };
}
