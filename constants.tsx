
import { EquipmentItem, ItemStatus, User } from './types';

export const MOCK_ITEMS: EquipmentItem[] = [
  { id: '1', name: 'MacBook Pro 16"', category: 'Laptops', status: ItemStatus.AVAILABLE, specifications: 'M3 Max, 64GB RAM, 1TB SSD' },
  { id: '2', name: 'iPad Pro 12.9"', category: 'Tablets', status: ItemStatus.BORROWED, currentHolderName: 'Alice Chen', currentHolderId: 'u1', specifications: 'M2 Chip, 256GB, Space Gray' },
  { id: '3', name: 'Logitech MX Master 3', category: 'Accessories', status: ItemStatus.AVAILABLE, specifications: 'Wireless, Graphite' },
  { id: '4', name: 'Dell UltraSharp 27"', category: 'Monitors', status: ItemStatus.AVAILABLE, specifications: '4K UHD, USB-C Hub' },
  { id: '5', name: 'Sony WH-1000XM4', category: 'Audio', status: ItemStatus.AVAILABLE, specifications: 'Noise Canceling, Black' },
  { id: '6', name: 'Focusrite Scarlett 2i2', category: 'Audio', status: ItemStatus.AVAILABLE, specifications: '3rd Gen USB Audio Interface' },
  { id: '7', name: 'Herman Miller Aeron', category: 'Furniture', status: ItemStatus.AVAILABLE, specifications: 'Size B, PostureFit SL' },
  { id: '8', name: 'Insta360 Link', category: 'Cameras', status: ItemStatus.AVAILABLE, specifications: '4K AI Webcam' },
  { id: 'p1', name: '延長線 5M (A)', category: 'Accessories', status: ItemStatus.AVAILABLE, specifications: '6座1切, 獨立開關' },
  { id: 'p2', name: '延長線 5M (B)', category: 'Accessories', status: ItemStatus.AVAILABLE, specifications: '6座1切, 獨立開關' },
];

export const AUTHORIZED_USERS: User[] = [
  { id: 'u101', name: '陳小明 (員工)', role: 'employee', password: '1234', email: 'xiaoming@company.com' },
  { id: 'u102', name: '王大同 (管理員)', role: 'admin', password: '1234', email: 'datong.admin@company.com' },
  { id: 'u103', name: '李阿華 (員工)', role: 'employee', password: '1234', email: 'ahua.li@company.com' },
];

export const DEFAULT_USER = AUTHORIZED_USERS[0];
