
export interface ServerHistoryPoint {
  time: string;
  players: number;
  tps: number;
}

export interface Server {
  id: number;
  name: string;
  address: string;
  version: string;
  status: 'online' | 'offline' | 'loading';
  players: { 
    online: number; 
    max: number 
  };
  tps?: number;
  uptime?: number;
  history?: ServerHistoryPoint[];
  // Добавляем поля для RCON
  rconEnabled?: boolean;
  rconPort?: number;
  rconPassword?: string;
}

// Настройки RCON-соединения
export interface RconSettings {
  enabled: boolean;
  host: string;
  port: number;
  password: string;
}

export type TimeRange = 'day' | 'week' | 'month';
