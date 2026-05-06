"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { getWorkbookEntry, setWorkbookEntry } from "@/lib/workbook-storage";
import { formatDate } from "@/lib/utils";
import type { WorkbookSection, WorkbookPrivacy } from "@/lib/types";

interface WorkbookEditorProps {
  section: WorkbookSection;
}

export default function WorkbookEditor({ section }: WorkbookEditorProps) {
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState<WorkbookPrivacy>(section.defaultPrivacy);
  const [savedContent, setSavedContent] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    const entry = getWorkbookEntry(section.id);
    if (entry) {
      setContent(entry.content);
      setSavedContent(entry.content);
      setPrivacy(entry.privacy);
      setSavedAt(entry.savedAt);
    }
  }, [section.id]);

  function handleSave() {
    const now = new Date().toISOString();
    setWorkbookEntry(section.id, content, privacy, now);
    setSavedContent(content);
    setSavedAt(now);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  }

  function handlePrivacyToggle(next: WorkbookPrivacy) {
    setPrivacy(next);
    const now = savedAt ?? new Date().toISOString();
    setWorkbookEntry(section.id, content, next, now);
  }

  const hasUnsavedChanges = content !== savedContent;

  return (
    <div>
      {/* Prompt */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-5">
        <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">
          Reflection prompt
        </p>
        <p className="text-sm text-indigo-800 italic leading-relaxed">{section.prompt}</p>
      </div>

      {/* Textarea */}
      <textarea
        className="w-full min-h-[240px] rounded-xl border border-gray-200 p-4 text-sm leading-relaxed text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-y transition-all"
        placeholder="Write your reflection here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3 mt-3">
        {/* Privacy toggle */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">Visibility:</span>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => handlePrivacyToggle("private")}
              className={`text-xs px-3 py-1 rounded-md font-medium transition-colors ${
                privacy === "private"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Private
            </button>
            <button
              type="button"
              onClick={() => handlePrivacyToggle("shared")}
              className={`text-xs px-3 py-1 rounded-md font-medium transition-colors ${
                privacy === "shared"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Share with manager
            </button>
          </div>
        </div>

        {/* Save area */}
        <div className="flex items-center gap-3">
          {savedAt && !hasUnsavedChanges && !justSaved && (
            <span className="text-xs text-gray-400">
              Saved {formatDate(savedAt.split("T")[0])}
            </span>
          )}
          {hasUnsavedChanges && (
            <span className="text-xs text-amber-600 font-medium">Unsaved changes</span>
          )}
          {justSaved && (
            <span className="text-xs text-emerald-600 font-medium">Saved ✓</span>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
          >
            Save Entry
          </Button>
        </div>
      </div>
    </div>
  );
}
