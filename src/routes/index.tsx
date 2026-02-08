import { createFileRoute } from '@tanstack/react-router';
import { useAppStore } from '../lib/store';
import { HomeTab } from '../components/HomeTab';
import { WorkspacesTab } from '../components/WorkspacesTab';
import { SearchTab } from '../components/SearchTab';
import { RecentsTab } from '../components/RecentsTab';
import { SettingsTab } from '../components/SettingsTab';
import { WebViewWrapper } from '../components/WebViewWrapper';

export const Route = createFileRoute('/')({
  component: AppShell,
});

function AppShell() {
  const { activeTab, activeTile, setActiveTile } = useAppStore();

  return (
    <div className="min-h-screen overflow-y-auto">
      {activeTile && (
        <WebViewWrapper
          tile={activeTile}
          onClose={() => setActiveTile(null)}
        />
      )}
      {!activeTile && (
        <>
          {activeTab === 'home' && <HomeTab />}
          {activeTab === 'workspaces' && <WorkspacesTab />}
          {activeTab === 'search' && <SearchTab />}
          {activeTab === 'recents' && <RecentsTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </>
      )}
    </div>
  );
}
