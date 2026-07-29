import { useState } from 'preact/hooks';
import { JSX } from 'preact';
import { Tabs } from '../components/Tabs';
import { FileList } from '../components/FileList';
import { MetadataEditor } from '../components/MetadataEditor';
import { storageService } from '../services/StorageService';
import { romMetadataService, ROMMetadata } from '../services/ROMMetadataService';
import {
  storeService,
  originsSignal,
  activeOriginIdSignal,
  loadingSignal,
  errorSignal,
} from '../services/StoreService';

export function ROMExplorer(): JSX.Element {
  const [storageNodes, setStorageNodes] = useState<Map<string, any>>(new Map());
  const [selectedFileContent, setSelectedFileContent] = useState<ArrayBuffer | undefined>();

  const originsMap = originsSignal.value instanceof Map ? originsSignal.value : new Map<string, any>();
  const activeOrigin = activeOriginIdSignal.value ? originsMap.get(activeOriginIdSignal.value) : undefined;
  const files = activeOrigin?.files || [];
  const selectedFile = activeOrigin?.selectedFile;
  const selectedMetadata = selectedFile ? activeOrigin?.metadata?.get(selectedFile) : undefined;

  const handleOpenFolder = async () => {
    try {
      storeService.setLoading(true);
      storeService.setError(undefined);

      // Create a storage node for this origin
      const nodeInstance = storageService.createNodeInstance();
      const initialized = await nodeInstance.initialize();
      if (!initialized) {
        return;
      }

      const path = nodeInstance.getPath();
      const name = path?.split('/').pop() || 'Folder';
      const originId = `origin-${Date.now()}`;

      // Store the node instance
      const nodes = new Map(storageNodes);
      nodes.set(originId, nodeInstance);
      setStorageNodes(nodes);

      // Load files
      const fileList = await nodeInstance.listFiles();

      // Create and add origin
      const newOrigin = {
        id: originId,
        name,
        path,
        files: fileList,
        metadata: new Map(),
      };

      storeService.addOrigin(newOrigin);
    } catch (err) {
      storeService.setError(err instanceof Error ? err.message : 'Failed to open folder');
    } finally {
      storeService.setLoading(false);
    }
  };

  const handleSelectOrigin = (originId: string) => {
    storeService.setActiveOrigin(originId);
  };

  const handleCloseOrigin = (originId: string) => {
    storeService.removeOrigin(originId);
    const nodes = new Map(storageNodes);
    nodes.delete(originId);
    setStorageNodes(nodes);
  };

  const handleSelectFile = async (file: string) => {
    try {
      storeService.setError(undefined);
      storeService.setSelectedFile(file);

      const node = storageNodes.get(activeOriginIdSignal.value!);
      if (!node) return;

      const content = await node.readFile(file);
      setSelectedFileContent(content);
      
      const metadata = romMetadataService.parseMetadata(file, content.byteLength);
      storeService.setMetadata(file, metadata);
    } catch (err) {
      storeService.setError(err instanceof Error ? err.message : 'Failed to read file');
    }
  };

  const handleMetadataChange = (metadata: ROMMetadata) => {
    if (selectedFile) {
      storeService.setMetadata(selectedFile, metadata);
    }
  };

  return (
    <div class="rom-explorer">
      <header class="explorer-header">
        <h1>ROM Manager</h1>
        <Tabs
          origins={Array.from(originsMap.values())}
          activeOriginId={activeOriginIdSignal.value}
          onSelectOrigin={handleSelectOrigin}
          onClose={handleCloseOrigin}
          onAddOrigin={handleOpenFolder}
        />
      </header>

      {errorSignal.value && <div class="error-message">{errorSignal.value}</div>}

      {originsMap.size === 0 ? (
        <div class="empty-state-full">
          <p>No folders opened</p>
          <button onClick={handleOpenFolder} disabled={loadingSignal.value}>
            {loadingSignal.value ? 'Opening...' : 'Open Folder'}
          </button>
        </div>
      ) : (
        <div class="explorer-container">
          <FileList files={files} selected={selectedFile} onSelect={handleSelectFile} />

          <div class="details-pane">
            {selectedMetadata ? (
              <MetadataEditor 
                metadata={selectedMetadata} 
                onChange={handleMetadataChange}
                fileName={selectedFile}
                fileContent={selectedFileContent}
              />
            ) : (
              <div class="empty-state">Select a ROM to view metadata</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
