import { memo } from 'react';
import type { SocketStatus } from '../lib/ReconnectingSocket';

const LABELS: Record<SocketStatus, string> = {
  connecting: 'Connecting…',
  open: 'Live',
  reconnecting: 'Reconnecting…',
  closed: 'Offline',
};

type Props = {
  status: SocketStatus;
  planeCount: number;
};

export const StatusBar = memo(({ status, planeCount }: Props) => {
  return (
    <header className="status-bar">
      <div className="status-bar__label">
        <h1>EP Flight Radar</h1>
      </div>
      <div className="status-bar__info">
        <span className={`status-dot status-dot__${status}`} />
        <span role="status">{LABELS[status]}</span>
        <span className="status-bar__sep">✈️</span>
        <span>planes: {planeCount}</span>
      </div>
    </header>
  );
});
