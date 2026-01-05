// Types for Operations module - Vehicle and Equipment Allocation

export type AllocationStatus =
  | 'pending'       // Chờ duyệt
  | 'approved'      // Đã duyệt
  | 'in_use'        // Đang sử dụng
  | 'returned'      // Đã trả
  | 'conflict'      // Cảnh báo trùng lịch
  | 'rejected'      // Từ chối

export type VehicleType = 'car_4_7' | 'car_16' | 'van' | 'truck'
export type EquipmentType = 'camera' | 'microphone' | 'lighting' | 'audio' | 'other'

export interface Vehicle {
  id: string
  name: string
  licensePlate: string
  type: VehicleType
  seats: number
  status: 'available' | 'in_use' | 'maintenance'
  imageUrl?: string
}

export interface Equipment {
  id: string
  name: string
  code: string
  type: EquipmentType
  quantity: number
  available: number
  status: 'available' | 'in_use' | 'maintenance'
}

export interface AllocationRequest {
  id: string
  // Thông tin lịch công tác
  scheduleName: string
  scheduleType: 'phong_su' | 'tin_tuc' | 'phong_van' | 'talkshow' | 'khac'
  date: Date
  startTime: string
  endTime: string
  
  // Người đăng ký
  requesterId: string
  requesterName: string
  requesterAvatar?: string
  departmentName: string
  
  // Tài nguyên yêu cầu
  vehicles: Vehicle[]
  equipment: Equipment[]
  
  // Trạng thái
  status: AllocationStatus
  conflictReason?: string
  
  // Workflow
  workflow: WorkflowStep[]
  
  createdAt: Date
  updatedAt: Date
}

export interface WorkflowStep {
  step: 'register' | 'approve' | 'receive' | 'return'
  label: string
  status: 'completed' | 'current' | 'pending'
  timestamp?: Date
  note?: string
}

// Display configurations
export const ALLOCATION_STATUS_CONFIG: Record<
  AllocationStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  pending: { label: 'Chờ duyệt', variant: 'outline' },
  approved: { label: 'Đã duyệt', variant: 'secondary' },
  in_use: { label: 'Đang sử dụng', variant: 'default' },
  returned: { label: 'Đã trả', variant: 'secondary' },
  conflict: { label: 'Trùng lịch', variant: 'destructive' },
  rejected: { label: 'Từ chối', variant: 'destructive' },
}

export const VEHICLE_TYPE_CONFIG: Record<VehicleType, string> = {
  car_4_7: 'Xe 4-7 chỗ',
  car_16: 'Xe 16 chỗ',
  van: 'Xe Van',
  truck: 'Xe Tải',
}

export const EQUIPMENT_TYPE_CONFIG: Record<EquipmentType, string> = {
  camera: 'Máy quay',
  microphone: 'Micro',
  lighting: 'Đèn',
  audio: 'Âm thanh',
  other: 'Khác',
}

export const SCHEDULE_TYPE_CONFIG: Record<AllocationRequest['scheduleType'], string> = {
  phong_su: 'Phóng sự',
  tin_tuc: 'Tin tức',
  phong_van: 'Phỏng vấn',
  talkshow: 'Talkshow',
  khac: 'Khác',
}
