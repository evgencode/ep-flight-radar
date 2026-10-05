import { isServerMessage, type ServerMessage } from '../types/plane';

export type SocketStatus = 'connecting' | 'open' | 'reconnecting' | 'closed';

type Options = {
  onMessage: (message: ServerMessage) => void;
  onOpen?: () => void;
  onStatusChange?: (status: SocketStatus) => void;
};

const MIN_RETRY_MS = 1000;
const MAX_ATTEMPTS = 7;

export class ReconnectingSocket {
  private readonly url: string;
  private readonly options: Options;
  private ws: WebSocket | null = null;
  private attempt = 0;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private stopped = true;
  private status: SocketStatus = 'closed';

  constructor(url: string, options: Options) {
    this.url = url;
    this.options = options;
  }

  start() {
    if (!this.stopped) return;
    this.stopped = false;
    this.connect();
  }

  stop() {
    this.stopped = true;
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }
    this.retryTimer = null;
    const ws = this.ws;
    this.ws = null;
    if (ws) {
      ws.onmessage = ws.onclose = ws.onerror = null;
      if (ws.readyState === WebSocket.CONNECTING) {
        // Closing a socket mid-handshake logs a browser warning; close it once it opens instead.
        ws.onopen = () => ws.close();
      } else {
        ws.onopen = null;
        ws.close();
      }
    }
    this.setStatus('closed');
  }

  /** Returns false if the socket is not open yet (message is dropped). */
  send(message: unknown): boolean {
    if (this.ws?.readyState !== WebSocket.OPEN) return false;
    this.ws.send(JSON.stringify(message));
    return true;
  }

  private connect() {
    this.setStatus(this.attempt === 0 ? 'connecting' : 'reconnecting');
    const ws = new WebSocket(this.url);
    this.ws = ws;

    ws.onopen = () => {
      this.attempt = 0;
      this.setStatus('open');
      this.options.onOpen?.();
    };

    ws.onmessage = event => {
      let parsed: unknown;
      try {
        parsed = JSON.parse(String(event.data));
      } catch {
        console.warn('[ws] invalid JSON received', event.data);
        return;
      }
      if (isServerMessage(parsed)) {
        this.options.onMessage(parsed);
      } else {
        console.warn('[ws] unknown message', parsed);
      }
    };

    ws.onclose = () => {
      if (this.ws !== ws) return;
      this.ws = null;
      if (this.stopped) return;
      this.scheduleReconnect();
    };

    ws.onerror = error => {
      if (this.ws !== ws) return;
      console.error('[ws] error encountered:', error);
    };
  }

  private scheduleReconnect() {
    if (this.attempt >= MAX_ATTEMPTS) {
      console.warn(`[ws] Maximum reconnect attempts (${MAX_ATTEMPTS}) reached`);
      this.stop();
      return;
    }
    const backoff = MIN_RETRY_MS * 2 ** this.attempt;
    const jitter = Math.random() * 200;
    const MAX_RETRY_MS = MIN_RETRY_MS * 2 ** (MAX_ATTEMPTS - 1); // 1000 * 2 ** 6 (64s)
    const delay = Math.min(MAX_RETRY_MS, backoff + jitter);
    this.attempt += 1;
    this.setStatus('reconnecting');

    this.retryTimer = setTimeout(() => {
      this.retryTimer = null;
      if (!this.stopped) {
        this.connect();
      }
    }, delay);
  }

  private setStatus(status: SocketStatus) {
    if (status === this.status) return;
    this.status = status;
    this.options.onStatusChange?.(status);
  }
}
