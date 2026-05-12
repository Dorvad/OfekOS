"use client";

import { useEffect, useRef, useState } from "react";
import Card from "@/components/ui/Card";
import type { AdminResource } from "@/lib/types";
import {
  setAssignmentLocked,
  addResource,
  deleteResource,
  uploadResourceFile,
} from "@/lib/admin-service";
import { MOCK_ASSIGNMENTS } from "@/lib/mock-data";

const TYPE_ICONS: Record<string, string> = {
  pdf: "📄",
  link: "🔗",
  template: "📝",
  video: "🎥",
  other: "📎",
};

const TYPE_LABELS: Record<string, string> = {
  pdf: "PDF",
  link: "קישור",
  template: "תבנית",
  video: "וידאו",
  other: "אחר",
};

const EXT_TO_TYPE: Record<string, AdminResource["type"]> = {
  pdf: "pdf",
  doc: "template",
  docx: "template",
  ppt: "template",
  pptx: "template",
  png: "other",
  jpg: "other",
  jpeg: "other",
};

function formatSize(kb: number | null): string {
  if (!kb) return "—";
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${kb} KB`;
}

interface Props {
  lockStates: Record<string, boolean>;
  resources: AdminResource[];
  onDataChange: () => void;
}

interface ResourceForm {
  name: string;
  sessionNumber: string;
  type: string;
  url: string;
  description: string;
}

const EMPTY_FORM: ResourceForm = {
  name: "",
  sessionNumber: "1",
  type: "pdf",
  url: "",
  description: "",
};

interface UploadState {
  fileName: string;
  fileSizeKb: number;
  fileType: AdminResource["type"];
  file: File | null;
  error: string;
}

const EMPTY_UPLOAD: UploadState = {
  fileName: "",
  fileSizeKb: 0,
  fileType: "other",
  file: null,
  error: "",
};

export default function ContentTab({ lockStates, resources, onDataChange }: Props) {
  const [savedLocks, setSavedLocks] = useState(lockStates);
  const [pendingLocks, setPendingLocks] = useState(lockStates);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [form, setForm] = useState<ResourceForm>(EMPTY_FORM);
  const [sessionFilter, setSessionFilter] = useState<string>("all");

  // File upload state
  const [upload, setUpload] = useState<UploadState>(EMPTY_UPLOAD);
  const [uploadSession, setUploadSession] = useState("1");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSavedLocks(lockStates);
    setPendingLocks(lockStates);
  }, [lockStates]);

  const hasChanges = Object.keys(pendingLocks).some(
    (id) => pendingLocks[id] !== savedLocks[id]
  );

  function handleToggle(assignmentId: string) {
    setPendingLocks((prev) => ({ ...prev, [assignmentId]: !prev[assignmentId] }));
    setSaveError(null);
  }

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    const changed = Object.keys(pendingLocks).filter(
      (id) => pendingLocks[id] !== savedLocks[id]
    );
    try {
      await Promise.all(changed.map((id) => setAssignmentLocked(id, pendingLocks[id])));
      setSavedLocks({ ...pendingLocks });
      onDataChange();
    } catch (err) {
      console.error("failed to save lock states", err);
      setSaveError("שגיאה בשמירה. נסה שנית.");
      setPendingLocks({ ...savedLocks });
    } finally {
      setSaving(false);
    }
  }

  async function handleAddResource() {
    if (!form.name.trim()) return;
    await addResource({
      name: form.name.trim(),
      sessionNumber: parseInt(form.sessionNumber),
      type: form.type as AdminResource["type"],
      url: form.url.trim() || null,
      fileSizeKb: null,
      description: form.description.trim(),
    });
    setForm(EMPTY_FORM);
    onDataChange();
  }

  async function handleDeleteResource(id: string) {
    await deleteResource(id);
    onDataChange();
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeKb = Math.round(file.size / 1024);
    if (file.size > 50 * 1024 * 1024) {
      setUpload({
        ...EMPTY_UPLOAD,
        error: "הקובץ גדול מ-50MB. אנא בחר/י קובץ קטן יותר.",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const fileType: AdminResource["type"] = EXT_TO_TYPE[ext] ?? "other";

    setUpload({
      file,
      fileName: file.name,
      fileSizeKb: sizeKb,
      fileType,
      error: "",
    });
  }

  async function handleUploadSubmit() {
    if (!upload.file) return;
    setUploading(true);
    setUpload((prev) => ({ ...prev, error: "" }));
    try {
      await uploadResourceFile(upload.file, parseInt(uploadSession));
      setUpload(EMPTY_UPLOAD);
      if (fileInputRef.current) fileInputRef.current.value = "";
      onDataChange();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      console.error("failed to upload resource", err);
      setUpload((prev) => ({
        ...prev,
        error: `ההעלאה נכשלה: ${message}`,
      }));
    } finally {
      setUploading(false);
    }
  }

  const filteredResources =
    sessionFilter === "all"
      ? resources
      : resources.filter((r) => r.sessionNumber === parseInt(sessionFilter));

  return (
    <div className="space-y-6">

      {/* ── Assignment locks ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-700">ניהול נעילת מטלות</h2>
          <div className="flex items-center gap-2">
            {saveError && (
              <span className="text-xs text-red-600">{saveError}</span>
            )}
            {hasChanges && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white transition-colors"
              >
                {saving ? "שומר..." : "שמור שינויים ←"}
              </button>
            )}
          </div>
        </div>
        <Card padding={false}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-400 font-medium">
                <th className="text-right px-5 py-3 w-8">#</th>
                <th className="text-right px-4 py-3">מטלה</th>
                <th className="text-right px-4 py-3 hidden sm:table-cell">מפגש</th>
                <th className="text-right px-4 py-3">סטטוס</th>
                <th className="text-right px-4 py-3">פעולה</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_ASSIGNMENTS.map((a) => {
                const unlocked = pendingLocks[a.id] ?? false;
                const changed = pendingLocks[a.id] !== savedLocks[a.id];
                return (
                  <tr key={a.id} className={changed ? "bg-amber-50/50" : "hover:bg-gray-50/50"}>
                    <td className="px-5 py-3 text-xs text-gray-400">{a.sessionNumber}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{a.title}</p>
                      <p className="text-xs text-gray-400">{a.subtitle}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs text-gray-500">מפגש {a.sessionNumber}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        unlocked
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-600"
                      }`}>
                        {unlocked ? "🟢 פתוחה" : "🔴 נעולה"}
                        {changed && <span className="text-gray-400">(לא נשמר)</span>}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggle(a.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                          unlocked
                            ? "border-red-200 text-red-600 hover:bg-red-50"
                            : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        }`}
                      >
                        {unlocked ? "🔒 נעל" : "🔓 פתח"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>

      {/* ── File Upload ── */}
      <div>
        <h2 className="text-sm font-bold text-gray-700 mb-3">העלאת קבצי תוכנית</h2>
        <Card className="mb-4">
          <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
            העלאת קובץ
          </h3>

          <div className="space-y-3">
            {/* File input */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                בחר/י קובץ (עד 50MB — PDF, Word, PowerPoint, תמונה או וידאו)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.pptx,.ppt,.png,.jpg,.jpeg,.mp4,.mov,.webm"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-700 file:mr-0 file:ml-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
              />
            </div>

            {/* Error */}
            {upload.error && (
              <p className="text-xs text-red-600 font-medium">{upload.error}</p>
            )}

            {/* File info after selection */}
            {upload.fileName && (
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-800">
                    {TYPE_ICONS[upload.fileType]} {upload.fileName}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatSize(upload.fileSizeKb)}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-gray-200 text-gray-600 font-medium">
                    {TYPE_LABELS[upload.fileType]}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-xs text-gray-600">מפגש:</label>
                  <select
                    value={uploadSession}
                    onChange={(e) => setUploadSession(e.target.value)}
                    className="px-2 py-1 rounded-lg border border-gray-200 text-xs focus:outline-none bg-white"
                    dir="rtl"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>מפגש {n}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleUploadSubmit}
                  disabled={uploading || !upload.file}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  {uploading ? "שומר..." : "שמור קובץ ←"}
                </button>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* ── Resources ── */}
      <div>
        <h2 className="text-sm font-bold text-gray-700 mb-3">חומרי למידה</h2>

        {/* Add link form */}
        <Card className="mb-4">
          <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
            הוסף קישור
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div className="sm:col-span-2">
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="שם החומר"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                dir="rtl"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={form.sessionNumber}
                onChange={(e) => setForm((f) => ({ ...f, sessionNumber: e.target.value }))}
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white"
                dir="rtl"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>מפגש {n}</option>
                ))}
              </select>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white"
                dir="rtl"
              >
                {Object.entries(TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <input
                value={form.url}
                onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                placeholder="קישור (אופציונלי)"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                dir="ltr"
              />
            </div>
            <button
              onClick={handleAddResource}
              disabled={!form.name.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              הוסף חומר ←
            </button>
          </div>
        </Card>

        {/* Filter + list */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs text-gray-500">סנן לפי מפגש:</span>
          <select
            value={sessionFilter}
            onChange={(e) => setSessionFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none bg-white"
            dir="rtl"
          >
            <option value="all">הכל</option>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>מפגש {n}</option>
            ))}
          </select>
        </div>

        <Card padding={false}>
          {filteredResources.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-gray-400">אין חומרי למידה עדיין</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 font-medium">
                  <th className="text-right px-5 py-3">שם</th>
                  <th className="text-right px-4 py-3 hidden sm:table-cell">מפגש</th>
                  <th className="text-right px-4 py-3 hidden md:table-cell">סוג</th>
                  <th className="text-right px-4 py-3 hidden lg:table-cell">גודל</th>
                  <th className="text-right px-4 py-3 hidden lg:table-cell">הועלה</th>
                  <th className="px-4 py-3 w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredResources.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{TYPE_ICONS[r.type]}</span>
                        <div>
                          <p className="font-medium text-gray-900">{r.name}</p>
                          {r.url && !r.url.startsWith("data:") && (
                            <a href={r.url} target="_blank" rel="noreferrer" className="text-xs text-indigo-500 hover:underline" dir="ltr">
                              {r.url.slice(0, 40)}{r.url.length > 40 ? "…" : ""}
                            </a>
                          )}
                          {r.url && r.url.startsWith("data:") && (
                            <a
                              href={r.url}
                              download={r.name}
                              className="text-xs text-indigo-500 hover:underline"
                            >
                              הורד קובץ
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-xs text-gray-500">מפגש {r.sessionNumber}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">{TYPE_LABELS[r.type]}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-400">{formatSize(r.fileSizeKb)}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-400">{r.uploadedAt}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDeleteResource(r.id)}
                        className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 text-xs mx-auto"
                        title="מחק"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
            {filteredResources.length} פריטים
          </div>
        </Card>
      </div>
    </div>
  );
}
