import { JSX } from 'preact';

interface FileListProps {
  files: string[];
  selected?: string;
  onSelect?: (file: string) => void;
}

export function FileList({ files, selected, onSelect }: FileListProps): JSX.Element {
  return (
    <div class="file-list">
      <h3>Files</h3>
      <ul>
        {files.map((file) => (
          <li
            key={file}
            class={`file-item ${selected === file ? 'selected' : ''}`}
            onClick={() => onSelect?.(file)}
          >
            {file}
          </li>
        ))}
      </ul>
    </div>
  );
}
