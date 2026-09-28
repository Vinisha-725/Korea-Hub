import { Expense, Member, Balance, SettlementTransaction } from '@/types';

/**
 * Calculate net balances for all members based on expenses
 * Positive balance = member is owed money
 * Negative balance = member owes money
 */
export function calculateBalances(expenses: Expense[], members: Member[]): Balance[] {
  const balances: Record<string, number> = {};

  // Initialize all members with 0 balance
  members.forEach((member) => {
    balances[member.id] = 0;
  });

  expenses.forEach((expense) => {
    // Solo expenses don't affect balances between members
    if (expense.expense_type === 'solo') {
      return;
    }

    // Payer receives credit for the full amount
    balances[expense.paid_by] = (balances[expense.paid_by] || 0) + expense.amount;

    // Each participant owes their share
    expense.participants.forEach((participant) => {
      balances[participant.member_id] = (balances[participant.member_id] || 0) - participant.share_amount;
    });
  });

  return members.map((member) => ({
    memberId: member.id,
    memberName: member.name,
    balance: balances[member.id] || 0,
  }));
}

/**
 * Calculate optimal settlement transactions to settle all balances
 * Uses a greedy algorithm to minimize the number of transactions
 */
export function calculateSettlements(balances: Balance[]): SettlementTransaction[] {
  const transactions: SettlementTransaction[] = [];

  // Separate creditors (positive balance) and debtors (negative balance)
  const creditors = balances.filter((b) => b.balance > 0).map((b) => ({ ...b }));
  const debtors = balances.filter((b) => b.balance < 0).map((b) => ({ ...b, balance: -b.balance }));

  // Sort by amount (largest first) for optimal matching
  creditors.sort((a, b) => b.balance - a.balance);
  debtors.sort((a, b) => b.balance - a.balance);

  let i = 0; // creditor index
  let j = 0; // debtor index

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];

    const amount = Math.min(creditor.balance, debtor.balance);

    if (amount > 0) {
      transactions.push({
        from: debtor.memberName,
        to: creditor.memberName,
        amount,
      });
    }

    creditor.balance -= amount;
    debtor.balance -= amount;

    if (creditor.balance === 0) i++;
    if (debtor.balance === 0) j++;
  }

  return transactions;
}

/**
 * Simplify chain settlements
 * If A owes B and B owes C the same amount, simplify to A owes C
 */
export function simplifySettlements(transactions: SettlementTransaction[]): SettlementTransaction[] {
  if (transactions.length < 2) return transactions;

  const simplified = [...transactions];
  let changed = true;

  while (changed && simplified.length > 1) {
    changed = false;

    for (let i = 0; i < simplified.length; i++) {
      for (let j = 0; j < simplified.length; j++) {
        if (i === j) continue;

        const tx1 = simplified[i];
        const tx2 = simplified[j];

        // If A owes B and B owes C
        if (tx1.to === tx2.from && tx1.amount === tx2.amount) {
          // Simplify to A owes C
          simplified[i] = {
            from: tx1.from,
            to: tx2.to,
            amount: tx1.amount,
          };
          simplified.splice(j, 1);
          changed = true;
          break;
        }
      }
      if (changed) break;
    }
  }

  return simplified;
}
