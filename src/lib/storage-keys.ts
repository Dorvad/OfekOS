export const STORAGE_KEYS = {
  task: (taskId: string) => `ofekos:tasks:u1:${taskId}`,
  workbookContent: (sectionId: string) => `ofekos:workbook:u1:${sectionId}:content`,
  workbookPrivacy: (sectionId: string) => `ofekos:workbook:u1:${sectionId}:privacy`,
  workbookSavedAt: (sectionId: string) => `ofekos:workbook:u1:${sectionId}:savedAt`,
} as const;
