"use client";

import { useState } from "react";
import ImageKitUpload from "@/components/imageKit/ImageKitUpload";

export interface Speaker {
  name: string;
  title?: string;
  bio?: string;
  linkedinLink?: string;
  instagramLink?: string;
  twitterLink?: string;
  profileImageUrl?: string;
  profileImageFileId?: string;
}

interface SpeakerManagementProps {
  speakers: Speaker[];
  onChange: (speakers: Speaker[]) => void;
}

export default function SpeakerManagement({
  speakers,
  onChange,
}: SpeakerManagementProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentSpeaker, setCurrentSpeaker] = useState<Speaker>({
    name: "",
    title: "",
    bio: "",
    linkedinLink: "",
    instagramLink: "",
    twitterLink: "",
    profileImageUrl: "",
    profileImageFileId: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCurrentSpeaker({
      ...currentSpeaker,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (res: { url: string; fileId: string }) => {
    setCurrentSpeaker({
      ...currentSpeaker,
      profileImageUrl: res.url,
      profileImageFileId: res.fileId,
    });
  };

  const handleSubmit = () => {
    if (!currentSpeaker.name.trim()) {
      alert("Please enter speaker name");
      return;
    }

    if (editingIndex !== null) {
      const updated = [...speakers];
      updated[editingIndex] = currentSpeaker;
      onChange(updated);
    } else {
      onChange([...speakers, currentSpeaker]);
    }

    resetForm();
  };

  const handleEdit = (index: number) => {
    setCurrentSpeaker(speakers[index]);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index: number) => {
    onChange(speakers.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setCurrentSpeaker({
      name: "",
      title: "",
      bio: "",
      linkedinLink: "",
      instagramLink: "",
      twitterLink: "",
      profileImageUrl: "",
      profileImageFileId: "",
    });
    setShowForm(false);
    setEditingIndex(null);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-semibold text-slate-700">
          Event Speakers
        </label>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="text-sm text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1.5"
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
          {showForm ? "Cancel" : "Add Speaker"}
        </button>
      </div>

      {/* Speaker Form */}
      {showForm && (
        <div className="bg-purple-50/50 border-2 border-purple-100 p-5 rounded-xl mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={currentSpeaker.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border-2 border-purple-100 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Speaker name"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Title/Role
              </label>
              <input
                type="text"
                name="title"
                value={currentSpeaker.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border-2 border-purple-100 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., CEO, Developer"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              value={currentSpeaker.bio}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border-2 border-purple-100 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="Brief biography..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                LinkedIn
              </label>
              <input
                type="url"
                name="linkedinLink"
                value={currentSpeaker.linkedinLink}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border-2 border-purple-100 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Instagram
              </label>
              <input
                type="url"
                name="instagramLink"
                value={currentSpeaker.instagramLink}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border-2 border-purple-100 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Twitter
              </label>
              <input
                type="url"
                name="twitterLink"
                value={currentSpeaker.twitterLink}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border-2 border-purple-100 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://twitter.com/..."
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Profile Image
            </label>
            <ImageKitUpload
              onSuccess={handleImageUpload}
              defaultImage={currentSpeaker.profileImageUrl}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition"
            >
              {editingIndex !== null ? "Update" : "Add"} Speaker
            </button>
          </div>
        </div>
      )}

      {/* Speakers List */}
      <div className="bg-white rounded-xl border-2 border-purple-100">
        {speakers.length > 0 ? (
          <ul className="divide-y divide-purple-100">
            {speakers.map((speaker, index) => (
              <li
                key={index}
                className="p-4 flex items-center justify-between hover:bg-purple-50/30 transition"
              >
                <div className="flex items-center gap-3">
                  {speaker.profileImageUrl ? (
                    <img
                      src={speaker.profileImageUrl}
                      alt={speaker.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-black text-lg">
                      {speaker.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-slate-900">
                      {speaker.name}
                    </p>
                    {speaker.title && (
                      <p className="text-sm text-slate-600">{speaker.title}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
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
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-4 text-center text-sm text-slate-500">
            No speakers added yet
          </p>
        )}
      </div>
    </div>
  );
}
