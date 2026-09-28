'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Trash2, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { mockStore } from '@/lib/mock/store';
import { useRouter } from 'next/navigation';

interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
}

export default function TodoPage() {
  const router = useRouter();
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (!newTodo.trim()) return;
    const todo: TodoItem = {
      id: Date.now().toString(),
      title: newTodo,
      completed: false,
      created_at: new Date().toISOString(),
    };
    setTodos([...todos, todo]);
    localStorage.setItem('korea-todos', JSON.stringify([...todos, todo]));
    setNewTodo('');
    setAddOpen(false);
  };

  const toggleTodo = (id: string) => {
    const updated = todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTodos(updated);
    localStorage.setItem('korea-todos', JSON.stringify(updated));
  };

  const deleteTodo = (id: string) => {
    const updated = todos.filter((t) => t.id !== id);
    setTodos(updated);
    localStorage.setItem('korea-todos', JSON.stringify(updated));
  };

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('korea-todos');
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto animate-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Trip Planner</h1>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add task
        </Button>
      </div>

      {todos.length === 0 ? (
        <Card>
          <CardContent className="p-16 text-center text-muted-foreground">
            <p className="text-lg">No tasks yet</p>
            <p className="text-sm mt-2">Add your first task to get started</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {todos.map((todo) => (
            <Card key={todo.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        todo.completed
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      {todo.completed && <Check className="h-4 w-4" />}
                    </button>
                    <span
                      className={`flex-1 ${
                        todo.completed ? 'line-through text-muted-foreground' : ''
                      }`}
                    >
                      {todo.title}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="What do you need to do?"
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addTodo}>Add</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
