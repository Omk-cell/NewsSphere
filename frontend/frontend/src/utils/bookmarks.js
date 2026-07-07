const BOOKMARKS_KEY = 'bookmarks';

export const getBookmarks = () => {
  if (typeof window === 'undefined') return [];

  try {
    return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]');
  } catch {
    return [];
  }
};

export const saveBookmarks = (bookmarks) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  try {
    // notify other parts of the app in the same window
    const ev = new CustomEvent('bookmarksUpdated', { detail: { bookmarks } });
    window.dispatchEvent(ev);
  } catch (e) {
    // ignore if CustomEvent not supported
  }
};

const isSameArticle = (a, b) => {
  if (!a || !b) return false;

  const idA = a.id;
  const idB = b.id;
  if (idA && idB && idA === idB) return true;

  const urlA = a.url || a.source?.url;
  const urlB = b.url || b.source?.url;
  if (urlA && urlB && urlA === urlB) return true;

  const titleA = a.title;
  const titleB = b.title;
  if (titleA && titleB && titleA.trim() === titleB.trim()) return true;

  return false;
};

export const isArticleBookmarked = (article, bookmarks = []) => {
  if (!article) return false;
  return bookmarks.some((item) => isSameArticle(article, item));
};

export const toggleBookmarkArticle = (article, bookmarks = []) => {
  if (!article) return bookmarks;

  const exists = isArticleBookmarked(article, bookmarks);
  const nextBookmarks = exists
    ? bookmarks.filter((item) => !isSameArticle(article, item))
    : [...bookmarks, { ...article, id: article.id || article.url || article.source?.url || article.title }];

  saveBookmarks(nextBookmarks);
  return nextBookmarks;
};

