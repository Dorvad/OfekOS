"use client";

import { useState, useEffect, useRef } from "react";
import { getAssignmentData, setAssignmentData } from "@/lib/assignment-storage";

interface TeamMember {
  id: string;
  name: string;
  strength: string;
  motivation: number;
  competence: number;
  needs: string;
}

interface TeamMapData {
  members: TeamMember[];
}

const EMPTY: TeamMapData = { members: [] };

function getId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function TeamMapTool({ assignmentId }: { assignmentId: string }) {
  const [data, setData] = useState<TeamMapData>(EMPTY);
  const [newName, setNewName] = useState("");
  const [newStrength, setNewStrength] = useState("");
  const [saved, setSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const stored = getAssignmentData<TeamMapData>(assignmentId);
    if (stored && (stored as TeamMapData).members) setData(stored as TeamMapData);
  }, [assignmentId]);

  function persist(next: TeamMapData) {
    setData(next);
    setSaved(false);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setAssignmentData(assignmentId, next);
      setSaved(true);
    }, 800);
  }

  function addMember() {
    if (!newName.trim()) return;
    const member: TeamMember = {
      id: getId(),
      name: newName.trim(),
      strength: newStrength.trim(),
      motivation: 3,
      competence: 3,
      needs: "",
    };
    persist({ members: [...data.members, member] });
    setNewName("");
    setNewStrength("");
  }

  function updateMember(id: string, key: keyof TeamMember, value: string | number) {
    const next = data.members.map((m) => (m.id === id ? { ...m, [key]: value } : m));
    persist({ members: next });
  }

  function removeMember(id: string) {
    persist({ members: data.members.filter((m) => m.id !== id) });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-gray-900">מפת הצוות</h2>
        <span className={`text-xs ${saved ? "text-emerald-600" : "text-gray-400"}`}>
          {saved ? "נשמר ✓" : `${data.members.length} חברי צוות`}
        </span>
      </div>

      {/* Add member form */}
      <div className="rounded-xl border-2 border-teal-200 bg-teal-50 p-4">
        <h3 className="text-sm font-semibold text-teal-800 mb-3">הוסף חבר צוות</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="שם"
            className="rounded-lg border border-teal-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            dir="rtl"
          />
          <input
            value={newStrength}
            onChange={(e) => setNewStrength(e.target.value)}
            placeholder="חוזקה עיקרית"
            className="rounded-lg border border-teal-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            dir="rtl"
          />
        </div>
        <button
          onClick={addMember}
          disabled={!newName.trim()}
          className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-40 text-white font-semibold py-2 rounded-lg text-sm transition-colors"
        >
          + הוסף
        </button>
      </div>

      {/* Member cards */}
      {data.members.length > 0 && (
        <div className="space-y-3">
          {data.members.map((member) => (
            <div key={member.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{member.name}</h4>
                <button
                  onClick={() => removeMember(member.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              </div>
              {member.strength && (
                <p className="text-xs text-gray-500 mb-3">חוזקה: {member.strength}</p>
              )}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">מוטיבציה ({member.motivation}/5)</label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={member.motivation}
                    onChange={(e) => updateMember(member.id, "motivation", Number(e.target.value))}
                    className="w-full accent-teal-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">מיומנות ({member.competence}/5)</label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={member.competence}
                    onChange={(e) => updateMember(member.id, "competence", Number(e.target.value))}
                    className="w-full accent-teal-500"
                  />
                </div>
              </div>
              <textarea
                value={member.needs}
                onChange={(e) => updateMember(member.id, "needs", e.target.value)}
                placeholder="מה הם צריכים ממני?"
                className="w-full min-h-[72px] rounded-lg border border-gray-200 bg-gray-50 p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-400"
                dir="rtl"
              />
            </div>
          ))}
        </div>
      )}

      {data.members.length >= 2 && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium text-center">
          ✓ המפה בנויה — עבור לשלב הבא
        </div>
      )}
    </div>
  );
}
