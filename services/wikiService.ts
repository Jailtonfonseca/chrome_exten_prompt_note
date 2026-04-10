
import { WikiPage } from '../types';

const WIKI_PAGES_KEY_PREFIX = 'aiPromptStudio_wikiPages_';

const getWikiPagesKey = (userId: string): string => `${WIKI_PAGES_KEY_PREFIX}${userId}`;

export const getWikiPages = async (userId: string): Promise<WikiPage[]> => {
  if (!userId) return [];
  try {
    const stored = localStorage.getItem(getWikiPagesKey(userId));
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading wiki pages:", error);
    return [];
  }
};

export const saveWikiPages = async (userId: string, pages: WikiPage[]): Promise<void> => {
  if (!userId) return;
  try {
    localStorage.setItem(getWikiPagesKey(userId), JSON.stringify(pages));
  } catch (error) {
    console.error("Error saving wiki pages:", error);
  }
};

export const createWikiPage = async (
  userId: string,
  page: Omit<WikiPage, 'id' | 'createdAt' | 'updatedAt'>
): Promise<WikiPage> => {
  const pages = await getWikiPages(userId);
  const now = new Date().toISOString();
  const newPage: WikiPage = {
    ...page,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  pages.push(newPage);
  await saveWikiPages(userId, pages);
  return newPage;
};

export const updateWikiPage = async (userId: string, updatedPage: WikiPage): Promise<WikiPage> => {
  const pages = await getWikiPages(userId);
  const index = pages.findIndex(p => p.id === updatedPage.id);
  if (index === -1) throw new Error("Page not found");
  
  const pageWithLinks = {
    ...updatedPage,
    links: parseLinksFromContent(updatedPage.content, pages),
    updatedAt: new Date().toISOString(),
  };
  
  pages[index] = pageWithLinks;
  await saveWikiPages(userId, pages);
  return pageWithLinks;
};

export const deleteWikiPage = async (userId: string, pageId: string): Promise<void> => {
  const pages = await getWikiPages(userId);
  const filtered = pages.filter(p => p.id !== pageId);
  await saveWikiPages(userId, filtered);
};

export const searchWikiPages = async (userId: string, query: string): Promise<WikiPage[]> => {
  const pages = await getWikiPages(userId);
  const lowerQuery = query.toLowerCase();
  return pages.filter(p => 
    p.title.toLowerCase().includes(lowerQuery) ||
    p.content.toLowerCase().includes(lowerQuery) ||
    p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

export const getBacklinks = async (userId: string, pageId: string): Promise<WikiPage[]> => {
  const pages = await getWikiPages(userId);
  return pages.filter(p => p.links.includes(pageId));
};

export const getPageByTitle = async (userId: string, title: string): Promise<WikiPage | null> => {
  const pages = await getWikiPages(userId);
  return pages.find(p => p.title.toLowerCase() === title.toLowerCase()) || null;
};

export const parseLinksFromContent = (content: string, allPages: WikiPage[]): string[] => {
  const linkRegex = /\[\[([^\]]+)\]\]/g;
  const links: string[] = [];
  let match;
  
  while ((match = linkRegex.exec(content)) !== null) {
    const linkedTitle = match[1];
    const linkedPage = allPages.find(p => p.title.toLowerCase() === linkedTitle.toLowerCase());
    if (linkedPage && !links.includes(linkedPage.id)) {
      links.push(linkedPage.id);
    }
  }
  
  return links;
};

export const renderContentWithLinks = (content: string): string => {
  return content.replace(/\[\[([^\]]+)\]\]/g, '<a class="wiki-link" href="#" data-page="$1">$1</a>');
};
