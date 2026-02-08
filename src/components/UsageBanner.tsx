import { useSubscription, getUsagePercent, getRemainingCount, FREE_LIMITS } from '../lib/subscription';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useSession } from '../lib/auth-client';

export function UsageBanner() {
  const { tier, openProModal } = useSubscription();
  const { data: session } = useSession();
  const tiles = useQuery(api.queries.listTiles, session ? {} : 'skip') ?? [];
  const workspaces = useQuery(api.queries.listWorkspaces, session ? {} : 'skip') ?? [];

  if (tier === 'pro' || !session) return null;

  const tileUsage = getUsagePercent(tier, tiles.length, 'maxTotalTiles');
  const wsUsage = getUsagePercent(tier, workspaces.length, 'maxWorkspaces');
  const maxUsage = Math.max(tileUsage, wsUsage);

  // Only show when usage is notable (>= 50%)
  if (maxUsage < 50) return null;

  const tilesRemaining = getRemainingCount(tier, tiles.length, 'maxTotalTiles');
  const wsRemaining = getRemainingCount(tier, workspaces.length, 'maxWorkspaces');

  const isAtLimit = maxUsage >= 100;
  const isNearLimit = maxUsage >= 80;

  return (
    <button
      onClick={() => openProModal('usage_banner')}
      className={`w-full p-3 rounded-2xl border text-left transition-all duration-200 hover:shadow-md ${
        isAtLimit
          ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20'
          : isNearLimit
            ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20'
            : 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{isAtLimit ? '🔒' : isNearLimit ? '⚠️' : '📊'}</span>
          <div>
            <p className={`text-xs font-semibold ${
              isAtLimit
                ? 'text-red-700 dark:text-red-300'
                : isNearLimit
                  ? 'text-amber-700 dark:text-amber-300'
                  : 'text-indigo-700 dark:text-indigo-300'
            }`}>
              {isAtLimit
                ? 'Free plan limit reached'
                : isNearLimit
                  ? 'Running low on free plan'
                  : 'Free plan usage'}
            </p>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              {tilesRemaining !== null && tilesRemaining <= 3 && `${tilesRemaining} tool${tilesRemaining !== 1 ? 's' : ''} left`}
              {tilesRemaining !== null && tilesRemaining <= 3 && wsRemaining !== null && wsRemaining <= 1 && ' · '}
              {wsRemaining !== null && wsRemaining <= 1 && `${wsRemaining} workspace${wsRemaining !== 1 ? 's' : ''} left`}
            </p>
          </div>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          isAtLimit
            ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'
            : 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
        }`}>
          Upgrade
        </span>
      </div>
      {/* Mini progress bar */}
      <div className="mt-2 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-amber-500' : 'bg-indigo-500'
          }`}
          style={{ width: `${maxUsage}%` }}
        />
      </div>
    </button>
  );
}
