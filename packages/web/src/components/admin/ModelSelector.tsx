/**
 * Model Selector Component
 *
 * Dropdown for selecting Claude model (Sonnet, Opus, Haiku).
 */


export interface ClaudeModel {
  id: string;
  name: string;
  description: string;
}

interface ModelSelectorProps {
  models: ClaudeModel[];
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  disabled?: boolean;
}

export function ModelSelector({
  models,
  selectedModel,
  onModelChange,
  disabled = false
}: ModelSelectorProps) {
  return (
    <div className="model-selector">
      <label htmlFor="model-select" className="model-label">
        Claude Model
      </label>
      <select
        id="model-select"
        className="model-select"
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value)}
        disabled={disabled}
      >
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
      <p className="model-description">
        {models.find(m => m.id === selectedModel)?.description || ''}
      </p>

      <style>{`
        .model-selector {
          margin-bottom: 1rem;
        }

        .model-label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #374151;
        }

        .model-select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 1rem;
          background-color: white;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .model-select:hover:not(:disabled) {
          border-color: #9ca3af;
        }

        .model-select:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .model-select:disabled {
          background-color: #f3f4f6;
          cursor: not-allowed;
        }

        .model-description {
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}

export default ModelSelector;
