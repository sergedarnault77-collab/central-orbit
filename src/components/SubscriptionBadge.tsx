import { useSubscription } from '../lib/subscription';

export function SubscriptionBadge() {
  const { tier, openProModal } = useSubscription();

  if (tier === 'pro') {
    return (
      <button
        onClick={() => openProModal('badge')}
        className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-bold shadow-sm hover:shadow-md transition-all duration-200"
      >
        ✨ PRO
      </button>
    );
  }

  return (
    <button
      onClick={() => openProModal('badge')}
      className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10px] font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all duration-200"
    >
      FREE
    </button>
  );
}
