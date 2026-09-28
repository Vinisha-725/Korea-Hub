import { z } from 'zod';

export const expenseSchema = z.object({
  amount: z.number().positive('Amount must be greater than 0'),
  description: z.string().min(1, 'Description is required'),
  vendor_id: z.string().nullable().optional(),
  date: z.string().min(1, 'Date is required'),
  paid_by: z.string().min(1, 'Payer is required'),
  payment_method_id: z.string().nullable().optional(),
  expense_type: z.enum(['solo', 'together']),
  split_type: z.enum(['equal', 'custom']),
  participants: z.array(
    z.object({
      member_id: z.string(),
      share_amount: z.number().min(0, 'Share amount cannot be negative'),
    })
  ),
});

export type ExpenseInput = z.infer<typeof expenseSchema>;

export function validateCustomSplit(totalAmount: number, shares: number[]): boolean {
  const totalShares = shares.reduce((sum, share) => sum + share, 0);
  return totalShares === totalAmount;
}

export function validateTogetherExpense(participants: string[]): boolean {
  return participants.length >= 2;
}

export function validateExpenseInput(data: unknown): { success: boolean; error?: string } {
  const result = expenseSchema.safeParse(data);
  
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0]?.message || 'Invalid expense data',
    };
  }

  // Additional validation for together expenses
  if (result.data.expense_type === 'together') {
    if (result.data.participants.length < 2) {
      return {
        success: false,
        error: 'Together expenses must have at least 2 participants',
      };
    }

    // Validate custom split
    if (result.data.split_type === 'custom') {
      const totalShares = result.data.participants.reduce((sum, p) => sum + p.share_amount, 0);
      if (totalShares !== result.data.amount) {
        return {
          success: false,
          error: `Split amounts must add up to ₩${result.data.amount.toLocaleString()}`,
        };
      }
    }
  }

  return { success: true };
}
