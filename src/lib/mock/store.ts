import { Member, Vendor, PaymentMethod, Category, Expense, Settlement, CalendarEvent } from '@/types';
import {
  mockMembers,
  mockVendors,
  mockPaymentMethods,
  mockCategories,
  mockExpenses,
  mockSettlements,
  mockCalendarEvents,
} from './data';

// Load from localStorage or use defaults
const loadFromStorage = <T>(key: string, defaultValue: T[]): T[] => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, data: T[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
};

// In-memory store with localStorage persistence
class MockStore {
  members: Member[] = loadFromStorage('korea-members', [...mockMembers]);
  vendors: Vendor[] = loadFromStorage('korea-vendors', [...mockVendors]);
  paymentMethods: PaymentMethod[] = loadFromStorage('korea-payment-methods', [...mockPaymentMethods]);
  categories: Category[] = loadFromStorage('korea-categories', [...mockCategories]);
  expenses: Expense[] = loadFromStorage('korea-expenses', [...mockExpenses]);
  settlements: Settlement[] = loadFromStorage('korea-settlements', [...mockSettlements]);
  calendarEvents: CalendarEvent[] = loadFromStorage('korea-calendar-events', [...mockCalendarEvents]);

  // Members
  getMembers(): Member[] {
    return this.members;
  }

  addMember(name: string): Member {
    const member: Member = {
      id: Date.now().toString(),
      name,
      created_at: new Date().toISOString(),
    };
    this.members.push(member);
    saveToStorage('korea-members', this.members);
    return member;
  }

  deleteMember(id: string): void {
    this.members = this.members.filter((m) => m.id !== id);
    saveToStorage('korea-members', this.members);
  }

  // Vendors
  getVendors(): Vendor[] {
    return this.vendors;
  }

  addVendor(name: string): Vendor {
    const vendor: Vendor = {
      id: Date.now().toString(),
      name,
      created_at: new Date().toISOString(),
    };
    this.vendors.push(vendor);
    saveToStorage('korea-vendors', this.vendors);
    return vendor;
  }

  deleteVendor(id: string): void {
    this.vendors = this.vendors.filter((v) => v.id !== id);
    saveToStorage('korea-vendors', this.vendors);
  }

  // Payment Methods
  getPaymentMethods(): PaymentMethod[] {
    return this.paymentMethods;
  }

  addPaymentMethod(name: string): PaymentMethod {
    const method: PaymentMethod = {
      id: Date.now().toString(),
      name,
      created_at: new Date().toISOString(),
    };
    this.paymentMethods.push(method);
    saveToStorage('korea-payment-methods', this.paymentMethods);
    return method;
  }

  deletePaymentMethod(id: string): void {
    this.paymentMethods = this.paymentMethods.filter((pm) => pm.id !== id);
    saveToStorage('korea-payment-methods', this.paymentMethods);
  }

  // Categories
  getCategories(): Category[] {
    return this.categories;
  }

  addCategory(name: string): Category {
    const category: Category = {
      id: Date.now().toString(),
      name,
      created_at: new Date().toISOString(),
    };
    this.categories.push(category);
    saveToStorage('korea-categories', this.categories);
    return category;
  }

  deleteCategory(id: string): void {
    this.categories = this.categories.filter((c) => c.id !== id);
    saveToStorage('korea-categories', this.categories);
  }

  // Expenses
  getExpenses(): Expense[] {
    return this.expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  addExpense(expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>): Expense {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.expenses.push(newExpense);
    saveToStorage('korea-expenses', this.expenses);
    return newExpense;
  }

  updateExpense(id: string, updates: Partial<Expense>): Expense | null {
    const index = this.expenses.findIndex((e) => e.id === id);
    if (index === -1) return null;

    this.expenses[index] = {
      ...this.expenses[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    saveToStorage('korea-expenses', this.expenses);
    return this.expenses[index];
  }

  deleteExpense(id: string): boolean {
    const index = this.expenses.findIndex((e) => e.id === id);
    if (index === -1) return false;

    this.expenses.splice(index, 1);
    saveToStorage('korea-expenses', this.expenses);
    return true;
  }

  // Settlements
  getSettlements(): Settlement[] {
    return this.settlements;
  }

  addSettlement(fromMember: string, toMember: string, amount: number): Settlement {
    const settlement: Settlement = {
      id: Date.now().toString(),
      from_member: fromMember,
      to_member: toMember,
      amount,
      settled_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
    this.settlements.push(settlement);
    saveToStorage('korea-settlements', this.settlements);
    return settlement;
  }

  deleteSettlement(id: string): boolean {
    const index = this.settlements.findIndex((s) => s.id === id);
    if (index === -1) return false;

    this.settlements.splice(index, 1);
    saveToStorage('korea-settlements', this.settlements);
    return true;
  }

  // Calendar Events
  getCalendarEvents(): CalendarEvent[] {
    return this.calendarEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  getEventsForDate(date: string): CalendarEvent[] {
    return this.calendarEvents.filter((e) => e.date === date);
  }

  addCalendarEvent(event: Omit<CalendarEvent, 'id' | 'created_at'>): CalendarEvent {
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    this.calendarEvents.push(newEvent);
    saveToStorage('korea-calendar-events', this.calendarEvents);
    return newEvent;
  }

  updateCalendarEvent(id: string, updates: Partial<CalendarEvent>): CalendarEvent | null {
    const index = this.calendarEvents.findIndex((e) => e.id === id);
    if (index === -1) return null;

    this.calendarEvents[index] = {
      ...this.calendarEvents[index],
      ...updates,
    };
    saveToStorage('korea-calendar-events', this.calendarEvents);
    return this.calendarEvents[index];
  }

  deleteCalendarEvent(id: string): boolean {
    const index = this.calendarEvents.findIndex((e) => e.id === id);
    if (index === -1) return false;

    this.calendarEvents.splice(index, 1);
    saveToStorage('korea-calendar-events', this.calendarEvents);
    return true;
  }
}

export const mockStore = new MockStore();
