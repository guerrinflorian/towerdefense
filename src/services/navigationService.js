const CHAPTER_STORAGE_KEY = "last-outpost:selected-chapter";

const PAGE_PATHS = {
  main: "./index.html",
  chapters: "./chapters.html",
  map: "./map.html",
  achievements: "./achievements.html",
};

function safeNavigate(path) {
  window.location.href = path;
}

export function navigateToMainMenu() {
  safeNavigate(PAGE_PATHS.main);
}

export function navigateToChapters() {
  safeNavigate(PAGE_PATHS.chapters);
}

export function navigateToMap(chapter) {
  persistChapterSelection(chapter);
  const url = new URL(PAGE_PATHS.map, window.location.href);
  if (chapter?.id) {
    url.searchParams.set("chapterId", chapter.id);
  }
  safeNavigate(url.toString());
}

export function navigateToAchievements() {
  safeNavigate(PAGE_PATHS.achievements);
}

export function persistChapterSelection(chapter) {
  if (!chapter) {
    sessionStorage.removeItem(CHAPTER_STORAGE_KEY);
    return;
  }

  const payload = {
    id: chapter.id ?? null,
    name: chapter.name ?? "",
    isLocked: !!chapter.isLocked,
  };
  sessionStorage.setItem(CHAPTER_STORAGE_KEY, JSON.stringify(payload));
}

export function readStoredChapterSelection() {
  const raw = sessionStorage.getItem(CHAPTER_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return parsed;
    }
  } catch (_err) {
    return null;
  }
  return null;
}

export function getRequestedChapterId() {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("chapterId"));
  return Number.isFinite(id) ? id : null;
}

export function resolvePreferredChapterId() {
  const fromQuery = getRequestedChapterId();
  if (fromQuery) return fromQuery;
  const stored = readStoredChapterSelection();
  return stored?.id ?? null;
}
