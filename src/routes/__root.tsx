import { createRootRoute, Outlet } from '@tanstack/react-router';
import { BottomNav } from '../components/BottomNav';
import { WebViewWrapper } from '../components/WebViewWrapper';
import { AddModal } from '../components/AddModal';
import { EditModal } from '../components/EditModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { ProModal } from '../components/ProModal';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-[100dvh] bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 max-w-lg mx-auto relative overflow-hidden" style={{ paddingLeft: 'env(safe-area-inset-left, 0px)', paddingRight: 'env(safe-area-inset-right, 0px)' }}>
      <div className="relative min-h-screen">
        <Outlet />
        <BottomNav />
        <AddModal />
        <EditModal />
        <DeleteConfirmModal />
        <FloatingActionButton />
        <ProModal />
      </div>
    </div>
  );
}
