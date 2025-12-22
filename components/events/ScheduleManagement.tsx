"use client";

import { useState } from "react";

export interface ScheduleItem {
  title: string;
  startTime: string;
  endTime?: string;
  date?: string;
  presenter?: string;
  description?: string;
  type?: "session" | "break" | "opening" | "closing";
}

interface ScheduleManagementProps {
  schedule: ScheduleItem[];
  onChange: (schedule: ScheduleItem[]) => void;
}

export default function ScheduleManagement({
  schedule,
  onChange,
}: ScheduleManagementProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentItem, setCurrentItem] = useState<ScheduleItem>({
    title: "",
    startTime: "",
    endTime: "",
    date: "",
    presenter: "",
    description: "",
    type: "session",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setCurrentItem({
      ...currentItem,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (!currentItem.title.trim() || !currentItem.startTime) {
      alert("Please enter title and start time");
      return;
    }

    if (editingIndex !== null) {
      const updated = [...schedule];
      updated[editingIndex] = currentItem;
      onChange(updated);
    } else {
      onChange([...schedule, currentItem]);
    }

    resetForm();
  };

  const handleEdit = (index: number) => {
    setCurrentItem(schedule[index]);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index: number) => {
    onChange(schedule.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setCurrentItem({
      title: "",
      startTime: "",
      endTime: "",
      date: "",
      presenter: "",
      description: "",
      type: "session",
    });
    setShowForm(false);
    setEditingIndex(null);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-semibold text-slate-700">
          Event Schedule
        </label>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1.5"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          {showForm ? "Cancel" : "Add Schedule Item"}
        </button>
      </div>

      {/* Schedule Form */}
      {showForm && (
        <div className="bg-indigo-50/50 border-2 border-indigo-100 p-5 rounded-xl mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Type
              </label>
              <select
                name="type"
                value={currentItem.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border-2 border-indigo-100 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="session">Session</option>
                <option value="break">Break</option>
                <option value="opening">Opening</option>
                <option value="closing">Closing</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={currentItem.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border-2 border-indigo-100 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Session title"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Start Time *
              </label>
              <input
                type="time"
                name="startTime"
                value={currentItem.startTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border-2 border-indigo-100 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                value={currentItem.endTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border-2 border-indigo-100 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={currentItem.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border-2 border-indigo-100 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {currentItem.type === "session" && (
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Presenter
              </label>
              <input
                type="text"
                name="presenter"
                value={currentItem.presenter}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border-2 border-indigo-100 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Presenter name"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={currentItem.description}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border-2 border-indigo-100 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Brief description..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
              {editingIndex !== null ? "Update" : "Add"} Item
            </button>
          </div>
        </div>
      )}

      {/* Schedule List */}
      <div className="bg-white rounded-xl border-2 border-indigo-100">
        {schedule.length > 0 ? (
          <ul className="divide-y divide-indigo-100">
            {schedule.map((item, index) => (
              <li key={index} className="p-4 hover:bg-indigo-50/30 transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-900">
                        {item.title}
                      </span>
                      <span className="text-sm text-slate-500">
                        ({item.startTime}
                        {item.endTime && ` - ${item.endTime}`})
                      </span>
                      {item.type !== "session" && (
                        <span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded-full">
                          {item.type}
                        </span>
                      )}
                    </div>
                    {item.presenter && (
                      <p className="text-sm text-slate-600">
                        Presenter: {item.presenter}
                      </p>
                    )}
                    {item.description && (
                      <p className="text-sm text-slate-600 mt-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      type="button"
                      onClick={() => handleEdit(index)}
                      className="text-indigo-600 hover:text-indigo-800 p-2"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-4 text-center text-sm text-slate-500">
            No schedule items added yet
          </p>
        )}
      </div>
    </div>
  );
}
