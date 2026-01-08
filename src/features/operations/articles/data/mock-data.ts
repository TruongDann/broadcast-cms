import {
  type Article,
  type ArticleType,
  type ArticleStatus,
  type Assignment,
} from '../types'

// Mock data cho Tin bài - phù hợp với workflow quản lý tin bài
export const mockArticles: Article[] = [
  {
    id: '1',
    code: 'TB-2024-01-001',
    title: 'Phóng sự: Đổi mới công nghệ trong nông nghiệp ĐBSCL',
    topicId: 'topic-1',
    topicTitle: 'Nông nghiệp công nghệ cao vùng ĐBSCL',
    articleType: 'ptth',
    description: 'Phóng sự 15 phút về ứng dụng công nghệ cao trong nông nghiệp',
    scriptContent: 'Kịch bản phóng sự đã soạn...',
    assignedMembers: [
      {
        userId: '1',
        userName: 'Nguyễn Thu Hà',
        role: 'reporter',
        position: 'lead',
      },
      {
        userId: '5',
        userName: 'Hoàng Văn Nam',
        role: 'technician',
        position: 'cameraman',
      },
    ],
    status: 'cho_duyet_cap_1',
    priority: 'high',
    deadline: new Date('2024-01-20'),
    createdBy: '1',
    createdByName: 'Nguyễn Thu Hà',
    departmentId: '1',
    departmentName: 'Phòng Thời sự',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    code: 'TB-2024-01-002',
    title: 'Tin: Khai mạc Lễ hội Bánh dân gian Nam Bộ',
    topicId: 'topic-2',
    topicTitle: 'Lễ hội văn hóa ẩm thực Cần Thơ 2024',
    articleType: 'bao_dien_tu',
    description: 'Tin bài về Lễ hội Bánh dân gian Nam Bộ lần thứ X',
    content: 'Nội dung tin bài đã hoàn thành...',
    assignedMembers: [
      {
        userId: '2',
        userName: 'Lê Văn Thành',
        role: 'reporter',
        position: 'reporter',
      },
    ],
    status: 'da_xuat_ban',
    priority: 'medium',
    deadline: new Date('2024-01-12'),
    createdBy: '2',
    createdByName: 'Lê Văn Thành',
    departmentId: '2',
    departmentName: 'Phòng Tin tức',
    publishedAt: new Date('2024-01-12'),
    publishUrl: 'https://example.com/tin-bai-1',
    approvalLevel1: {
      approvedBy: 'Trưởng phòng Tin tức',
      approvedAt: new Date('2024-01-11'),
    },
    approvalLevel2: {
      approvedBy: 'Ban Biên tập',
      approvedAt: new Date('2024-01-12'),
    },
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: '3',
    code: 'TB-2024-01-003',
    title: 'Video: Hướng dẫn làm bánh tét cổ truyền',
    topicId: 'topic-3',
    topicTitle: 'Ẩm thực Tết cổ truyền',
    articleType: 'noi_dung_so',
    description: 'Video hướng dẫn nấu ăn đăng trên YouTube và Facebook',
    content: 'Nội dung video script...',
    assignedMembers: [
      {
        userId: '3',
        userName: 'Phạm Thu Trang',
        role: 'reporter',
        position: 'lead',
      },
    ],
    status: 'hau_ky',
    priority: 'medium',
    deadline: new Date('2024-01-25'),
    createdBy: '3',
    createdByName: 'Phạm Thu Trang',
    departmentId: '3',
    departmentName: 'Phòng Nội dung số',
    approvalLevel1: {
      approvedBy: 'Trưởng phòng NDS',
      approvedAt: new Date('2024-01-14'),
    },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-14'),
  },
  {
    id: '4',
    code: 'TB-2024-01-004',
    title: 'Bài: Triển vọng kinh tế Cần Thơ năm 2024',
    topicId: 'topic-4',
    topicTitle: 'Tổng kết kinh tế - xã hội năm 2023',
    articleType: 'bao_in',
    description: 'Bài phân tích chuyên sâu cho báo in số Xuân',
    content: 'Nội dung bài báo in...',
    assignedMembers: [
      {
        userId: '4',
        userName: 'Trần Minh Tuấn',
        role: 'reporter',
        position: 'lead',
      },
    ],
    status: 'cho_duyet_cap_2',
    priority: 'high',
    deadline: new Date('2024-01-28'),
    createdBy: '4',
    createdByName: 'Trần Minh Tuấn',
    departmentId: '4',
    departmentName: 'Phòng Kinh tế',
    approvalLevel1: {
      approvedBy: 'Trưởng phòng Kinh tế',
      approvedAt: new Date('2024-01-15'),
    },
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '5',
    code: 'TB-2024-01-005',
    title: 'Phóng sự: Cầu Cần Thơ - 10 năm phát triển',
    topicId: 'topic-5',
    topicTitle: 'Kỷ niệm 10 năm cầu Cần Thơ',
    articleType: 'ptth',
    description: 'Phóng sự đặc biệt 20 phút nhân kỷ niệm 10 năm cầu Cần Thơ',
    assignedMembers: [
      {
        userId: '1',
        userName: 'Nguyễn Thu Hà',
        role: 'reporter',
        position: 'lead',
      },
    ],
    status: 'tac_nghiep',
    priority: 'urgent',
    deadline: new Date('2024-01-30'),
    createdBy: '1',
    createdByName: 'Nguyễn Thu Hà',
    departmentId: '1',
    departmentName: 'Phòng Thời sự',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: '6',
    code: 'TB-2024-01-006',
    title: 'Post FB: Thông báo lịch phát sóng Tết',
    topicId: 'topic-6',
    topicTitle: 'Chương trình Tết Nguyên Đán 2024',
    articleType: 'noi_dung_so',
    description: 'Bài đăng Facebook thông báo lịch phát sóng dịp Tết',
    content: 'Nội dung bài đăng FB...',
    assignedMembers: [
      {
        userId: '6',
        userName: 'Lê Thị Mai',
        role: 'reporter',
        position: 'reporter',
      },
    ],
    status: 'cho_duyet_cap_1',
    priority: 'low',
    deadline: new Date('2024-02-01'),
    createdBy: '6',
    createdByName: 'Lê Thị Mai',
    departmentId: '3',
    departmentName: 'Phòng Nội dung số',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
  },
  {
    id: '7',
    code: 'TB-2024-01-007',
    title: 'Tin: UBND TP họp triển khai kế hoạch Tết',
    topicId: 'topic-7',
    topicTitle: 'Hoạt động chính quyền địa phương',
    articleType: 'bao_dien_tu',
    description: 'Tin tức về cuộc họp triển khai kế hoạch Tết của UBND TP',
    assignedMembers: [
      {
        userId: '2',
        userName: 'Lê Văn Thành',
        role: 'reporter',
        position: 'reporter',
      },
    ],
    status: 'tac_nghiep',
    priority: 'high',
    deadline: new Date('2024-01-16'),
    createdBy: '2',
    createdByName: 'Lê Văn Thành',
    departmentId: '2',
    departmentName: 'Phòng Tin tức',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '8',
    code: 'TB-2024-01-008',
    title: 'Bài: Làng nghề truyền thống đón Tết',
    topicId: 'topic-8',
    topicTitle: 'Tết cổ truyền và làng nghề',
    articleType: 'bao_in',
    description: 'Bài viết về các làng nghề truyền thống trong dịp Tết',
    content: 'Nội dung bài viết đã xong...',
    assignedMembers: [
      {
        userId: '4',
        userName: 'Trần Minh Tuấn',
        role: 'reporter',
        position: 'lead',
      },
    ],
    status: 'tu_choi',
    priority: 'medium',
    deadline: new Date('2024-01-22'),
    createdBy: '4',
    createdByName: 'Trần Minh Tuấn',
    departmentId: '4',
    departmentName: 'Phòng Kinh tế',
    approvalLevel1: {
      approvedBy: 'Trưởng phòng Kinh tế',
      approvedAt: new Date('2024-01-13'),
      comment: 'Cần bổ sung thêm thông tin số liệu',
    },
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-13'),
  },
]

// Legacy mock assignments for backward compatibility
export const mockAssignments: Assignment[] = []

// Get article statistics
export function getArticleStats() {
  const total = mockArticles.length
  const tacNghiep = mockArticles.filter((a) => a.status === 'tac_nghiep').length
  const choDuyetCap1 = mockArticles.filter(
    (a) => a.status === 'cho_duyet_cap_1'
  ).length
  const choDuyetCap2 = mockArticles.filter(
    (a) => a.status === 'cho_duyet_cap_2'
  ).length
  const hauKy = mockArticles.filter(
    (a) => a.status === 'hau_ky' || a.status === 'cho_duyet_hau_ky'
  ).length
  const daXuatBan = mockArticles.filter(
    (a) => a.status === 'da_xuat_ban'
  ).length
  const tuChoi = mockArticles.filter((a) => a.status === 'tu_choi').length

  // Count by article type
  const ptth = mockArticles.filter((a) => a.articleType === 'ptth').length
  const baoIn = mockArticles.filter((a) => a.articleType === 'bao_in').length
  const baoDienTu = mockArticles.filter(
    (a) => a.articleType === 'bao_dien_tu'
  ).length
  const noiDungSo = mockArticles.filter(
    (a) => a.articleType === 'noi_dung_so'
  ).length

  return {
    total,
    tacNghiep,
    choDuyetCap1,
    choDuyetCap2,
    hauKy,
    daXuatBan,
    tuChoi,
    byType: {
      ptth,
      baoIn,
      baoDienTu,
      noiDungSo,
    },
  }
}

// Get articles by type
export function getArticlesByType(type: ArticleType | 'all'): Article[] {
  if (type === 'all') return mockArticles
  return mockArticles.filter((a) => a.articleType === type)
}

// Get articles by status
export function getArticlesByStatus(status: ArticleStatus | 'all'): Article[] {
  if (status === 'all') return mockArticles
  return mockArticles.filter((a) => a.status === status)
}

// Legacy function for backward compatibility
export function getAssignmentStats() {
  return {
    total: mockArticles.length,
    pending: mockArticles.filter((a) => a.status === 'tac_nghiep').length,
    inProgress: mockArticles.filter((a) => a.status === 'cho_duyet_cap_1')
      .length,
    completed: mockArticles.filter((a) => a.status === 'da_xuat_ban').length,
    overdue: mockArticles.filter((a) => a.status === 'cho_duyet_cap_2').length,
    deadlinesThisWeek: 0,
    totalValue: 0,
  }
}

// Mock available employees
export const mockEmployees = [
  {
    id: '1',
    name: 'Nguyễn Thu Hà',
    role: 'reporter',
    department: 'Phòng Thời sự',
  },
  {
    id: '2',
    name: 'Lê Văn Thành',
    role: 'reporter',
    department: 'Phòng Tin tức',
  },
  {
    id: '3',
    name: 'Phạm Thu Trang',
    role: 'reporter',
    department: 'Phòng Nội dung số',
  },
  {
    id: '4',
    name: 'Trần Minh Tuấn',
    role: 'reporter',
    department: 'Phòng Kinh tế',
  },
  {
    id: '5',
    name: 'Hoàng Văn Nam',
    role: 'technician',
    department: 'Phòng Kỹ thuật',
  },
  {
    id: '6',
    name: 'Lê Thị Mai',
    role: 'reporter',
    department: 'Phòng Nội dung số',
  },
]
