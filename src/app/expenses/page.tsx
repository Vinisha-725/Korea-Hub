import { format } from 'date-fns';
import { mockStore } from '@/lib/mock/store';
import { calculateBalances, calculateSettlements } from '@/lib/expenses/settlement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { AddExpenseDialog } from '@/components/expenses/AddExpenseDialog';
import Link from 'next/link';

export default function ExpensesPage() {
  const expenses = mockStore.getExpenses();
  const members = mockStore.getMembers();
  const balances = calculateBalances(expenses, members);
  const settlements = calculateSettlements(balances);

  const currentUser = members[0];
  const userBalance = balances.find((b) => b.memberId === currentUser?.id);
  const thisMonthExpenses = expenses.filter((e) => {
    const expenseDate = new Date(e.date);
    const now = new Date();
    return (
      expenseDate.getMonth() === now.getMonth() &&
      expenseDate.getFullYear() === now.getFullYear()
    );
  });
  const totalSpent = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  const thisWeekExpenses = expenses.filter((e) => {
    const expenseDate = new Date(e.date);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return expenseDate >= weekAgo;
  });
  const thisWeekTotal = thisWeekExpenses.reduce((sum, e) => sum + e.amount, 0);

  const userExpenses = expenses.filter((e) => e.paid_by === currentUser?.id);
  const userSpending = userExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto animate-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Expenses</h1>
          <p className="text-muted-foreground">
            {format(new Date(), 'MMMM yyyy')}
          </p>
        </div>
        <AddExpenseDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₩{totalSpent.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₩{thisWeekTotal.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Your spending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₩{userSpending.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              You owe / are owed
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userBalance && userBalance.balance !== 0 ? (
              <div className="text-2xl font-bold">
                {userBalance.balance > 0 ? (
                  <span className="text-green-600">
                    +₩{userBalance.balance.toLocaleString()}
                  </span>
                ) : (
                  <span className="text-red-600">
                    -₩{Math.abs(userBalance.balance).toLocaleString()}
                  </span>
                )}
              </div>
            ) : (
              <div className="text-2xl font-bold text-muted-foreground">
                ₩0
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 mb-4">
        <Link href="/expenses/settlements">
          <Button variant="outline">Settlements</Button>
        </Link>
        <Link href="/expenses/analytics">
          <Button variant="outline">Analytics</Button>
        </Link>
      </div>

      <h2 className="text-lg font-semibold mb-4">Recent expenses</h2>
      <ExpenseList />
    </div>
  );
}
