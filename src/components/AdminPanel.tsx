import { useState } from 'react';
import { useStore } from '../store';
import { wsClient } from '../websocket';
import { Settings, Save } from 'lucide-react';
import type { House, Event } from '../types';
import { Calendar } from 'lucide-react';


export function AdminPanel() {
  const { houses, events } = useStore();
  const [scores, setScores] = useState<{ [key: string]: number }>(
    Object.fromEntries(houses.map((h: House) => [h.name, h.score]))
  );
  const [eventList, setEventList] = useState<Event[]>(events);

  const handleScoreChange = (houseName: string, score: number) => {
    setScores(prev => ({ ...prev, [houseName]: score }));
  };

  const handleEventChange = (index: number, field: keyof Event, value: string) => {
    const newEvents = [...eventList];
    newEvents[index] = { ...newEvents[index], [field]: value };
    setEventList(newEvents);
  };

  const handleScoreSubmit = () => {
    wsClient.send({
      type: 'UPDATE_SCORES',
      data: scores,
    });
  };

  const handleEventSubmit = () => {
    wsClient.send({
      type: 'UPDATE_EVENTS',
      data: eventList.map(event => `${event.name} - ${event.time}`),
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Score Management</h2>
          <Settings className="w-8 h-8 text-purple-500" />
        </div>
        <div className="space-y-4">
          {houses.map((house: House) => (
            <div key={house.name} className="flex items-center space-x-4">
              <span className="w-32 font-medium text-gray-700">{house.name}</span>
              <input
                type="number"
                value={scores[house.name]}
                onChange={(e) => handleScoreChange(house.name, parseInt(e.target.value))}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200"
              />
            </div>
          ))}
          <button
            onClick={handleScoreSubmit}
            className="mt-4 w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Update Scores</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Event Management</h2>
          <Calendar className="w-8 h-8 text-green-500" />
        </div>
        <div className="space-y-4">
          {eventList.map((event, index) => (
            <div key={index} className="flex items-center space-x-4">
              <input
                type="text"
                value={event.name}
                onChange={(e) => handleEventChange(index, 'name', e.target.value)}
                placeholder="Event Name"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
              />
              <input
                type="text"
                value={event.time}
                onChange={(e) => handleEventChange(index, 'time', e.target.value)}
                placeholder="Event Time"
                className="w-32 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
              />
            </div>
          ))}
          <button
            onClick={() => setEventList([...eventList, { name: '', time: '' }])}
            className="mt-2 text-green-600 hover:text-green-700 font-medium"
          >
            + Add Event
          </button>
          <button
            onClick={handleEventSubmit}
            className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>Update Events</span>
          </button>
        </div>
      </div>
    </div>
  );
}