import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  CheckIcon,
  XCircle,
  ChevronDown,
  XIcon,
  WandSparkles,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'

/**
 * Variants for the multi-select component to handle different styles.
 * Uses class-variance-authority (cva) to define different styles based on "variant" prop.
 */
const multiSelectVariants = cva('m-1 transition-all duration-300 ease-in-out', {
  variants: {
    variant: {
      default: 'border-foreground/10 text-foreground bg-card hover:bg-card/80',
      secondary:
        'border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80',
      destructive:
        'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
      inverted: 'inverted',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

/**
 * Option interface for MultiSelect component
 */
export interface MultiSelectOption {
  /** The text to display for the option. */
  label: string
  /** The unique value associated with the option. */
  value: string
  /** Optional icon component to display alongside the option. */
  icon?: React.ComponentType<{ className?: string }>
  /** Whether this option is disabled */
  disabled?: boolean
}

/**
 * Props for MultiSelect component
 */
interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  /**
   * An array of option objects to be displayed in the multi-select component.
   */
  options: MultiSelectOption[]
  /**
   * Callback function triggered when the selected values change.
   * Receives an array of the new selected values.
   */
  onValueChange: (value: string[]) => void

  /** The default selected values when the component mounts. */
  defaultValue?: string[]

  /**
   * Placeholder text to be displayed when no values are selected.
   * Optional, defaults to "Select options".
   */
  placeholder?: string

  /**
   * Animation duration in seconds for the visual effects (e.g., bouncing badges).
   * Optional, defaults to 0 (no animation).
   */
  animation?: number

  /**
   * Maximum number of items to display. Extra selected items will be summarized.
   * Optional, defaults to 3.
   */
  maxCount?: number

  /**
   * The modality of the popover. When set to true, interaction with outside elements
   * will be disabled and only popover content will be visible to screen readers.
   * Optional, defaults to false.
   */
  modalPopover?: boolean

  /**
   * If true, renders the multi-select component as a child of another component.
   * Optional, defaults to false.
   */
  asChild?: boolean

  /**
   * Additional class names to apply custom styles to the multi-select component.
   * Optional, can be used to add custom styles.
   */
  className?: string

  /**
   * If true, disables the select all functionality.
   * Optional, defaults to false.
   */
  hideSelectAll?: boolean

  /**
   * If true, shows search functionality in the popover.
   * If false, hides the search input completely.
   * Optional, defaults to true.
   */
  searchable?: boolean

  /**
   * Custom empty state message when no options match search.
   * Optional, defaults to "No results found."
   */
  emptyIndicator?: React.ReactNode

  /**
   * If true, disables the component completely.
   * Optional, defaults to false.
   */
  disabled?: boolean
}

export const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    {
      options,
      onValueChange,
      variant,
      defaultValue = [],
      placeholder = 'Select options',
      animation = 0,
      maxCount = 3,
      modalPopover = false,
      className,
      hideSelectAll = false,
      searchable = true,
      emptyIndicator,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] =
      React.useState<string[]>(defaultValue)
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
    const [isAnimating, setIsAnimating] = React.useState(false)
    const [searchValue, setSearchValue] = React.useState('')

    React.useEffect(() => {
      setSelectedValues(defaultValue)
    }, [defaultValue])

    const handleInputKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key === 'Enter') {
        setIsPopoverOpen(true)
      } else if (event.key === 'Backspace' && !event.currentTarget.value) {
        const newSelectedValues = [...selectedValues]
        newSelectedValues.pop()
        setSelectedValues(newSelectedValues)
        onValueChange(newSelectedValues)
      }
    }

    const toggleOption = (optionValue: string) => {
      if (disabled) return
      const option = options.find((o) => o.value === optionValue)
      if (option?.disabled) return
      const newSelectedValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((value) => value !== optionValue)
        : [...selectedValues, optionValue]
      setSelectedValues(newSelectedValues)
      onValueChange(newSelectedValues)
    }

    const handleClear = () => {
      if (disabled) return
      setSelectedValues([])
      onValueChange([])
    }

    const handleTogglePopover = () => {
      if (disabled) return
      setIsPopoverOpen((prev) => !prev)
    }

    const clearExtraOptions = () => {
      if (disabled) return
      const newSelectedValues = selectedValues.slice(0, maxCount)
      setSelectedValues(newSelectedValues)
      onValueChange(newSelectedValues)
    }

    const toggleAll = () => {
      if (disabled) return
      const allOptions = options.filter((option) => !option.disabled)
      if (selectedValues.length === allOptions.length) {
        handleClear()
      } else {
        const allValues = allOptions.map((option) => option.value)
        setSelectedValues(allValues)
        onValueChange(allValues)
      }
    }

    const filteredOptions = React.useMemo(() => {
      if (!searchable || !searchValue) return options
      return options.filter(
        (option) =>
          option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
          option.value.toLowerCase().includes(searchValue.toLowerCase())
      )
    }, [options, searchValue, searchable])

    React.useEffect(() => {
      if (!isPopoverOpen) {
        setSearchValue('')
      }
    }, [isPopoverOpen])

    return (
      <Popover
        open={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
        modal={modalPopover}
      >
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            {...props}
            onClick={handleTogglePopover}
            disabled={disabled}
            className={cn(
              'flex p-1 rounded-md border min-h-10 h-auto items-center justify-between bg-inherit hover:bg-inherit [&_svg]:pointer-events-auto w-full',
              disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
          >
            {selectedValues.length > 0 ? (
              <div className='flex justify-between items-center w-full'>
                <div className='flex flex-wrap items-center gap-1'>
                  {selectedValues.slice(0, maxCount).map((value) => {
                    const option = options.find((o) => o.value === value)
                    const IconComponent = option?.icon
                    if (!option) {
                      return null
                    }
                    return (
                      <Badge
                        key={value}
                        className={cn(
                          multiSelectVariants({ variant }),
                          'hover:-translate-y-1 hover:scale-105 pr-1.5 gap-1'
                        )}
                        style={{ animationDuration: `${animation}s` }}
                      >
                        {IconComponent && (
                          <IconComponent className='h-4 w-4 mr-1' />
                        )}
                        <span className='truncate max-w-[150px]'>{option.label}</span>
                        <button
                          type='button'
                          onClick={(event) => {
                            event.stopPropagation()
                            toggleOption(value)
                          }}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault()
                              event.stopPropagation()
                              toggleOption(value)
                            }
                          }}
                          aria-label={`Remove ${option.label} from selection`}
                          className='ml-1 rounded-full p-0.5 hover:bg-foreground/20 focus:outline-none focus:ring-1 focus:ring-ring transition-colors'
                        >
                          <XCircle className='h-3.5 w-3.5' />
                        </button>
                      </Badge>
                    )
                  })}
                  {selectedValues.length > maxCount && (
                    <Badge
                      className={cn(
                        'bg-transparent text-foreground border-foreground/1 hover:bg-transparent',
                        multiSelectVariants({ variant })
                      )}
                      style={{ animationDuration: `${animation}s` }}
                    >
                      {`+ ${selectedValues.length - maxCount} more`}
                      <XCircle
                        className='ml-2 h-4 w-4 cursor-pointer'
                        onClick={(event) => {
                          event.stopPropagation()
                          clearExtraOptions()
                        }}
                      />
                    </Badge>
                  )}
                </div>
                <div className='flex items-center justify-between'>
                  <div
                    role='button'
                    tabIndex={0}
                    onClick={(event) => {
                      event.stopPropagation()
                      handleClear()
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        event.stopPropagation()
                        handleClear()
                      }
                    }}
                    aria-label={`Clear all ${selectedValues.length} selected options`}
                    className='flex items-center justify-center h-4 w-4 mx-2 cursor-pointer text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 rounded-sm'
                  >
                    <XIcon className='h-4 w-4' />
                  </div>
                  <Separator orientation='vertical' className='flex min-h-6 h-full' />
                  <ChevronDown
                    className='h-4 mx-2 cursor-pointer text-muted-foreground'
                    aria-hidden='true'
                  />
                </div>
              </div>
            ) : (
              <div className='flex items-center justify-between w-full mx-auto'>
                <span className='text-sm text-muted-foreground mx-3'>
                  {placeholder}
                </span>
                <ChevronDown className='h-4 cursor-pointer text-muted-foreground mx-2' />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='w-auto p-0 min-w-[300px]'
          align='start'
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
        >
          <Command>
            {searchable && (
              <CommandInput
                placeholder='Tìm kiếm...'
                onKeyDown={handleInputKeyDown}
                value={searchValue}
                onValueChange={setSearchValue}
                aria-label='Search through available options'
              />
            )}
            <CommandList className='max-h-[40vh] overflow-y-auto'>
              <CommandEmpty>
                {emptyIndicator || 'Không tìm thấy kết quả.'}
              </CommandEmpty>
              {!hideSelectAll && !searchValue && (
                <CommandGroup>
                  <CommandItem
                    key='all'
                    onSelect={toggleAll}
                    className='cursor-pointer'
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        selectedValues.length ===
                          options.filter((opt) => !opt.disabled).length
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                      aria-hidden='true'
                    >
                      <CheckIcon className='h-4 w-4' />
                    </div>
                    <span>Chọn tất cả</span>
                  </CommandItem>
                </CommandGroup>
              )}
              <CommandGroup>
                {filteredOptions.map((option) => {
                  const isSelected = selectedValues.includes(option.value)
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => toggleOption(option.value)}
                      className={cn(
                        'cursor-pointer',
                        option.disabled && 'opacity-50 cursor-not-allowed'
                      )}
                      disabled={option.disabled}
                    >
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible'
                        )}
                        aria-hidden='true'
                      >
                        <CheckIcon className='h-4 w-4' />
                      </div>
                      {option.icon && (
                        <option.icon
                          className='mr-2 h-4 w-4 text-muted-foreground'
                          aria-hidden='true'
                        />
                      )}
                      <span>{option.label}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <div className='flex items-center justify-between'>
                  {selectedValues.length > 0 && (
                    <>
                      <CommandItem
                        onSelect={handleClear}
                        className='flex-1 justify-center cursor-pointer'
                      >
                        Xóa tất cả
                      </CommandItem>
                      <Separator
                        orientation='vertical'
                        className='flex min-h-6 h-full'
                      />
                    </>
                  )}
                  <CommandItem
                    onSelect={() => setIsPopoverOpen(false)}
                    className='flex-1 justify-center cursor-pointer max-w-full'
                  >
                    Đóng
                  </CommandItem>
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
        {animation > 0 && selectedValues.length > 0 && (
          <WandSparkles
            className={cn(
              'cursor-pointer my-2 text-foreground bg-background w-3 h-3',
              isAnimating ? '' : 'text-muted-foreground'
            )}
            onClick={() => setIsAnimating(!isAnimating)}
          />
        )}
      </Popover>
    )
  }
)

MultiSelect.displayName = 'MultiSelect'
