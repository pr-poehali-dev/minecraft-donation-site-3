
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'moderator';
  avatar?: string;
}

export interface DonationService {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServerMonitoring {
  id: string;
  name: string;
  address: string;
  port: number;
  version: string;
  maxPlayers: number;
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServerStats {
  id: string;
  serverId: string;
  onlinePlayers: number;
  maxPlayers: number;
  ping: number;
  isOnline: boolean;
  version: string;
  motd: string;
  playerList: string[];
  lastUpdate: string;
}

export interface ServerHistoryStats {
  timestamp: string;
  onlinePlayers: number;
  ping: number;
  isOnline: boolean;
}