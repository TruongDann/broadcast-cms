// Mock data for Operations module
import {
  type Vehicle,
  type Equipment,
  type AllocationRequest,
} from '../types'

// Mock Vehicles
export const mockVehicles: Vehicle[] = [
  {
    id: 'v1',
    name: 'Ford Transit',
    licensePlate: '29B-123.45',
    type: 'van',
    seats: 16,
    status: 'in_use',
  },
  {
    id: 'v2',
    name: 'Toyota Fortuner',
    licensePlate: '30A-999.99',
    type: 'car_4_7',
    seats: 7,
    status: 'in_use',
  },
  {
    id: 'v3',
    name: 'Honda CRV',
    licensePlate: '29A-567.89',
    type: 'car_4_7',
    seats: 5,
    status: 'available',
  },
  {
    id: 'v4',
    name: 'Hyundai Solati',
    licensePlate: '29B-111.22',
    type: 'car_16',
    seats: 16,
    status: 'maintenance',
  },
]

// Mock Equipment
export const mockEquipment: Equipment[] = [
  {
    id: 'e1',
    name: 'Sony FX6',
    code: 'EQ-089',
    type: 'camera',
    quantity: 3,
    available: 1,
    status: 'in_use',
  },
  {
    id: 'e2',
    name: 'Nikon D6',
    code: 'EQ-112',
    type: 'camera',
    quantity: 2,
    available: 1,
    status: 'available',
  },
  {
    id: 'e3',
    name: 'Sony Wireless Mic',
    code: 'EQ-045',
    type: 'microphone',
    quantity: 5,
    available: 3,
    status: 'available',
  },
  {
    id: 'e4',
    name: 'Nanlite 300B',
    code: 'EQ-078',
    type: 'lighting',
    quantity: 4,
    available: 2,
    status: 'available',
  },
]

// Mock Allocation Requests
export const mockAllocationRequests: AllocationRequest[] = [
  {
    id: 'ar1',
    scheduleName: 'Nông nghiệp sạch',
    scheduleType: 'phong_su',
    date: new Date(),
    startTime: '08:00',
    endTime: '12:00',
    requesterId: 'u1',
    requesterName: 'Nguyễn Văn A',
    requesterAvatar: '/avatars/01.png',
    departmentName: 'Ban Thời sự',
    vehicles: [mockVehicles[0]],
    equipment: [mockEquipment[0]],
    status: 'in_use',
    workflow: [
      { step: 'register', label: 'Đăng ký', status: 'completed', timestamp: new Date() },
      { step: 'approve', label: 'Đã duyệt', status: 'completed', timestamp: new Date() },
      { step: 'receive', label: 'Đã nhận', status: 'current', timestamp: new Date(), note: '07:50' },
      { step: 'return', label: 'Chờ trả', status: 'pending' },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'ar2',
    scheduleName: 'Tai nạn giao thông QL5',
    scheduleType: 'tin_tuc',
    date: new Date(),
    startTime: '14:00',
    endTime: '17:00',
    requesterId: 'u2',
    requesterName: 'Trần Thị B',
    requesterAvatar: '/avatars/02.png',
    departmentName: 'Ban Tin tức',
    vehicles: [mockVehicles[1]],
    equipment: [mockEquipment[1]],
    status: 'conflict',
    conflictReason: 'Xe Toyota Fortuner 30A-999.99 đã được cấp phát cho Ban Thời sự (13:30 - 16:30).',
    workflow: [
      { step: 'register', label: 'Đăng ký', status: 'completed', timestamp: new Date() },
      { step: 'approve', label: 'Chờ xử lý', status: 'current' },
      { step: 'receive', label: 'Nhận', status: 'pending' },
      { step: 'return', label: 'Trả', status: 'pending' },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'ar3',
    scheduleName: 'Talkshow Cuối tuần',
    scheduleType: 'phong_van',
    date: new Date(Date.now() + 86400000), // Tomorrow
    startTime: '09:00',
    endTime: '15:00',
    requesterId: 'u3',
    requesterName: 'Lê Văn C',
    requesterAvatar: '/avatars/03.png',
    departmentName: 'Ban Chuyên đề',
    vehicles: [],
    equipment: [mockEquipment[2], mockEquipment[3]],
    status: 'pending',
    workflow: [
      { step: 'register', label: 'Đăng ký', status: 'completed', timestamp: new Date() },
      { step: 'approve', label: 'Chờ duyệt', status: 'current' },
      { step: 'receive', label: 'Nhận', status: 'pending' },
      { step: 'return', label: 'Trả', status: 'pending' },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// Statistics
export const getOperationsStats = () => {
  const requests = mockAllocationRequests
  return {
    pending: requests.filter((r) => r.status === 'pending').length,
    inUse: requests.filter((r) => r.status === 'in_use').length,
    conflict: requests.filter((r) => r.status === 'conflict').length,
    completed: requests.filter((r) => r.status === 'returned').length + 12, // Mock: 12 completed today
  }
}

// Get vehicle availability
export const getVehicleAvailability = () => {
  const car47 = mockVehicles.filter((v) => v.type === 'car_4_7')
  const car16 = mockVehicles.filter((v) => v.type === 'car_16')
  const cameras = mockEquipment.filter((e) => e.type === 'camera')

  return {
    car47: {
      total: car47.length,
      available: car47.filter((v) => v.status === 'available').length,
    },
    car16: {
      total: car16.length,
      available: car16.filter((v) => v.status === 'available').length,
    },
    cameras: {
      total: cameras.reduce((sum, e) => sum + e.quantity, 0),
      available: cameras.reduce((sum, e) => sum + e.available, 0),
    },
  }
}

// Recent activities
export const recentActivities = [
  {
    id: 'a1',
    type: 'receive',
    user: 'Nguyễn Văn A',
    item: 'Sony FX6',
    time: 'Vừa xong',
    note: 'Ảnh xác nhận',
  },
  {
    id: 'a2',
    type: 'return',
    user: 'Trần Thị B',
    item: 'Ford Transit',
    time: '30 phút trước',
    note: 'Tình trạng: Nguyên vẹn, đã rửa xe.',
  },
  {
    id: 'a3',
    type: 'warning',
    user: 'Hệ thống',
    item: 'Toyota Fortuner',
    time: '1 giờ trước',
    note: 'Cảnh báo trùng lịch xe (Lê Văn C).',
  },
]
