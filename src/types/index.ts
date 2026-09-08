export type UserType = 'CUSTOMER' | 'MERCHANT' | 'ADMIN';
export type ShopStatus = 'OPEN' | 'CLOSED' | 'BUSY';

export interface User {
  id: number;
  username: string;
  phone: string;
  userType: UserType;
  districtId?: number;
  mandalId?: number;
  villageId?: number;
  district?: { id: number; name: string };
  mandal?: { id: number; name: string };
  village?: { id: number; name: string };
}

export interface District {
  id: number;
  name: string;
}

export interface Mandal {
  id: number;
  name: string;
  districtId: number;
}

export interface Village {
  id: number;
  name: string;
  mandalId: number;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface Business {
  id: number;
  name: string;
  ownerName?: string;
  description?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  status: ShopStatus;
  openTime?: string;
  closeTime?: string;
  is24Hours: boolean;
  hasDelivery: boolean;
  imageUrl?: string;
  category?: Category;
  village?: Village;
  mandal?: Mandal;
  district?: District;
}

export interface RegisterPayload {
  username: string;
  phone: string;
  password: string;
  userType: UserType;
  districtId?: number;
  mandalId?: number;
  villageId?: number;
}

export interface LoginPayload {
  phone: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CommunityPost {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  category: string;
}
