import { useState, useEffect } from 'react';
import { PlusCircle, Trash2, StickyNote, Calendar } from 'lucide-react';
import { Note } from '../types';

export function Notes() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      content: newNote,
      createdAt: new Date().toISOString(),
    };

    setNotes([note, ...notes]);
    setNewNote('');
  };

  const handleDelete = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <StickyNote className="text-yellow-500" size={24} />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notes</h1>
      </div>

      <form onSubmit={handleAddNote} className="mb-6">
        <div className="space-y-2">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write a new note..."
            className="w-full p-3 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <PlusCircle size={20} />
            Add Note
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start gap-4">
              <p className="whitespace-pre-wrap text-gray-900 dark:text-white">{note.content}</p>
              <button
                onClick={() => handleDelete(note.id)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500"
              >
                <Trash2 size={20} />
              </button>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <Calendar size={14} />
              <span>{new Date(note.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
