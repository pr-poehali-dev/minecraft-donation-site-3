
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
  version: string;
  maxPlayers: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
