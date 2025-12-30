import { FileText, Users, TrendingUp, TrendingDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Mock data cho đề tài
const topicsData = [
  {
    id: 'DT-001',
    title: 'Phóng sự: Chợ nổi Cái Răng',
    type: 'Phóng sự',
    approved: 12,
    pending: 3,
    needFix: 1,
    status: 'approved',
  },
  {
    id: 'DT-002',
    title: 'Tin tức 18h - Tháng 12',
    type: 'Chương trình',
    approved: 28,
    pending: 5,
    needFix: 2,
    status: 'in_progress',
  },
  {
    id: 'DT-003',
    title: 'Chương trình Xuân 2025',
    type: 'Sự kiện',
    approved: 8,
    pending: 10,
    needFix: 4,
    status: 'pending',
  },
  {
    id: 'DT-004',
    title: 'Phim tài liệu: Đồng bằng sông Cửu Long',
    type: 'Phim',
    approved: 5,
    pending: 2,
    needFix: 0,
    status: 'approved',
  },
  {
    id: 'DT-005',
    title: 'Gameshow: Ai là triệu phú',
    type: 'Gameshow',
    approved: 15,
    pending: 3,
    needFix: 1,
    status: 'in_progress',
  },
]

// Mock data cho nhuận bút
const royaltyData = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    role: 'Phóng viên',
    department: 'Ban Thời sự',
    articles: 17,
    amount: 8500000,
    trend: 'up',
  },
  {
    id: 2,
    name: 'Trần Thị B',
    role: 'Biên tập viên',
    department: 'Ban Văn nghệ',
    articles: 27,
    amount: 12300000,
    trend: 'up',
  },
  {
    id: 3,
    name: 'Lê Văn C',
    role: 'Phóng viên',
    department: 'Ban Kinh tế',
    articles: 19,
    amount: 6200000,
    trend: 'down',
  },
  {
    id: 4,
    name: 'Phạm Thị D',
    role: 'Quay phim',
    department: 'Kỹ thuật',
    articles: 22,
    amount: 9800000,
    trend: 'up',
  },
  {
    id: 5,
    name: 'Hoàng Văn E',
    role: 'Đạo diễn',
    department: 'Ban Thời sự',
    articles: 8,
    amount: 15000000,
    trend: 'up',
  },
]

// Mock data cho chi phí
const costsData = [
  {
    id: 'CP-001',
    topic: 'Phóng sự: Chợ nổi Cái Răng',
    category: 'Công tác phí',
    amount: 8500000,
    date: '15/12/2024',
  },
  {
    id: 'CP-002',
    topic: 'Chương trình Xuân 2025',
    category: 'Thuê thiết bị',
    amount: 25000000,
    date: '18/12/2024',
  },
  {
    id: 'CP-003',
    topic: 'Tin tức 18h - Tháng 12',
    category: 'Vật tư',
    amount: 3200000,
    date: '20/12/2024',
  },
  {
    id: 'CP-004',
    topic: 'Phim tài liệu: ĐBSCL',
    category: 'Công tác phí',
    amount: 12000000,
    date: '22/12/2024',
  },
  {
    id: 'CP-005',
    topic: 'Chương trình Xuân 2025',
    category: 'Thuê diễn viên',
    amount: 35000000,
    date: '25/12/2024',
  },
]

// Mock data cho hợp đồng
const contractsData = [
  {
    id: 'HĐ-QC-2024-001',
    type: 'Quảng cáo',
    customer: 'Công ty ABC',
    value: 250000000,
    status: 'completed',
    date: '01/12/2024',
  },
  {
    id: 'HĐ-ĐH-2024-015',
    type: 'Đặt hàng',
    customer: 'Sở VHTT',
    value: 180000000,
    status: 'in_progress',
    date: '10/12/2024',
  },
  {
    id: 'HĐ-QC-2024-022',
    type: 'Quảng cáo',
    customer: 'Ngân hàng XYZ',
    value: 460000000,
    status: 'completed',
    date: '15/12/2024',
  },
  {
    id: 'HĐ-ĐH-2024-018',
    type: 'Đặt hàng',
    customer: 'UBND TP',
    value: 320000000,
    status: 'pending',
    date: '20/12/2024',
  },
  {
    id: 'HĐ-QC-2024-025',
    type: 'Quảng cáo',
    customer: 'Công ty XYZ',
    value: 150000000,
    status: 'in_progress',
    date: '22/12/2024',
  },
]

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(value) + 'đ'
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'approved':
    case 'completed':
      return (
        <Badge className='bg-green-100 text-green-700 hover:bg-green-100'>
          Hoàn thành
        </Badge>
      )
    case 'in_progress':
      return (
        <Badge className='bg-blue-100 text-blue-700 hover:bg-blue-100'>
          Đang thực hiện
        </Badge>
      )
    case 'pending':
      return (
        <Badge className='bg-yellow-100 text-yellow-700 hover:bg-yellow-100'>
          Chờ duyệt
        </Badge>
      )
    default:
      return <Badge variant='secondary'>{status}</Badge>
  }
}

export function TopicsTable() {
  const totalApproved = topicsData.reduce((sum, t) => sum + t.approved, 0)
  const totalPending = topicsData.reduce((sum, t) => sum + t.pending, 0)
  const totalNeedFix = topicsData.reduce((sum, t) => sum + t.needFix, 0)

  return (
    <div className='space-y-4'>
      {/* Summary Cards */}
      <div className='grid grid-cols-3 gap-3'>
        <Card className='border-green-200 bg-green-50/50'>
          <CardContent className='p-3'>
            <div className='flex items-center gap-2'>
              <FileText className='h-4 w-4 text-green-600' />
              <span className='text-xs text-muted-foreground'>Đã duyệt</span>
            </div>
            <div className='mt-1 text-2xl font-bold text-green-700'>
              {totalApproved}
            </div>
          </CardContent>
        </Card>
        <Card className='border-yellow-200 bg-yellow-50/50'>
          <CardContent className='p-3'>
            <div className='flex items-center gap-2'>
              <FileText className='h-4 w-4 text-yellow-600' />
              <span className='text-xs text-muted-foreground'>Chờ duyệt</span>
            </div>
            <div className='mt-1 text-2xl font-bold text-yellow-700'>
              {totalPending}
            </div>
          </CardContent>
        </Card>
        <Card className='border-red-200 bg-red-50/50'>
          <CardContent className='p-3'>
            <div className='flex items-center gap-2'>
              <FileText className='h-4 w-4 text-red-600' />
              <span className='text-xs text-muted-foreground'>Cần bổ sung</span>
            </div>
            <div className='mt-1 text-2xl font-bold text-red-700'>
              {totalNeedFix}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-base'>Danh sách Đề tài</CardTitle>
        </CardHeader>
        <CardContent className='pt-0'>
          <Table>
            <TableHeader>
              <TableRow className='bg-muted/50'>
                <TableHead>Mã</TableHead>
                <TableHead>Tên đề tài</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead className='text-center'>Đã duyệt</TableHead>
                <TableHead className='text-center'>Chờ duyệt</TableHead>
                <TableHead className='text-center'>Cần bổ sung</TableHead>
                <TableHead className='text-center'>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topicsData.map((topic) => (
                <TableRow key={topic.id}>
                  <TableCell className='font-medium text-primary'>
                    {topic.id}
                  </TableCell>
                  <TableCell className='max-w-[200px] truncate'>
                    {topic.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant='outline'>{topic.type}</Badge>
                  </TableCell>
                  <TableCell className='text-center font-medium text-green-600'>
                    {topic.approved}
                  </TableCell>
                  <TableCell className='text-center font-medium text-yellow-600'>
                    {topic.pending}
                  </TableCell>
                  <TableCell className='text-center font-medium text-red-600'>
                    {topic.needFix}
                  </TableCell>
                  <TableCell className='text-center'>
                    {getStatusBadge(topic.status)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export function RoyaltyTable() {
  const totalAmount = royaltyData.reduce((sum, r) => sum + r.amount, 0)
  return (
    <div className='space-y-4'>
      {/* Summary Cards */}
      <div className='grid grid-cols-2 gap-3'>
        <Card className='border-primary/20 bg-primary/5'>
          <CardContent className='p-3'>
            <div className='flex items-center gap-2'>
              <Users className='h-4 w-4 text-primary' />
              <span className='text-xs text-muted-foreground'>
                Tổng nhân sự
              </span>
            </div>
            <div className='mt-1 text-2xl font-bold'>
              {royaltyData.length} người
            </div>
          </CardContent>
        </Card>
        <Card className='border-green-200 bg-green-50/50'>
          <CardContent className='p-3'>
            <div className='flex items-center gap-2'>
              <TrendingUp className='h-4 w-4 text-green-600' />
              <span className='text-xs text-muted-foreground'>
                Tổng nhuận bút
              </span>
            </div>
            <div className='mt-1 text-2xl font-bold text-green-700'>
              {formatCurrency(totalAmount)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-base'>
            Chi tiết Nhuận bút/Thù lao
          </CardTitle>
        </CardHeader>
        <CardContent className='pt-0'>
          <Table>
            <TableHeader>
              <TableRow className='bg-muted/50'>
                <TableHead>Nhân sự</TableHead>
                <TableHead>Phòng ban</TableHead>
                <TableHead className='text-center'>Số bài</TableHead>
                <TableHead className='text-right'>Nhuận bút</TableHead>
                <TableHead className='text-center'>Xu hướng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {royaltyData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className='font-medium'>{item.name}</TableCell>
                  <TableCell>
                    <Badge variant='outline'>{item.department}</Badge>
                  </TableCell>
                  <TableCell className='text-center'>{item.articles}</TableCell>
                  <TableCell className='text-right font-semibold'>
                    {formatCurrency(item.amount)}
                  </TableCell>
                  <TableCell className='text-center'>
                    {item.trend === 'up' ? (
                      <TrendingUp className='mx-auto h-4 w-4 text-green-600' />
                    ) : (
                      <TrendingDown className='mx-auto h-4 w-4 text-red-600' />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export function CostsTable() {
  const totalCosts = costsData.reduce((sum, c) => sum + c.amount, 0)

  return (
    <div className='space-y-4'>
      {/* Summary */}
      <Card className='border-orange-200 bg-orange-50/50'>
        <CardContent className='flex items-center justify-between p-4'>
          <div>
            <div className='text-sm text-muted-foreground'>
              Tổng chi phí tháng 12/2024
            </div>
            <div className='text-3xl font-bold text-orange-700'>
              {formatCurrency(totalCosts)}
            </div>
          </div>
          <div className='text-right'>
            <div className='text-sm text-muted-foreground'>Số khoản chi</div>
            <div className='text-2xl font-bold'>{costsData.length}</div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-base'>Chi tiết Chi phí Sản xuất</CardTitle>
        </CardHeader>
        <CardContent className='pt-0'>
          <Table>
            <TableHeader>
              <TableRow className='bg-muted/50'>
                <TableHead>Mã</TableHead>
                <TableHead>Đề tài</TableHead>
                <TableHead>Loại chi phí</TableHead>
                <TableHead className='text-right'>Số tiền</TableHead>
                <TableHead className='text-center'>Ngày</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {costsData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className='font-medium text-primary'>
                    {item.id}
                  </TableCell>
                  <TableCell className='max-w-[200px] truncate'>
                    {item.topic}
                  </TableCell>
                  <TableCell>
                    <Badge variant='outline'>{item.category}</Badge>
                  </TableCell>
                  <TableCell className='text-right font-semibold'>
                    {formatCurrency(item.amount)}
                  </TableCell>
                  <TableCell className='text-center text-muted-foreground'>
                    {item.date}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export function ContractsTable() {
  const totalValue = contractsData.reduce((sum, c) => sum + c.value, 0)
  const completedValue = contractsData
    .filter((c) => c.status === 'completed')
    .reduce((sum, c) => sum + c.value, 0)

  return (
    <div className='space-y-4'>
      {/* Summary Cards */}
      <div className='grid grid-cols-2 gap-3'>
        <Card className='border-blue-200 bg-blue-50/50'>
          <CardContent className='p-4'>
            <div className='text-sm text-muted-foreground'>Tổng giá trị</div>
            <div className='text-2xl font-bold text-blue-700'>
              {formatCurrency(totalValue)}
            </div>
            <div className='text-xs text-muted-foreground'>
              {contractsData.length} hợp đồng
            </div>
          </CardContent>
        </Card>
        <Card className='border-green-200 bg-green-50/50'>
          <CardContent className='p-4'>
            <div className='text-sm text-muted-foreground'>Đã hoàn thành</div>
            <div className='text-2xl font-bold text-green-700'>
              {formatCurrency(completedValue)}
            </div>
            <div className='text-xs text-muted-foreground'>
              {contractsData.filter((c) => c.status === 'completed').length} hợp
              đồng
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-base'>Danh sách Hợp đồng</CardTitle>
        </CardHeader>
        <CardContent className='pt-0'>
          <Table>
            <TableHeader>
              <TableRow className='bg-muted/50'>
                <TableHead>Mã HĐ</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead className='text-right'>Giá trị</TableHead>
                <TableHead className='text-center'>Ngày ký</TableHead>
                <TableHead className='text-center'>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contractsData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className='font-medium text-primary'>
                    {item.id}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.type === 'Quảng cáo' ? 'default' : 'secondary'
                      }
                    >
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.customer}</TableCell>
                  <TableCell className='text-right font-semibold'>
                    {formatCurrency(item.value)}
                  </TableCell>
                  <TableCell className='text-center text-muted-foreground'>
                    {item.date}
                  </TableCell>
                  <TableCell className='text-center'>
                    {getStatusBadge(item.status)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
