"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

function MicrophoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-12 h-12 text-indigo-300"
    >
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

interface ElevenLabsEmbedPlaceholderProps {
  agentId: string | null;
  scenarioTitle: string;
}

export default function ElevenLabsEmbedPlaceholder({
  agentId,
  scenarioTitle,
}: ElevenLabsEmbedPlaceholderProps) {
  const [showNote, setShowNote] = useState(false);

  return (
    <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 min-h-[320px] flex flex-col items-center justify-center p-8 text-center">
      <MicrophoneIcon />

      <h3 className="text-lg font-semibold text-indigo-700 mt-4">
        AI Conversation Agent
      </h3>
      <p className="text-sm text-indigo-600 mt-1 max-w-sm">{scenarioTitle}</p>

      <div className="w-24 h-px bg-indigo-200 my-5" />

      {agentId ? (
        <div className="text-xs text-emerald-600 font-medium bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full mb-4">
          Agent configured · ID: {agentId}
        </div>
      ) : (
        <div className="text-xs text-amber-700 font-medium bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full mb-4">
          Agent not yet configured
        </div>
      )}

      <Button
        variant="primary"
        size="lg"
        onClick={() => setShowNote(true)}
      >
        Start Practice Session
      </Button>

      {showNote && (
        <p className="text-xs text-amber-600 font-medium mt-3 animate-fade-in">
          ElevenLabs integration coming soon — agent embed will appear here.
        </p>
      )}

      <p className="text-xs text-gray-400 mt-6 max-w-xs">
        ElevenLabs Conversational AI agent embed · Integration pending
      </p>
    </div>
  );
}
