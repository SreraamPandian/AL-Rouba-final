import React from 'react';

const TimelinePanel = ({ title, timeline }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="flow-root">
        <ul className="-mb-8">
          {timeline.map((event, eventIdx) => (
            <li key={event.id}>
              <div className="relative pb-8">
                {eventIdx !== timeline.length - 1 ? (
                  <span
                    className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex items-start space-x-3">
                  <div className="relative">
                    <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <event.icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">{event.title}</span>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">{event.timestamp}</p>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      <p>{event.description}</p>
                      {event.user && (
                        <p className="text-xs text-gray-500 mt-1">by {event.user}</p>
                      )}
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

export default TimelinePanel;
