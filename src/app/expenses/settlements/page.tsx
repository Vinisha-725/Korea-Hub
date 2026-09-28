import { mockStore } from '@/lib/mock/store';
import { calculateBalances, calculateSettlements } from '@/lib/expenses/settlement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function SettlementsPage() {
  const expenses = mockStore.getExpenses();
  const members = mockStore.getMembers();
  const balances = calculateBalances(expenses, members);
  const settlements = calculateSettlements(balances);

  const togetherExpenses = expenses.filter((e) => e.expense_type === 'together');
  const totalGroupSpending = togetherExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-8">Settlements</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total group spending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₩{totalGroupSpending.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Balances</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {balances.map((balance) => (
            <Card key={balance.memberId}>
              <CardHeader>
                <CardTitle>{balance.memberName}</CardTitle>
              </CardHeader>
              <CardContent>
                {balance.balance > 0 ? (
                  <p className="text-green-600 font-semibold">
                    You are owed ₩{balance.balance.toLocaleString()}
                  </p>
                ) : balance.balance < 0 ? (
                  <p className="text-red-600 font-semibold">
                    You owe ₩{Math.abs(balance.balance).toLocaleString()}
                  </p>
                ) : (
                  <p className="text-muted-foreground">Settled</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Who owes whom</h2>
        {settlements.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              All settled up! No pending settlements.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {settlements.map((settlement, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-lg font-medium mb-2">
                      {settlement.from} owes {settlement.to}
                    </p>
                    <p className="text-3xl font-bold mb-4">
                      ₩{settlement.amount.toLocaleString()}
                    </p>
                    <Button variant="outline" className="w-full">
                      Mark paid
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Settlement history</h2>
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No settlements recorded yet.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
