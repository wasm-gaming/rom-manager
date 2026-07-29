import { useState } from 'preact/hooks';
import { JSX } from 'preact';
import { Tabs } from '../components/Tabs';
import { FileTree } from '../components/FileTree';
import { MetadataEditor } from '../components/MetadataEditor';
import { storageService, StorageNode } from '../services/StorageService';
import { romMetadataService, ROMMetadata } from '../services/ROMMetadataService';
import {
  storeService,
  originsSignal,
  activeOriginIdSignal,
  loadingSignal,
  errorSignal,
} from '../services/StoreService';

export function ROMExplorer(): JSX.Element {
  const [storageNodes, setStorageNodes] = useState<Map<string, StorageNode>>(new Map());
  const [selectedFileContent, setSelectedFileContent] = useState<ArrayBuffer | undefined>();

  const originsMap = originsSignal.value instanceof Map ? originsSignal.value : new Map<string, any>();
  const activeOriginId = activeOriginIdSignal.value;
  const activeOrigin = activeOriginId ? originsMap.get(activeOriginId) : undefined;
  const activeNode = activeOriginId ? storageNodes.get(activeOriginId) : undefined;
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

      // Create and add origin
      const newOrigin = {
        id: originId,
        name,
        path,
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

      const bytes = await node.readFile(file);
      // Checksums work on a plain ArrayBuffer, so detach the view from the pool.
      const content = new ArrayBuffer(bytes.byteLength);
      new Uint8Array(content).set(bytes);
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

  const handleRemoved = (paths: string[]) => {
    const removesSelection =
      selectedFile &&
      paths.some((path) => selectedFile === path || selectedFile.startsWith(`${path}/`));

    if (!removesSelection) return;

    storeService.setSelectedFile(undefined);
    setSelectedFileContent(undefined);
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
          {activeNode && (
            <FileTree
              key={activeOriginId}
              node={activeNode}
              selectedFile={selectedFile}
              onSelectFile={handleSelectFile}
              onRemoved={handleRemoved}
            />
          )}

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
