'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Trash2, Users, CreditCard, Tag, Store } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockStore } from '@/lib/mock/store';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'members' | 'vendors' | 'payment' | 'categories'>('members');
  const [addOpen, setAddOpen] = useState(false);
  const [newItem, setNewItem] = useState('');

  const members = mockStore.getMembers();
  const vendors = mockStore.getVendors();
  const paymentMethods = mockStore.getPaymentMethods();
  const categories = mockStore.getCategories();

  const addItem = () => {
    if (!newItem.trim()) return;
    switch (activeTab) {
      case 'members':
        mockStore.addMember(newItem);
        break;
      case 'vendors':
        mockStore.addVendor(newItem);
        break;
      case 'payment':
        mockStore.addPaymentMethod(newItem);
        break;
      case 'categories':
        mockStore.addCategory(newItem);
        break;
    }
    setNewItem('');
    setAddOpen(false);
    router.refresh();
  };

  const deleteItem = (id: string) => {
    switch (activeTab) {
      case 'members':
        // Don't allow deleting all members
        if (members.length <= 1) {
          alert('Cannot delete the last member');
          return;
        }
        mockStore.deleteMember(id);
        break;
      case 'vendors':
        mockStore.deleteVendor(id);
        break;
      case 'payment':
        mockStore.deletePaymentMethod(id);
        break;
      case 'categories':
        mockStore.deleteCategory(id);
        break;
    }
    router.refresh();
  };

  const tabs = [
    { id: 'members' as const, label: 'People', icon: Users },
    { id: 'vendors' as const, label: 'Vendors', icon: Store },
    { id: 'payment' as const, label: 'Payment Methods', icon: CreditCard },
    { id: 'categories' as const, label: 'Categories', icon: Tag },
  ];

  const getCurrentItems = () => {
    switch (activeTab) {
      case 'members': return members;
      case 'vendors': return vendors;
      case 'payment': return paymentMethods;
      case 'categories': return categories;
    }
  };

  const getCurrentLabel = () => {
    switch (activeTab) {
      case 'members': return 'Person';
      case 'vendors': return 'Vendor';
      case 'payment': return 'Payment Method';
      case 'categories': return 'Category';
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto animate-in">
      <h1 className="text-2xl font-semibold mb-8">Settings</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id)}
              className="gap-2"
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{tabs.find((t) => t.id === activeTab)?.label}</CardTitle>
            <Button size="sm" onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add {getCurrentLabel()}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {getCurrentItems().length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No items yet</p>
          ) : (
            <div className="space-y-2">
              {getCurrentItems().map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted"
                >
                  <span>{item.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add {getCurrentLabel()}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder={`Enter ${getCurrentLabel().toLowerCase()} name`}
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addItem}>Add</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
