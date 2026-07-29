import { useState, useEffect } from 'preact/hooks';
import { ROMExplorer } from './views/ROMExplorer';

export function App() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Initialize services
    setInitialized(true);
  }, []);

  if (!initialized) {
    return <div class="loading">Initializing...</div>;
  }

  return <ROMExplorer />;
}
