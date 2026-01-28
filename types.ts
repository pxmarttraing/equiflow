
export enum ItemStatus {
  AVAILABLE = 'AVAILABLE',
  BORROWED = 'BORROWED',
  RESERVED = 'RESERVED',
  MAINTENANCE = 'MAINTENANCE'
}

export enum ReservationStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  status: ItemStatus;
  specifications?: string;
  currentHolderId?: string;
  currentHolderName?: string;
  imageUrl?: string;
}

export interface Reservation {
  id: string;
  userId: string;
  userName: string;
  itemIds: string[];
  startDate: string;
  endDate: string;
  status: ReservationStatus;
  createdAt: string;
  verifiedBy?: string;
  notified?: boolean; // 紀錄是否已發送過提醒
}

export interface User {
  id: string;
  name: string;
  role: 'employee' | 'admin';
  password?: string;
  email?: string; // 新增 Email 欄位
}
