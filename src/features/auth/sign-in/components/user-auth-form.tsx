import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore, MOCK_USERS } from '@/stores/auth-store'
import { sleep, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

const formSchema = z.object({
  username: z.string().min(1, 'Vui lòng nhập tên đăng nhập'),
  password: z
    .string()
    .min(1, 'Vui lòng nhập mật khẩu')
    .min(4, 'Mật khẩu phải có ít nhất 4 ký tự'),
  remember: z.boolean().default(false).optional(),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
      remember: false,
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    toast.promise(sleep(1000), {
      loading: 'Đang đăng nhập...',
      success: () => {
        setIsLoading(false)

        const user = MOCK_USERS.find(
          (u) =>
            u.email === data.username || u.email.split('@')[0] === data.username
        )

        if (user) {
          login(user.id)
          const targetPath = redirectTo || '/'
          navigate({ to: targetPath, replace: true })
          return `Xin chào, ${user.name}!`
        }

        toast.error('Tài khoản không tồn tại')
        return 'Đăng nhập thất bại'
      },
      error: 'Lỗi đăng nhập',
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-4', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder='Nhập email hoặc tên đăng nhập'
                  autoComplete='username'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <div className='flex items-center justify-between'>
                <FormLabel>Mật khẩu</FormLabel>
                <Link
                  to='/forgot-password'
                  className='text-xs font-medium text-muted-foreground hover:text-primary'
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <FormControl>
                <PasswordInput placeholder='Nhập bất kỳ (mock)' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='remember'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-y-0 space-x-3 rounded-md p-0'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel className='cursor-pointer text-sm font-normal'>
                  Ghi nhớ đăng nhập
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        <Button className='mt-2 w-full' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          Đăng Nhập
        </Button>
      </form>
    </Form>
  )
}
