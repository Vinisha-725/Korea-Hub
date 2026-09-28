'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { mockStore } from '@/lib/mock/store';
import { ExpenseType, SplitType } from '@/types';
import { useRouter } from 'next/navigation';

export function AddExpenseDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [vendor, setVendor] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [paidBy, setPaidBy] = useState('');
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [expenseType, setExpenseType] = useState<ExpenseType>('together');
  const [splitType, setSplitType] = useState<SplitType>('equal');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

  const members = mockStore.getMembers();
  const paymentMethods = mockStore.getPaymentMethods();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !description || !paidBy) {
      alert('Please fill in all required fields');
      return;
    }

    if (expenseType === 'together' && selectedParticipants.length < 2) {
      alert('Please select at least 2 participants for together expenses');
      return;
    }

    const participants = expenseType === 'solo'
      ? [{ member_id: paidBy, share_amount: parseInt(amount) }]
      : selectedParticipants.map((id) => ({
          member_id: id,
          share_amount: splitType === 'equal' ? Math.floor(parseInt(amount) / selectedParticipants.length) : 0,
        }));

    mockStore.addExpense({
      amount: parseInt(amount),
      description,
      vendor_id: null, // Store vendor as string for now
      date,
      paid_by: paidBy,
      payment_method_id: paymentMethodId || null,
      expense_type: expenseType,
      split_type: splitType,
      participants,
    });

    setOpen(false);
    router.refresh();
    // Reset form
    setAmount('');
    setDescription('');
    setVendor('');
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setPaidBy('');
    setPaymentMethodId('');
    setExpenseType('together');
    setSplitType('equal');
    setSelectedParticipants([]);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Add Expense
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <div className="flex items-center">
                <span className="mr-2">₩</span>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">What did you buy?</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Item description"
                required
              />
            </div>

            <div>
              <Label htmlFor="vendor">Vendor</Label>
              <Input
                id="vendor"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                placeholder="e.g., CU, Emart, Bus"
              />
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="paidBy">Paid by</Label>
              <Select value={paidBy} onValueChange={(value) => setPaidBy(value || '')}>
                <SelectTrigger id="paidBy">
                  <SelectValue placeholder="Select person" />
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

            <div>
              <Label htmlFor="paymentMethod">Payment method</Label>
              <Select value={paymentMethodId} onValueChange={(value) => setPaymentMethodId(value || '')}>
                <SelectTrigger id="paymentMethod">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      {method.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Expense type</Label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="expenseType"
                    value="solo"
                    checked={expenseType === 'solo'}
                    onChange={(e) => setExpenseType(e.target.value as ExpenseType)}
                  />
                  Solo
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="expenseType"
                    value="together"
                    checked={expenseType === 'together'}
                    onChange={(e) => setExpenseType(e.target.value as ExpenseType)}
                  />
                  Together
                </label>
              </div>
            </div>

            {expenseType === 'together' && (
              <>
                <div>
                  <Label>Who should split this expense?</Label>
                  <div className="space-y-2 mt-2">
                    {members.map((member) => (
                      <label key={member.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedParticipants.includes(member.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedParticipants([...selectedParticipants, member.id]);
                            } else {
                              setSelectedParticipants(selectedParticipants.filter((id) => id !== member.id));
                            }
                          }}
                        />
                        {member.name}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Split method</Label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="splitType"
                        value="equal"
                        checked={splitType === 'equal'}
                        onChange={(e) => setSplitType(e.target.value as SplitType)}
                      />
                      Equal
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="splitType"
                        value="custom"
                        checked={splitType === 'custom'}
                        onChange={(e) => setSplitType(e.target.value as SplitType)}
                      />
                      Custom
                    </label>
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-2 justify-end pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Expense</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
