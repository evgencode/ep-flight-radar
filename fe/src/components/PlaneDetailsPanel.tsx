import { usePlaneDetails } from '../hooks/usePlaneDetails';
import { DetailsContent } from './DetailsContent.tsx';

type Props = {
  planeId: string;
  onClose: () => void;
};

export function PlaneDetailsPanel({ planeId, onClose }: Props) {
  const { details, error } = usePlaneDetails(planeId);

  return (
    <aside
      className="details-panel"
      style={details ? { ['--plane-color' as string]: details.color } : undefined}
    >
      <button type="button" className="details-panel__close" onClick={onClose}>
        ×
      </button>
      {error ? (
        <div className="details-panel__message details-panel__message--error">
          <strong>Couldn't load {planeId}</strong>
          <p>{error}</p>
        </div>
      ) : !details ? (
        <div className="details-panel__message">
          <div className="spinner" />
          <p>Loading {planeId}…</p>
        </div>
      ) : (
        <DetailsContent details={details} />
      )}
    </aside>
  );
}
