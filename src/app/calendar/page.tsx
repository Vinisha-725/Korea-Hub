import { Calendar } from '@/components/calendar/Calendar';

export default function CalendarPage() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-8">Class Calendar</h1>
      <Calendar />
    </div>
  );
}
