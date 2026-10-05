import { useCallback, useEffect, useState } from 'react';
import './App.css';
import { FlightMap } from './components/FlightMap';
import { PlaneDetailsPanel } from './components/PlaneDetailsPanel';

function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Clicking the selected plane again deselects it. current === id ? null
  const handleSelect = useCallback((id: string) => {
    setSelectedId(current => (current === id ? null : id));
  }, []);
  const handleDeselect = useCallback(() => setSelectedId(null), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedId(null); // deselect detail on esc
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <div className="app">
      <FlightMap selectedId={selectedId} onSelect={handleSelect} onDeselect={handleDeselect} />
      {/* Detail plane information */}
      {selectedId && <PlaneDetailsPanel planeId={selectedId} onClose={handleDeselect} />}
    </div>
  );
}

export default App;
