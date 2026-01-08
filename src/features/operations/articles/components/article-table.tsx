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
  Send,
  CheckCircle,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
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
  type Article,
  ARTICLE_STATUS_CONFIG,
  ARTICLE_TYPE_CONFIG,
} from '../types'

interface ArticleTableProps {
  data: Article[]
  onView?: (article: Article) => void
  onEdit?: (article: Article) => void
  onDelete?: (article: Article) => void
}

// Status Badge component
function ArticleStatusBadge({ status }: { status: Article['status'] }) {
  const config = ARTICLE_STATUS_CONFIG[status]
  return (
    <Badge
      variant='outline'
      className={`${config.color} ${config.bgColor} border-0`}
    >
      {config.label}
    </Badge>
  )
}

// Article Type Badge component
function ArticleTypeBadge({
  articleType,
}: {
  articleType: Article['articleType']
}) {
  const config = ARTICLE_TYPE_CONFIG[articleType]
  return (
    <Badge
      variant='outline'
      className={`${config.color} ${config.bgColor} border-0`}
    >
      {config.label}
    </Badge>
  )
}

export function ArticleTable({
  data,
  onView,
  onEdit,
  onDelete,
}: ArticleTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const columns: ColumnDef<Article>[] = [
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
            Mã tin bài
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
      accessorKey: 'title',
      header: 'Tiêu đề',
      cell: ({ row }) => (
        <div className='flex max-w-xs flex-col gap-1'>
          <span className='truncate font-medium'>{row.getValue('title')}</span>
          <span className='truncate text-xs text-muted-foreground'>
            Đề tài: {row.original.topicTitle}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'articleType',
      header: 'Loại',
      cell: ({ row }) => (
        <ArticleTypeBadge articleType={row.getValue('articleType')} />
      ),
    },
    {
      accessorKey: 'assignedMembers',
      header: 'Phụ trách',
      cell: ({ row }) => {
        const members = row.original.assignedMembers
        if (members.length === 0) {
          return (
            <span className='text-sm text-muted-foreground'>
              Chưa phân công
            </span>
          )
        }
        return (
          <div className='flex items-center gap-2'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src='' />
              <AvatarFallback className='bg-primary/10 text-xs'>
                {members[0].userName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className='flex flex-col'>
              <span className='text-sm font-medium'>{members[0].userName}</span>
              {members.length > 1 && (
                <span className='text-xs text-muted-foreground'>
                  +{members.length - 1} người khác
                </span>
              )}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'deadline',
      header: 'Deadline',
      cell: ({ row }) => {
        const deadline = row.original.deadline
        const now = new Date()
        const isOverdue =
          deadline < now && row.original.status !== 'da_xuat_ban'
        const isNearDeadline =
          !isOverdue &&
          deadline.getTime() - now.getTime() < 3 * 24 * 60 * 60 * 1000

        return (
          <div className='flex flex-col text-sm'>
            <span
              className={
                isOverdue
                  ? 'font-medium text-red-500'
                  : isNearDeadline
                    ? 'text-yellow-500'
                    : ''
              }
            >
              {format(deadline, 'dd/MM/yyyy', { locale: vi })}
            </span>
            {isOverdue && <span className='text-xs text-red-500'>Quá hạn</span>}
            {isNearDeadline && (
              <span className='text-xs text-yellow-500'>Sắp đến hạn</span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'departmentName',
      header: 'Phòng ban',
      cell: ({ row }) => (
        <span className='text-sm'>{row.getValue('departmentName')}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => <ArticleStatusBadge status={row.getValue('status')} />,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const article = row.original

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
              <DropdownMenuItem onClick={() => onView?.(article)}>
                <Eye className='mr-2 h-4 w-4' />
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(article)}>
                <Pencil className='mr-2 h-4 w-4' />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Send className='mr-2 h-4 w-4' />
                Gửi duyệt
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CheckCircle className='mr-2 h-4 w-4' />
                Duyệt tin bài
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete?.(article)}
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
          placeholder='Tìm theo mã, tiêu đề...'
          value={(table.getColumn('code')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('code')?.setFilterValue(event.target.value)
          }
          className='max-w-xs'
        />
        <Select
          value={
            (table.getColumn('articleType')?.getFilterValue() as string) ?? ''
          }
          onValueChange={(value) =>
            table
              .getColumn('articleType')
              ?.setFilterValue(value === 'all' ? '' : value)
          }
        >
          <SelectTrigger className='w-40'>
            <SelectValue placeholder='Loại tin bài' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tất cả loại</SelectItem>
            {Object.entries(ARTICLE_TYPE_CONFIG).map(([key, config]) => (
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
          <SelectTrigger className='w-44'>
            <SelectValue placeholder='Trạng thái' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tất cả trạng thái</SelectItem>
            {Object.entries(ARTICLE_STATUS_CONFIG).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                {config.label}
              </SelectItem>
            ))}
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
