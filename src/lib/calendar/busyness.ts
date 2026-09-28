import { CalendarEvent, DayBusyness } from '@/types';

export function calculateDayBusyness(events: CalendarEvent[]): DayBusyness {
  const totalEvents = events.length;
  const completedEvents = events.filter((e) => e.completed).length;

  let busynessLevel: DayBusyness['busynessLevel'] = 'empty';

  if (totalEvents === 0) {
    busynessLevel = 'empty';
  } else if (totalEvents <= 2) {
    busynessLevel = 'light';
  } else if (totalEvents <= 4) {
    busynessLevel = 'moderate';
  } else if (totalEvents <= 6) {
    busynessLevel = 'heavy';
  } else {
    busynessLevel = 'packed';
  }

  return {
    date: events[0]?.date || '',
    totalEvents,
    completedEvents,
    busynessLevel,
  };
}

export function getBusynessColor(level: DayBusyness['busynessLevel']): string {
  switch (level) {
    case 'empty':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'light':
      return 'bg-green-200 text-green-900 border-green-300';
    case 'moderate':
      return 'bg-yellow-200 text-yellow-900 border-yellow-300';
    case 'heavy':
      return 'bg-orange-200 text-orange-900 border-orange-300';
    case 'packed':
      return 'bg-red-200 text-red-900 border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}
