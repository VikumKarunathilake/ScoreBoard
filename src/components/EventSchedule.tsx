import { Calendar } from 'lucide-react';
import { useStore } from '../store';

export function EventSchedule() {
  const { events } = useStore();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Event Schedule</h2>
        <Calendar className="w-8 h-8 text-blue-500" />
      </div>
      <div className="space-y-4">
        {events.map((event, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="font-medium text-gray-700">{event.name}</span>
            </div>
            <span className="text-gray-500">{event.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}