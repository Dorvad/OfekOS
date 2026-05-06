import { STORAGE_KEYS } from "./storage-keys";
import type { WorkbookPrivacy } from "./types";

export interface WorkbookEntry {
  content: string;
  privacy: WorkbookPrivacy;
  savedAt: string | null;
}

export function getWorkbookEntry(sectionId: string): WorkbookEntry | null {
  if (typeof window === "undefined") return null;
  const content = localStorage.getItem(STORAGE_KEYS.workbookContent(sectionId));
  if (!content) return null;
  const privacy = localStorage.getItem(STORAGE_KEYS.workbookPrivacy(sectionId));
  const savedAt = localStorage.getItem(STORAGE_KEYS.workbookSavedAt(sectionId));
  return {
    content,
    privacy: privacy === "shared" ? "shared" : "private",
    savedAt,
  };
}

export function setWorkbookEntry(
  sectionId: string,
  content: string,
  privacy: WorkbookPrivacy,
  savedAt: string
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.workbookContent(sectionId), content);
  localStorage.setItem(STORAGE_KEYS.workbookPrivacy(sectionId), privacy);
  localStorage.setItem(STORAGE_KEYS.workbookSavedAt(sectionId), savedAt);
}

export function hasWorkbookContent(sectionId: string): boolean {
  if (typeof window === "undefined") return false;
  const content = localStorage.getItem(STORAGE_KEYS.workbookContent(sectionId));
  return !!content && content.trim().length > 0;
}

export function countWorkbookSectionsWithContent(sectionIds: string[]): number {
  if (typeof window === "undefined") return 0;
  return sectionIds.filter(hasWorkbookContent).length;
}
