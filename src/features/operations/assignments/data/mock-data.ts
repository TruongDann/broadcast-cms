import { type Assignment } from '../types'

// Mock data based on the provided image
export const mockAssignments: Assignment[] = [
  {
    id: '1',
    code: 'DH-2023-11-005',
    topicTitle: 'Sản xuất TVC Quảng cáo VinFast',
    clientName: 'VinFast...',
    clientAvatar: 'VF',
    serviceType: 'quang_cao_tvc',
    description: 'Sản xuất TVC 30 giây cho chiến dịch quảng bá xe điện VinFast',
    assignedMembers: [
      {
        userId: '1',
        userName: 'Nguyễn Thu Hà',
        role: 'reporter',
        position: 'lead',
      },
    ],
    estimatedValue: 150000000,
    progress: 70,
    priority: 'high',
    status: 'in_progress',
    startDate: new Date('2023-10-15'),
    deadline: new Date('2023-11-20'),
    deliverables: ['1 TVC', '30 giây'],
    createdBy: '1',
    createdByName: 'Nguyễn Thu Hà',
    departmentId: '1',
    departmentName: 'Phòng Sản xuất',
    createdAt: new Date('2023-10-15'),
    updatedAt: new Date('2023-11-15'),
  },
  {
    id: '2',
    code: 'DH-2023-11-004',
    topicTitle: 'Khai trương khu nghỉ dưỡng mới tại Phú Quốc',
    clientName: 'Sun Group...',
    clientAvatar: 'SH',
    serviceType: 'tin_tuc_dat_hang',
    description: 'Bộ 3 tin bài và video giới thiệu khu nghỉ dưỡng mới',
    assignedMembers: [
      {
        userId: '2',
        userName: 'Lê Văn Thành',
        role: 'reporter',
        position: 'lead',
      },
    ],
    estimatedValue: 45000000,
    progress: 100,
    priority: 'medium',
    status: 'completed',
    startDate: new Date('2023-10-12'),
    deadline: new Date('2023-10-25'),
    deliverables: ['3 Tin bài', 'Web + Video'],
    createdBy: '2',
    createdByName: 'Lê Văn Thành',
    departmentId: '1',
    departmentName: 'Phòng Sản xuất',
    createdAt: new Date('2023-10-12'),
    updatedAt: new Date('2023-10-25'),
  },
  {
    id: '3',
    code: 'DH-2023-11-006',
    topicTitle: 'Lễ kỷ niệm 35 năm thành lập chi nhánh Cần Thơ',
    clientName: 'Vietinbank C...',
    clientAvatar: 'VI',
    serviceType: 'su_kien_livestream',
    description: 'Sự kiện livestream lễ kỷ niệm 35 năm',
    assignedMembers: [
      {
        userId: '3',
        userName: 'Phạm Thu Trang',
        role: 'reporter',
        position: 'lead',
      },
    ],
    estimatedValue: 80000000,
    progress: 0,
    priority: 'urgent',
    status: 'overdue',
    startDate: new Date('2023-10-18'),
    deadline: new Date('2023-11-05'),
    deliverables: ['1 Sự kiện', 'Livestream 3h'],
    createdBy: '3',
    createdByName: 'Phạm Thu Trang',
    departmentId: '2',
    departmentName: 'Phòng Tin tức',
    createdAt: new Date('2023-10-18'),
    updatedAt: new Date('2023-11-05'),
  },
  {
    id: '4',
    code: 'DH-2023-11-007',
    topicTitle: 'Di sản văn hóa phi vật thể vùng Đồng bằng sông Cửu Long',
    clientName: 'Sở Văn hóa &...',
    clientAvatar: 'TH',
    serviceType: 'phong_su_tai_lieu',
    description: 'Phóng sự tài liệu về di sản văn hóa phi vật thể',
    assignedMembers: [
      {
        userId: '4',
        userName: 'Trần Minh Tuấn',
        role: 'reporter',
        position: 'lead',
      },
    ],
    estimatedValue: 120000000,
    progress: 0,
    priority: 'high',
    status: 'pending',
    startDate: new Date('2023-10-20'),
    deadline: new Date('2023-12-15'),
    deliverables: ['1 Phóng sự', '15 phút'],
    createdBy: '4',
    createdByName: 'Trần Minh Tuấn',
    departmentId: '1',
    departmentName: 'Phòng Sản xuất',
    createdAt: new Date('2023-10-20'),
    updatedAt: new Date('2023-10-20'),
  },
  {
    id: '5',
    code: 'DH-2023-11-008',
    topicTitle: 'Giới thiệu sản phẩm mới Oppo Find X6',
    clientName: 'Oppo Vietnam',
    clientAvatar: 'OP',
    serviceType: 'quang_cao_tvc',
    description: 'TVC quảng cáo điện thoại Oppo Find X6',
    assignedMembers: [],
    estimatedValue: 95000000,
    progress: 0,
    priority: 'medium',
    status: 'pending',
    startDate: new Date('2023-11-01'),
    deadline: new Date('2023-11-30'),
    deliverables: ['1 TVC', '45 giây'],
    createdBy: '1',
    createdByName: 'Nguyễn Thu Hà',
    departmentId: '1',
    departmentName: 'Phòng Sản xuất',
    createdAt: new Date('2023-11-01'),
    updatedAt: new Date('2023-11-01'),
  },
  {
    id: '6',
    code: 'DH-2023-11-009',
    topicTitle: 'Hội nghị khách hàng thường niên 2023',
    clientName: 'FPT Software',
    clientAvatar: 'FP',
    serviceType: 'su_kien_livestream',
    description: 'Livestream hội nghị khách hàng thường niên',
    assignedMembers: [
      {
        userId: '5',
        userName: 'Hoàng Văn Nam',
        role: 'technician',
        position: 'cameraman',
      },
      {
        userId: '6',
        userName: 'Lê Thị Mai',
        role: 'reporter',
        position: 'reporter',
      },
    ],
    estimatedValue: 65000000,
    progress: 45,
    priority: 'high',
    status: 'in_progress',
    startDate: new Date('2023-11-05'),
    deadline: new Date('2023-11-25'),
    deliverables: ['1 Sự kiện', 'Livestream 4h'],
    createdBy: '5',
    createdByName: 'Hoàng Văn Nam',
    departmentId: '2',
    departmentName: 'Phòng Kỹ thuật',
    createdAt: new Date('2023-11-05'),
    updatedAt: new Date('2023-11-10'),
  },
]

// Get assignments statistics
export function getAssignmentStats() {
  const total = mockAssignments.length
  const pending = mockAssignments.filter((a) => a.status === 'pending').length
  const inProgress = mockAssignments.filter((a) => a.status === 'in_progress').length
  const completed = mockAssignments.filter((a) => a.status === 'completed').length
  const overdue = mockAssignments.filter((a) => a.status === 'overdue').length
  
  // Get deadlines this week
  const now = new Date()
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  const deadlinesThisWeek = mockAssignments.filter(
    (a) => a.deadline >= now && a.deadline <= weekFromNow && a.status !== 'completed'
  ).length
  
  // Calculate total value
  const totalValue = mockAssignments.reduce((sum, a) => sum + a.estimatedValue, 0)
  
  return {
    total,
    pending,
    inProgress,
    completed,
    overdue,
    deadlinesThisWeek,
    totalValue,
  }
}

// Mock available employees for assignment
export const mockEmployees = [
  { id: '1', name: 'Nguyễn Thu Hà', role: 'reporter', department: 'Phòng Sản xuất' },
  { id: '2', name: 'Lê Văn Thành', role: 'reporter', department: 'Phòng Sản xuất' },
  { id: '3', name: 'Phạm Thu Trang', role: 'reporter', department: 'Phòng Tin tức' },
  { id: '4', name: 'Trần Minh Tuấn', role: 'reporter', department: 'Phòng Sản xuất' },
  { id: '5', name: 'Hoàng Văn Nam', role: 'technician', department: 'Phòng Kỹ thuật' },
  { id: '6', name: 'Lê Thị Mai', role: 'reporter', department: 'Phòng Tin tức' },
  { id: '7', name: 'Nguyễn Đức Anh', role: 'editor', department: 'Phòng Sản xuất' },
  { id: '8', name: 'Trần Thị Bích', role: 'technician', department: 'Phòng Kỹ thuật' },
]
