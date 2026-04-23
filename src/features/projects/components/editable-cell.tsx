import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface EditableCellProps {
  value: any
  onSave: (value: any) => void
  type?: 'text' | 'number'
  className?: string
}

export function EditableCell({ value: initialValue, onSave, type = 'text', className }: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(initialValue)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
    if (value !== initialValue) {
      onSave(value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false)
      if (value !== initialValue) {
        onSave(value)
      }
    }
    if (e.key === 'Escape') {
      setIsEditing(false)
      setValue(initialValue)
    }
  }

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        type={type}
        value={value}
        onChange={(e) => setValue(type === 'number' ? Number(e.target.value) : e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn('h-8 w-full min-w-[80px] px-2 py-1', className)}
      />
    )
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className={cn('cursor-pointer hover:bg-muted/50 px-1 py-0.5 rounded transition-colors truncate min-h-[1.5rem]', className)}
    >
      {value || <span className='text-muted-foreground italic font-light opacity-50'>Empty</span>}
    </div>
  )
}
