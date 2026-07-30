import { useState, useEffect } from 'preact/hooks';
import { ROMExplorer } from './views/ROMExplorer';
import { initTheme } from './services/ThemeService';

export function App() {
  const [initialized, setInitialized] = useState(false);

  // The remembered theme is painted before anything else is on screen, and the
  // system query stays watched for as long as the app lives.
  useEffect(() => initTheme(), []);

  useEffect(() => {
    // Initialize services
    setInitialized(true);
  }, []);

  if (!initialized) {
    return <div class="loading">Initializing...</div>;
  }

  return <ROMExplorer />;
}
