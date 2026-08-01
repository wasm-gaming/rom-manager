import { useState, useEffect } from 'preact/hooks';
import { ROMExplorer } from '@/views/ROMExplorer';
import { initTheme } from '@/services/ThemeService';
import { initLocale, t } from '@/services/I18nService';

export function App() {
  const [initialized, setInitialized] = useState(false);

  // The remembered theme is painted before anything else is on screen, and the
  // system query stays watched for as long as the app lives.
  useEffect(() => initTheme(), []);

  // The same for the language, which follows the browser until it is chosen.
  useEffect(() => initLocale(), []);

  useEffect(() => {
    // Initialize services
    setInitialized(true);
  }, []);

  if (!initialized) {
    return <div class="loading">{t('app.initializing')}</div>;
  }

  return <ROMExplorer />;
}
