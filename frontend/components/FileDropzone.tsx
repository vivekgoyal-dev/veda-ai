"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, FileText } from "lucide-react";

interface FileDropzoneProps {
  onText: (text: string, filename: string) => void;
  onClear: () => void;
  fileName?: string;
}

const MAX_BYTES = 10 * 1024 * 1024; // 10MB cap shown in design

export function FileDropzone({ onText, onClear, fileName }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      if (file.size > MAX_BYTES) {
        setError("File is larger than 10MB.");
        return;
      }
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      const textLike = ["txt", "md", "csv", "json"].includes(ext);
      try {
        if (textLike) {
          const text = await file.text();
          onText(text.slice(0, 20000), file.name);
        } else {
          onText(`[Reference file: ${file.name}]`, file.name);
        }
      } catch (e) {
        setError((e as Error).message);
      }
    },
    [onText]
  );

  return (
    <div className="flex flex-col gap-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
          dragging
            ? "border-[color:var(--accent)] bg-accent-soft"
            : "border-border bg-surface-muted"
        }`}
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-foreground-muted shadow-sm">
          <Upload className="h-5 w-5" strokeWidth={1.8} />
        </div>

        {fileName ? (
          <div className="flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-sm">
            <FileText className="h-4 w-4 text-[color:var(--accent)]" />
            <span className="truncate max-w-[16rem]">{fileName}</span>
            <button
              type="button"
              onClick={onClear}
              className="ml-1 text-[color:var(--foreground-muted)] hover:text-foreground"
              aria-label="Remove file"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <>
            <div className="text-sm font-medium text-foreground">
              Choose a file or drag &amp; drop it here
            </div>
            <div className="text-xs text-[color:var(--foreground-subtle)]">
              JPEG, PNG, TXT, MD — up to 10MB
            </div>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="btn-ghost mt-1"
            >
              Browse Files
            </button>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.txt,.md,.csv,.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
      </div>
      <p className="text-center text-xs text-[color:var(--foreground-subtle)]">
        Upload images of your preferred document/image
      </p>
      {error && (
        <p className="text-center text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
