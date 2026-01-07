// Mock data for Topics feature
import { MOCK_USERS } from '@/stores/auth-store'
import { type Topic, type ContentType, type TopicStatus } from '../types'

// Helper to generate random date within range
const randomDate = (start: Date, end: Date): Date => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  )
}

// Content types
const contentTypes: ContentType[] = [
  'broadcast',
  'print',
  'digital',
  'social',
  'combo',
]

// Statuses
const statuses: TopicStatus[] = [
  'draft',
  'pending',
  'revision_required',
  'approved',
  'rejected',
]

// Sample topic data with more realistic content for a TV station
const topicSamples = [
  {
    title: 'Phóng sự: Chợ nổi Cái Răng - Bảo tồn và phát triển du lịch',
    outline:
      '<p>Khai thác vẻ đẹp văn hóa chợ nổi, phỏng vấn tiểu thương và du khách. Đề xuất các giải pháp bảo tồn văn hóa sông nước kết hợp phát triển du lịch bền vững.</p><ul><li>Bối cảnh: Chợ nổi sáng sớm</li><li>Nhân vật: Cô Tư bán bún riêu, Anh Ba lái tàu</li><li>Vấn đề: Ô nhiễm môi trường, sự cạnh tranh của đường bộ</li></ul>',
    type: 'broadcast',
  },
  {
    title: 'Tin tức: Lễ khánh thành cầu Cần Thơ 2 - Kết nối giao thương',
    outline:
      '<p>Ghi nhận không khí buổi lễ, phát biểu của lãnh đạo thành phố và Bộ GTVT. Phỏng vấn người dân về kỳ vọng đổi thay kinh tế.</p>',
    type: 'broadcast',
  },
  {
    title: 'Ký sự: Người giữ hồn đờn ca tài tử Nam Bộ',
    outline:
      '<p>Chân dung nghệ nhân ưu tú Nguyễn Văn A. Hành trình 50 năm gắn bó với nghệ thuật truyền thống. Những trăn trở về việc truyền nghề cho thế hệ trẻ.</p>',
    type: 'combo',
  },
  {
    title: 'Điều tra: Tình trạng sạt lở bờ sông Hậu - Báo động đỏ',
    outline:
      '<p>Ghi nhận tại các điểm nóng sạt lở. Phỏng vấn các hộ dân bị ảnh hưởng. Ý kiến chuyên gia về nguyên nhân và giải pháp công trình/phi công trình.</p>',
    type: 'broadcast',
  },
  {
    title: 'Talkshow: Khởi nghiệp nông nghiệp công nghệ cao',
    outline:
      '<p>Khách mời: CEO Farm Xanh. Chia sẻ kinh nghiệm ứng dụng IoT vào trồng dưa lưới. Cơ hội và thách thức cho thanh niên nông thôn.</p>',
    type: 'digital',
  },
  {
    title: 'Tin nhanh: Cập nhật tình hình triều cường rằm tháng 9',
    outline:
      '<p>Thông tin các tuyến đường ngập sâu nội ô. Cảnh báo đỉnh triều và khung giờ ngập. Hướng dẫn người dân tham gia giao thông an toàn.</p>',
    type: 'social',
  },
  {
    title: 'Phóng sự ảnh: Mùa hoa hoàng yến rực vàng phố thị',
    outline:
      '<p>Bộ ảnh ghi lại vẻ đẹp đường phố Cần Thơ mùa hoa nở. Góc nhìn nghệ thuật về kiến trúc đô thị hòa quyện thiên nhiên.</p>',
    type: 'print',
  },
  {
    title: 'Thực tế: Một ngày làm công nhân vệ sinh môi trường',
    outline:
      '<p>Trải nghiệm thực tế công việc vất vả của công nhân vệ sinh đêm khuya. Thông điệp về ý thức bảo vệ môi trường đô thị.</p>',
    type: 'broadcast',
  },
  {
    title: 'Văn hóa: Ẩm thực đường phố - Nét duyên thầm đất Tây Đô',
    outline:
      '<p>Khám phá các món ăn vặt trứ danh: chuối nếp nướng, bánh cống, nem nướng. Câu chuyện văn hóa đằng sau mỗi món ăn.</p>',
    type: 'social',
  },
  {
    title: 'Giáo dục: Chuyển đổi số trong trường học vùng ven',
    outline:
      '<p>Mô hình lớp học thông minh tại huyện Phong Điền. Hiệu quả từ việc ứng dụng bảng tương tác và học liệu số.</p>',
    type: 'digital',
  },
  {
    title: 'Nông nghiệp: Mô hình nuôi lươn không bùn hiệu quả cao',
    outline:
      '<p>Giới thiệu kỹ thuật nuôi mới. Hiệu quả kinh tế so với nuôi truyền thống. Đầu ra sản phẩm và tiềm năng xuất khẩu.</p>',
    type: 'broadcast',
  },
  {
    title: 'Y tế: Bệnh viện Đột quỵ Cần Thơ - Điểm sáng y tế vùng ĐBSCL',
    outline:
      '<p>Ứng dụng công nghệ AI trong chẩn đoán sớm đột quỵ. Các ca cứu sống ngoạn mục trong giờ vàng.</p>',
    type: 'broadcast',
  },
  {
    title: 'Thể thao: Cần Thơ sẵn sàng cho Đại hội TDTT Đồng bằng',
    outline:
      '<p>Công tác chuẩn bị cơ sở vật chất. Kỳ vọng vào các bộ môn thế mạnh: Vovinam, Bơi lội, Điền kinh.</p>',
    type: 'broadcast',
  },
  {
    title: 'Cuộc sống: Xe buýt đường sông - Trải nghiệm mới cho du khách',
    outline:
      '<p>Trải nghiệm tuyến buýt đường sông Ninh Kiều - Bình Thủy. Đánh giá chất lượng dịch vụ và tiềm năng thu hút khách.</p>',
    type: 'combo',
  },
  {
    title: 'Kinh tế: Xuất khẩu gạo 2025 - Cơ hội từ thị trường EU',
    outline:
      '<p>Phân tích tác động của EVFTA. Các doanh nghiệp gạo Cần Thơ chuẩn bị gì để đáp ứng tiêu chuẩn khắt khe?</p>',
    type: 'print',
  },
]

// Generate mock topics
export const mockTopics: Topic[] = Array.from({ length: 20 }, (_, index) => {
  const createdAt = randomDate(new Date('2024-10-01'), new Date())
  const reporter = MOCK_USERS.find((u) => u.role === 'reporter')!
  const editor = MOCK_USERS.find((u) => u.role === 'editor')!

  const status = statuses[Math.floor(Math.random() * statuses.length)]
  const sample = topicSamples[index % topicSamples.length]

  // Generate approval history based on status
  const approvalHistory = []

  if (status !== 'draft') {
    approvalHistory.push({
      id: `ah-${index}-1`,
      userId: reporter.id,
      userName: reporter.name,
      userRole: reporter.role,
      action: 'submit' as const,
      level: 'B1' as const,
      comment: 'Đề xuất đề tài mới',
      timestamp: createdAt,
    })
  }

  if (['approved', 'rejected'].includes(status)) {
    approvalHistory.push({
      id: `ah-${index}-2`,
      userId: editor.id,
      userName: editor.name,
      userRole: editor.role,
      action: 'approve' as const,
      level: 'B1' as const,
      comment: 'Đề tài phù hợp, chuyển lãnh đạo phòng duyệt',
      timestamp: new Date(createdAt.getTime() + 86400000),
    })
  }

  return {
    id: `topic-${index + 1}`,
    title: sample.title,
    outline: sample.outline,
    contentType: sample.type as ContentType,
    teamMembers: [
      {
        userId: reporter.id,
        userName: reporter.name,
        role: reporter.role,
        position: 'lead',
      },
    ],
    attachments:
      index % 3 === 0
        ? [
            {
              id: `att-${index}-1`,
              fileName: 'de_cuong_chi_tiet.docx',
              fileUrl: '/files/de_cuong.docx',
              fileType: 'application/docx',
              fileSize: 125000,
              uploadedAt: createdAt,
            },
          ]
        : [],
    estimatedDays: Math.floor(Math.random() * 14) + 3,
    deadline: new Date(
      createdAt.getTime() + (Math.random() * 30 + 7) * 86400000
    ),
    createdBy: reporter.id,
    createdByName: reporter.name,
    departmentId: reporter.departmentId!,
    departmentName: reporter.departmentName!,
    status,
    approvalHistory,
    createdAt,
    updatedAt: new Date(createdAt.getTime() + Math.random() * 86400000 * 5),
  }
})

// Get topics by status
export const getTopicsByStatus = (status: TopicStatus | 'all'): Topic[] => {
  if (status === 'all') return mockTopics
  return mockTopics.filter((t) => t.status === status)
}

// Get topics by user
export const getTopicsByUser = (userId: string): Topic[] => {
  return mockTopics.filter(
    (t) =>
      t.createdBy === userId || t.teamMembers.some((m) => m.userId === userId)
  )
}

// Get topics by department
export const getTopicsByDepartment = (departmentId: string): Topic[] => {
  return mockTopics.filter((t) => t.departmentId === departmentId)
}

// Get pending topics for approval
export const getPendingTopicsForApproval = (
  level: 'B1' | 'B2' | 'B3'
): Topic[] => {
  const statusMap = {
    B1: 'pending',
    B2: 'pending',
    B3: 'pending',
  }
  return mockTopics.filter((t) => t.status === statusMap[level])
}

// Statistics
export const getTopicStats = () => {
  return {
    total: mockTopics.length,
    draft: mockTopics.filter((t) => t.status === 'draft').length,
    pending: mockTopics.filter((t) => ['pending'].includes(t.status)).length,
    approved: mockTopics.filter((t) => t.status === 'approved').length,
    rejected: mockTopics.filter((t) => t.status === 'rejected').length,
  }
}
