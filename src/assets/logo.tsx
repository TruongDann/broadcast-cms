import { cn } from '@/lib/utils'

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string
}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <img
      src='/images/logo-goldenbee.png'
      alt='GoldenBee Logo'
      className={cn('h-15', className)}
      {...props}
    />
  )
}
