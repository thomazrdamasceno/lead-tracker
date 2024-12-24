import React from 'react';
import { Activity } from 'lucide-react';

interface Event {
  id: string;
  event_type: string;
  page_url: string;
  data: Record<string, any>;
  created_at: string;
}

interface LeadTimelineProps {
  events: Event[];
}

export const LeadTimeline: React.FC<LeadTimelineProps> = ({ events }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Activity className="w-5 h-5 text-gray-400" />
        <h3 className="text-lg font-medium">Activity Timeline</h3>
      </div>

      <div className="flow-root">
        <ul role="list" className="-mb-8">
          {events.map((event, eventIdx) => (
            <li key={event.id}>
              <div className="relative pb-8">
                {eventIdx !== events.length - 1 ? (
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                      <Activity className="h-4 w-4 text-white" />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-900">
                        {event.event_type}
                        {event.page_url && (
                          <span className="text-gray-500">
                            {' '}on {event.page_url}
                          </span>
                        )}
                      </p>
                      {Object.keys(event.data).length > 0 && (
                        <pre className="mt-1 text-xs text-gray-500 bg-gray-50 p-2 rounded-md overflow-auto">
                          {JSON.stringify(event.data, null, 2)}
                        </pre>
                      )}
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      {new Date(event.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};