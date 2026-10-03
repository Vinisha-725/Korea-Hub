'use client';

import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockStore } from '@/lib/mock/store';
import { CalendarEvent } from '@/types';
import { calculateDayBusyness, getBusynessColor } from '@/lib/calendar/busyness';
import { useRouter } from 'next/navigation';

export function Calendar() {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState<'class' | 'task' | 'trip' | 'other'>('task');
  const [eventTime, setEventTime] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    setEvents(mockStore.getCalendarEvents());
  }, [refreshKey]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Add padding days for full week view
  const startDayOfWeek = monthStart.getDay();
  const paddingDays = Array.from({ length: startDayOfWeek }, (_, i) => i);

  const handlePreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddEvent = () => {
    if (!selectedDate || !eventTitle) {
      alert('Please select a date and enter a title');
      return;
    }

    mockStore.addCalendarEvent({
      date: format(selectedDate, 'yyyy-MM-dd'),
      title: eventTitle,
      type: eventType,
      time: eventTime || null,
      completed: false,
    });

    setAddEventOpen(false);
    setEventTitle('');
    setEventType('task');
    setEventTime('');
    setRefreshKey(prev => prev + 1);
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((e) => e.date === format(date, 'yyyy-MM-dd'));
  };

  const getBusynessForDate = (date: Date) => {
    const dayEvents = getEventsForDate(date);
    return calculateDayBusyness(dayEvents);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">
              {format(currentMonth, 'MMMM yyyy')}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {paddingDays.map((_, index) => (
              <div key={`padding-${index}`} />
            ))}
            {calendarDays.map((date) => {
              const dayEvents = getEventsForDate(date);
              const busyness = getBusynessForDate(date);
              const isSelected = selectedDate && isSameDay(date, selectedDate);
              const isToday = isSameDay(date, new Date());

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => handleDateClick(date)}
                  className={`
                    aspect-square rounded-lg border-2 p-2 text-sm transition-colors hover:opacity-80
                    ${getBusynessColor(busyness.busynessLevel)}
                    ${isSelected ? 'ring-2 ring-offset-2 ring-primary' : ''}
                    ${isToday ? 'font-bold' : ''}
                  `}
                >
                  <div className="text-center">{format(date, 'd')}</div>
                  {dayEvents.length > 0 && (
                    <div className="text-xs mt-1 text-center">
                      {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {selectedDate && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{format(selectedDate, 'MMMM d, yyyy')}</CardTitle>
              <Button size="sm" onClick={() => setAddEventOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {getEventsForDate(selectedDate).length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No events for this day</p>
            ) : (
              <div className="space-y-2">
                {getEventsForDate(selectedDate).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={event.completed}
                        onChange={() => {
                          mockStore.updateCalendarEvent(event.id, { completed: !event.completed });
                          setRefreshKey(prev => prev + 1);
                        }}
                        className="h-4 w-4"
                      />
                      <div>
                        <div className={`font-medium ${event.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {event.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {event.type} {event.time && `· ${event.time}`}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        mockStore.deleteCalendarEvent(event.id);
                        setRefreshKey(prev => prev + 1);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={addEventOpen} onOpenChange={setAddEventOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Event title"
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={eventType} onValueChange={(value: any) => setEventType(value)}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="class">Class</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="trip">Trip</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="time">Time (optional)</Label>
              <Input
                id="time"
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setAddEventOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEvent}>Add Event</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
