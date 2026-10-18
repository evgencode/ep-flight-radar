import type { PlaneDetailed, PlaneStatus } from '../types/plane.ts';
import {
  formatAltitude,
  formatClock,
  formatCoord,
  formatHeading,
  formatInt,
  formatMinutes,
  formatSpeed,
  formatVerticalSpeed,
} from '../utils/format.ts';
import { Stat } from './Stat.tsx';

const STATUS_LABELS: Record<PlaneStatus, string> = {
  departed: 'Departed',
  enroute: 'En route',
  cruising: 'Cruising',
  landing: 'Landing',
};

type Props = {
  details: PlaneDetailed;
  receivedAt: number;
};

export function DetailsContent({ details, receivedAt }: Props) {
  // details.estimatedArrival - Estimated arrival ms | Date.now() + flightTimeHours * 3600_000; form now to 2 - 6 h
  // time of arrival - current time
  const remainingMin = Math.max(0, (details.estimatedArrival - receivedAt) / 60000);
  const total = details.flightDuration + remainingMin; // min
  const progress = total > 0 ? details.flightDuration / total : 0;

  const occupancy =
    details.maxPassengers > 0 ? details.numberOfPassengers / details.maxPassengers : 0;

  return (
    <>
      <header className="details-panel__header">
        <div className="details-panel__title">
          <h2>{details.flightNumber}</h2>
          <span className={`badge badge__${details.status}`}>{STATUS_LABELS[details.status]}</span>
        </div>
        <p className="details-panel__airline">{details.airline}</p>
        <p className="details-panel__aircraft">
          {details.model} · {details.registration} · {details.id}
        </p>
      </header>

      <section className="route">
        <div className="route__airport">
          <span className="route__code">{details.origin.airport}</span>
          <span className="route__city">{details.origin.city}</span>
        </div>
        <div className="route__track">
          <div className="route__line">
            <div className="route__progress" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
        <div className="route__airport route__airport--destination">
          <span className="route__code">{details.destination.airport}</span>
          <span className="route__city">{details.destination.city}</span>
        </div>
      </section>

      <div className="route__times">
        <span>
          Flying <strong>{formatMinutes(details.flightDuration)}</strong>
        </span>
        <span title="Estimated Time of Arrival">
          <span style={{ cursor: 'pointer' }}>
            <b>ⓘ</b> ETA
          </span>{' '}
          <strong>{formatClock(details.estimatedArrival)}</strong>
        </span>
      </div>

      <dl className="stats">
        <Stat label="Altitude" value={formatAltitude(details.altitude)} />
        <Stat label="Ground speed" value={formatSpeed(details.speed)} />
        <Stat label="Heading" value={formatHeading(details.heading)} />
        <Stat label="Vertical speed" value={formatVerticalSpeed(details.verticalSpeed)} />
        <Stat label="Latitude" value={{ primary: formatCoord(details.latitude, 'N', 'S') }} />
        <Stat label="Longitude" value={{ primary: formatCoord(details.longitude, 'E', 'W') }} />
      </dl>

      <section className="passengers">
        <div className="passengers__row">
          <span>Passengers</span>
          <span>
            <strong>{formatInt(details.numberOfPassengers)}</strong> /{' '}
            {formatInt(details.maxPassengers)} ({Math.round(occupancy * 100)}%)
          </span>
        </div>
        <div className="meter">
          <div className="meter__fill" style={{ width: `${occupancy * 100}%` }} />
        </div>
      </section>
    </>
  );
}
