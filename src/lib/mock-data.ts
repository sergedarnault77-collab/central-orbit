import type { Tile, Workspace, RecentItem } from './types';

export const MOCK_WORKSPACES: Workspace[] = [
  { id: 'ws-1', name: 'Development', icon: '⚡', color: '#6366f1', tileCount: 5, createdAt: Date.now() - 86400000 * 30 },
  { id: 'ws-2', name: 'Design', icon: '🎨', color: '#ec4899', tileCount: 3, createdAt: Date.now() - 86400000 * 25 },
  { id: 'ws-3', name: 'Analytics', icon: '📊', color: '#14b8a6', tileCount: 4, createdAt: Date.now() - 86400000 * 20 },
  { id: 'ws-4', name: 'Communication', icon: '💬', color: '#f59e0b', tileCount: 2, createdAt: Date.now() - 86400000 * 15 },
];

export const MOCK_TILES: Tile[] = [
  { id: 't-1', name: 'GitHub', url: 'https://github.com', icon: '🐙', color: '#6366f1', workspaceId: 'ws-1', isFavorite: true, lastAccessedAt: Date.now() - 3600000, createdAt: Date.now() - 86400000 * 28 },
  { id: 't-2', name: 'Vercel Dashboard', url: 'https://vercel.com/dashboard', icon: '▲', color: '#171717', workspaceId: 'ws-1', isFavorite: true, lastAccessedAt: Date.now() - 7200000, createdAt: Date.now() - 86400000 * 27 },
  { id: 't-3', name: 'Railway', url: 'https://railway.app', icon: '🚂', color: '#7c3aed', workspaceId: 'ws-1', isFavorite: false, lastAccessedAt: Date.now() - 86400000, createdAt: Date.now() - 86400000 * 26 },
  { id: 't-4', name: 'Supabase', url: 'https://supabase.com/dashboard', icon: '⚡', color: '#22c55e', workspaceId: 'ws-1', isFavorite: false, lastAccessedAt: undefined, createdAt: Date.now() - 86400000 * 25 },
  { id: 't-5', name: 'Netlify', url: 'https://app.netlify.com', icon: '🌐', color: '#0ea5e9', workspaceId: 'ws-1', isFavorite: false, lastAccessedAt: undefined, createdAt: Date.now() - 86400000 * 24 },
  { id: 't-6', name: 'Figma', url: 'https://figma.com', icon: '🎨', color: '#a855f7', workspaceId: 'ws-2', isFavorite: true, lastAccessedAt: Date.now() - 1800000, createdAt: Date.now() - 86400000 * 23 },
  { id: 't-7', name: 'Dribbble', url: 'https://dribbble.com', icon: '🏀', color: '#ec4899', workspaceId: 'ws-2', isFavorite: false, lastAccessedAt: Date.now() - 86400000 * 2, createdAt: Date.now() - 86400000 * 22 },
  { id: 't-8', name: 'Coolors', url: 'https://coolors.co', icon: '🌈', color: '#06b6d4', workspaceId: 'ws-2', isFavorite: false, lastAccessedAt: undefined, createdAt: Date.now() - 86400000 * 21 },
  { id: 't-9', name: 'Plausible', url: 'https://plausible.io', icon: '📈', color: '#14b8a6', workspaceId: 'ws-3', isFavorite: true, lastAccessedAt: Date.now() - 5400000, createdAt: Date.now() - 86400000 * 20 },
  { id: 't-10', name: 'PostHog', url: 'https://app.posthog.com', icon: '🦔', color: '#f97316', workspaceId: 'ws-3', isFavorite: false, lastAccessedAt: Date.now() - 86400000 * 3, createdAt: Date.now() - 86400000 * 19 },
  { id: 't-11', name: 'Mixpanel', url: 'https://mixpanel.com', icon: '🔬', color: '#8b5cf6', workspaceId: 'ws-3', isFavorite: false, lastAccessedAt: undefined, createdAt: Date.now() - 86400000 * 18 },
  { id: 't-12', name: 'Hotjar', url: 'https://hotjar.com', icon: '🔥', color: '#ef4444', workspaceId: 'ws-3', isFavorite: false, lastAccessedAt: undefined, createdAt: Date.now() - 86400000 * 17 },
  { id: 't-13', name: 'Slack', url: 'https://slack.com', icon: '💬', color: '#f59e0b', workspaceId: 'ws-4', isFavorite: true, lastAccessedAt: Date.now() - 900000, createdAt: Date.now() - 86400000 * 16 },
  { id: 't-14', name: 'Notion', url: 'https://notion.so', icon: '📝', color: '#171717', workspaceId: 'ws-4', isFavorite: false, lastAccessedAt: Date.now() - 43200000, createdAt: Date.now() - 86400000 * 15 },
];

export const MOCK_RECENTS: RecentItem[] = MOCK_TILES
  .filter(t => t.lastAccessedAt)
  .sort((a, b) => (b.lastAccessedAt ?? 0) - (a.lastAccessedAt ?? 0))
  .map(t => ({
    tileId: t.id,
    tileName: t.name,
    tileUrl: t.url,
    tileColor: t.color,
    tileIcon: t.icon,
    workspaceName: MOCK_WORKSPACES.find(w => w.id === t.workspaceId)?.name ?? '',
    accessedAt: t.lastAccessedAt!,
  }));
