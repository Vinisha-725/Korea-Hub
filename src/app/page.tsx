import { format } from 'date-fns';
import { mockStore } from '@/lib/mock/store';
import { calculateBalances, calculateSettlements } from '@/lib/expenses/settlement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const expenses = mockStore.getExpenses();
  const members = mockStore.getMembers();
  const balances = calculateBalances(expenses, members);
  const settlements = calculateSettlements(balances);

  const currentUser = members[0];
  const userBalance = balances.find((b) => b.memberId === currentUser?.id);
  const thisWeekExpenses = expenses.filter((e) => {
    const expenseDate = new Date(e.date);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return expenseDate >= weekAgo;
  });
  const thisWeekTotal = thisWeekExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-1">Korea Hub 🇰🇷</h1>
        <p className="text-muted-foreground">
          Good evening, {currentUser?.name}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
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
            <p className="text-xs text-muted-foreground mt-1">spent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current group
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Korea 2026</div>
            <p className="text-xs text-muted-foreground mt-1">
              {members.length} members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Your balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userBalance && userBalance.balance !== 0 ? (
              <div className="text-2xl font-bold">
                {userBalance.balance > 0 ? (
                  <span className="text-green-600">
                    You are owed ₩{userBalance.balance.toLocaleString()}
                  </span>
                ) : (
                  <span className="text-red-600">
                    You owe ₩{Math.abs(userBalance.balance).toLocaleString()}
                  </span>
                )}
              </div>
            ) : (
              <div className="text-2xl font-bold text-muted-foreground">
                Settled
              </div>
            )}
            {settlements.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {settlements.length} settlement{settlements.length !== 1 ? 's' : ''} pending
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Next class</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Coming soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Coming soon</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
