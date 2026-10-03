'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Expense } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockStore } from '@/lib/mock/store';
import { useRouter } from 'next/navigation';
import { ExpenseType, SplitType } from '@/types';

interface EditExpenseDialogProps {
  expense: Expense;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditExpenseDialog({ expense, open, onOpenChange }: EditExpenseDialogProps) {
  const router = useRouter();
  const [amount, setAmount] = useState(expense.amount.toString());
  const [description, setDescription] = useState(expense.description);
  const [vendor, setVendor] = useState('');
  const [date, setDate] = useState(expense.date);
  const [paidBy, setPaidBy] = useState(expense.paid_by);
  const [paymentMethodId, setPaymentMethodId] = useState(expense.payment_method_id || '');
  const [expenseType, setExpenseType] = useState<ExpenseType>(expense.expense_type);
  const [splitType, setSplitType] = useState<SplitType>(expense.split_type);

  const members = mockStore.getMembers();
  const paymentMethods = mockStore.getPaymentMethods();

  const handleUpdate = () => {
    if (!amount || !description || !paidBy) {
      alert('Please fill in all required fields');
      return;
    }

    const participants = members.map((m) => ({
      member_id: m.id,
      share_amount: 0, // Will be calculated based on split type
    }));

    mockStore.updateExpense(expense.id, {
      amount: parseInt(amount),
      description,
      vendor_id: null,
      date,
      paid_by: paidBy,
      payment_method_id: paymentMethodId || null,
      expense_type: expenseType,
      split_type: splitType,
      participants,
    });

    onOpenChange(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount (₩)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What was this expense for?"
            />
          </div>
          <div>
            <Label htmlFor="vendor">Vendor</Label>
            <Input
              id="vendor"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              placeholder="Where did you spend?"
            />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="paidBy">Paid by</Label>
            <Select value={paidBy} onValueChange={(value) => setPaidBy(value || '')}>
              <SelectTrigger id="paidBy">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
