import { useState } from 'react'
import { format } from 'date-fns'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { vi } from 'date-fns/locale'
import {
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
  UserPlus,
  FileText,
  Download,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { type Assignment, SERVICE_TYPE_CONFIG } from '../types'
import { AssignmentStatusBadge, ServiceTypeBadge } from './status-badge'

interface AssignmentTableProps {
  data: Assignment[]
  onView?: (assignment: Assignment) => void
  onEdit?: (assignment: Assignment) => void
  onDelete?: (assignment: Assignment) => void
  onAssign?: (assignment: Assignment) => void
}

export function AssignmentTable({
  data,
  onView,
  onEdit,
  onDelete,
  onAssign,
}: AssignmentTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const columns: ColumnDef<Assignment>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Chọn tất cả'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Chọn hàng'
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'code',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className='px-0 hover:bg-transparent'
          >
            Mã đơn hàng
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className='flex flex-col'>
          <span className='font-medium text-primary'>
            {row.getValue('code')}
          </span>
          <span className='text-xs text-muted-foreground'>
            {format(row.original.createdAt, 'dd/MM/yyyy', { locale: vi })}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'clientName',
      header: 'Khách hàng',
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src='' />
            <AvatarFallback className='bg-primary/10 text-xs'>
              {row.original.clientAvatar ||
                row.original.clientName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className='text-sm font-medium'>
            {row.getValue('clientName')}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'serviceType',
      header: 'Dịch vụ & Nội dung',
      cell: ({ row }) => {
        return (
          <div className='flex max-w-64 flex-col gap-1'>
            <ServiceTypeBadge serviceType={row.getValue('serviceType')} />
            <span className='truncate text-sm'>{row.original.topicTitle}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'deadline',
      header: 'Thời gian',
      cell: ({ row }) => {
        const startDate = row.original.startDate
        const deadline = row.original.deadline
        return (
          <div className='flex flex-col text-sm'>
            <div className='flex items-center gap-1'>
              <span className='text-muted-foreground'>🕐</span>
              <span>{format(startDate, 'dd/MM/yyyy', { locale: vi })}</span>
            </div>
            <div className='flex items-center gap-1'>
              <span className='text-muted-foreground'>🏁</span>
              <span>{format(deadline, 'dd/MM/yyyy', { locale: vi })}</span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'deliverables',
      header: 'SL/TL',
      cell: ({ row }) => {
        const deliverables = row.original.deliverables
        return (
          <div className='flex flex-col text-sm'>
            {deliverables.map((item, index) => (
              <span
                key={index}
                className={
                  index === 0 ? 'font-medium' : 'text-muted-foreground'
                }
              >
                {item}
              </span>
            ))}
          </div>
        )
      },
    },
    {
      accessorKey: 'estimatedValue',
      header: 'Giá trị HĐ',
      cell: ({ row }) => {
        const value = row.getValue('estimatedValue') as number
        const progress = row.original.progress
        return (
          <div className='flex flex-col gap-1'>
            <span className='font-bold'>
              {new Intl.NumberFormat('vi-VN').format(value)}
              <span className='ml-0.5 text-xs text-muted-foreground'>đ</span>
            </span>
            <div className='flex items-center gap-2'>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className='flex items-center gap-1'>
                      <div
                        className={`h-2 w-2 rounded-full ${progress === 100 ? 'bg-green-500' : progress > 0 ? 'bg-cyan-500' : 'bg-muted-foreground'}`}
                      />
                      <span className='text-xs text-muted-foreground'>
                        {progress === 100
                          ? 'Đã TT 100%'
                          : progress > 0
                            ? `Chờ TT ${100 - progress}%`
                            : 'Chưa TT'}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Tiến độ thanh toán: {progress}%</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => (
        <AssignmentStatusBadge status={row.getValue('status')} />
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const assignment = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Mở menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onView?.(assignment)}>
                <Eye className='mr-2 h-4 w-4' />
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAssign?.(assignment)}>
                <UserPlus className='mr-2 h-4 w-4' />
                Phân công nhân viên
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(assignment)}>
                <Pencil className='mr-2 h-4 w-4' />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <FileText className='mr-2 h-4 w-4' />
                Xem hợp đồng
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className='mr-2 h-4 w-4' />
                Xuất báo cáo
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete?.(assignment)}
                className='text-destructive'
              >
                <Trash2 className='mr-2 h-4 w-4' />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className='space-y-4'>
      {/* Filters */}
      <div className='flex flex-wrap items-center gap-4'>
        <Input
          placeholder='Mã đơn, Tên khách hàng...'
          value={(table.getColumn('code')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('code')?.setFilterValue(event.target.value)
          }
          className='max-w-xs'
        />
        <Select
          value={
            (table.getColumn('serviceType')?.getFilterValue() as string) ?? ''
          }
          onValueChange={(value) =>
            table
              .getColumn('serviceType')
              ?.setFilterValue(value === 'all' ? '' : value)
          }
        >
          <SelectTrigger className='w-45'>
            <SelectValue placeholder='Tất cả dịch vụ' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tất cả dịch vụ</SelectItem>
            {Object.entries(SERVICE_TYPE_CONFIG).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={(table.getColumn('status')?.getFilterValue() as string) ?? ''}
          onValueChange={(value) =>
            table
              .getColumn('status')
              ?.setFilterValue(value === 'all' ? '' : value)
          }
        >
          <SelectTrigger className='w-40'>
            <SelectValue placeholder='Tất cả trạng thái' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tất cả trạng thái</SelectItem>
            <SelectItem value='pending'>Chờ phân công</SelectItem>
            <SelectItem value='assigned'>Đã phân công</SelectItem>
            <SelectItem value='in_progress'>Đang thực hiện</SelectItem>
            <SelectItem value='completed'>Hoàn thành</SelectItem>
            <SelectItem value='overdue'>Quá hạn</SelectItem>
          </SelectContent>
        </Select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              Cột hiển thị <ChevronDown className='ml-2 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='cursor-pointer hover:bg-muted/50'
                  onClick={() => onView?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className='flex items-center justify-between px-2'>
        <div className='text-sm text-muted-foreground'>
          {table.getFilteredSelectedRowModel().rows.length} /{' '}
          {table.getFilteredRowModel().rows.length} hàng được chọn
        </div>
        <div className='flex items-center space-x-6 lg:space-x-8'>
          <div className='flex items-center space-x-2'>
            <p className='text-sm font-medium'>Số hàng/trang</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className='h-8 w-18'>
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side='top'>
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='flex w-25 items-center justify-center text-sm font-medium'>
            Trang {table.getState().pagination.pageIndex + 1} /{' '}
            {table.getPageCount()}
          </div>
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              className='hidden h-8 w-8 p-0 lg:flex'
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className='sr-only'>Trang đầu</span>
              <ChevronsLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              className='h-8 w-8 p-0'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className='sr-only'>Trang trước</span>
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              className='h-8 w-8 p-0'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className='sr-only'>Trang sau</span>
              <ChevronRight className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              className='hidden h-8 w-8 p-0 lg:flex'
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className='sr-only'>Trang cuối</span>
              <ChevronsRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
