'use client';

import { Assignment } from '../page';

interface AssignmentsDisplayProps {
  assignments: Assignment[];
  onReset: () => void;
}

export default function AssignmentsDisplay({ assignments, onReset }: AssignmentsDisplayProps) {
  const dueAssignments = assignments.filter(a => a.name.toLowerCase().includes('is due'));
  const upcomingAssignments = assignments.filter(a => !a.name.toLowerCase().includes('is due'));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-4xl font-bold">{assignments.length}</div>
          <div className="text-purple-100">Total Assignments</div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <div className="text-3xl mb-2">📅</div>
          <div className="text-4xl font-bold">{dueAssignments.length}</div>
          <div className="text-red-100">Due Assignments</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="text-3xl mb-2">📋</div>
          <div className="text-4xl font-bold">{upcomingAssignments.length}</div>
          <div className="text-green-100">Upcoming</div>
        </div>
      </div>

      {/* Due Assignments */}
      {dueAssignments.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📅</span> Due Assignments
          </h2>
          <div className="space-y-4">
            {dueAssignments.map((assignment, index) => (
              <AssignmentCard key={index} assignment={assignment} isDue={true} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Assignments */}
      {upcomingAssignments.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📋</span> Upcoming Assignments
          </h2>
          <div className="space-y-4">
            {upcomingAssignments.map((assignment, index) => (
              <AssignmentCard key={index} assignment={assignment} isDue={false} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {assignments.length === 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Assignments Found</h2>
          <p className="text-gray-600 mb-6">No assignments were found in your calendar.</p>
        </div>
      )}

      {/* Reset Button */}
      <div className="text-center">
        <button
          onClick={onReset}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          🔄 Fetch Again
        </button>
      </div>
    </div>
  );
}

function AssignmentCard({ assignment, isDue }: { assignment: Assignment; isDue: boolean }) {
  return (
    <div
      className={`border-l-4 rounded-lg p-5 transition-all hover:shadow-md ${
        isDue
          ? 'border-red-500 bg-red-50'
          : 'border-green-500 bg-green-50'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 mb-2">{assignment.name}</h3>
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center text-gray-600">
              <span className="mr-2">📆</span>
              {assignment.date}
            </div>
            {assignment.rawDate && (
              <div className="flex items-center text-gray-600">
                <span className="mr-2">📅</span>
                {assignment.rawDate}
              </div>
            )}
            {assignment.course && (
              <div className="flex items-center">
                <span className="mr-2">📚</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                  {assignment.course}
                </span>
              </div>
            )}
            {assignment.eventType && (
              <div className="flex items-center text-gray-600">
                <span className="mr-2">🏷️</span>
                {assignment.eventType}
              </div>
            )}
          </div>
        </div>
        {assignment.url && (
          <a
            href={assignment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            View →
          </a>
        )}
      </div>
    </div>
  );
}

