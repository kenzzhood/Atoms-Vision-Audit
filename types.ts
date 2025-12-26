export enum UserRole {
  NONE = 'NONE',
  VENDOR = 'VENDOR',
  RIDER = 'RIDER',
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN'
}

export interface Order {
  id: string;
  status: 'pending' | 'verified' | 'in_transit' | 'damaged' | 'delivered';
  timestamp: string;
  location: string;
  chainOfCustody: number; // percentage
}

export enum ScanState {
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  PROCESSING = 'PROCESSING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}
