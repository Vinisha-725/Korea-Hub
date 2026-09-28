'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { mockStore } from '@/lib/mock/store';
import { Expense, Member, Vendor, PaymentMethod } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EditExpenseDialog } from './EditExpenseDialog';
import { DeleteExpenseDialog } from './DeleteExpenseDialog';

export function ExpenseList() {
  const expenses = mockStore.getExpenses();
  const members = mockStore.getMembers();
  const vendors = mockStore.getVendors();

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);

  // Group expenses by date
  const groupedExpenses = expenses.reduce((groups, expense) => {
    const date = expense.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(expense);
    return groups;
  }, {} as Record<string, Expense[]>);

  const sortedDates = Object.keys(groupedExpenses).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  const getMemberName = (id: string) => members.find((m) => m.id === id)?.name || 'Unknown';
  const getVendorName = (id: string | null) => vendors.find((v) => v.id === id)?.name || '';

  return (
    <>
      {sortedDates.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No expenses yet. Add your first expense to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                {format(new Date(date), 'MMMM d').toUpperCase()}
              </h3>
              <div className="space-y-3">
                {groupedExpenses[date].map((expense) => (
                  <Card key={expense.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{expense.description}</h4>
                            {expense.expense_type === 'solo' && (
                              <Badge variant="secondary" className="text-xs">
                                Solo
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {getVendorName(expense.vendor_id)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Paid by {getMemberName(expense.paid_by)}
                            {expense.expense_type === 'together' && (
                              <span> · Together</span>
                            )}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-semibold">
                            ₩{expense.amount.toLocaleString()}
                          </p>
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setEditingExpense(expense)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeletingExpense(expense)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {editingExpense && (
        <EditExpenseDialog
          expense={editingExpense}
          open={!!editingExpense}
          onOpenChange={(open: boolean) => !open && setEditingExpense(null)}
        />
      )}

      {deletingExpense && (
        <DeleteExpenseDialog
          expense={deletingExpense}
          open={!!deletingExpense}
          onOpenChange={(open: boolean) => !open && setDeletingExpense(null)}
        />
      )}
    </>
  );
}
