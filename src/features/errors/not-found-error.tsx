import { useNavigate, useRouter } from '@tanstack/react-router'
import { SearchIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NotFoundError() {
  const navigate = useNavigate()
  const { history } = useRouter()

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background'>
      <div className='relative w-full max-w-[400px] px-4'>
        <div className='flex min-h-[400px] flex-col items-center justify-center p-8 text-center'>
          <div className='space-y-4'>
            <div className='mx-auto mb-2 text-base font-medium text-muted-foreground/40'>
              404
            </div>
            <h1 className='mb-1 text-base font-bold tracking-tight'>
              Not Found
            </h1>
            <p className='mx-auto mt-2 max-w-[42rem] text-sm font-normal leading-relaxed text-muted-foreground'>
              The page you're looking for doesn't exist.
            </p>
          </div>

          <div className='mt-8 flex w-full flex-col items-center gap-6'>
            <div className='w-full space-y-4'>
              <div className='relative flex w-full items-center'>
                <SearchIcon className='absolute left-3 h-4 w-4 text-muted-foreground' />
                <input
                  className='flex h-9 w-full rounded-md border border-input bg-background/50 px-10 py-2 text-sm ring-offset-background backdrop-blur-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                  placeholder='Try searching for pages...'
                />
                <div className='absolute right-3 flex h-full items-center justify-center pr-1 text-muted-foreground'>
                  <kbd className='pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100'>
                    /
                  </kbd>
                </div>
              </div>

              <div className='flex flex-col items-center justify-center gap-2 sm:flex-row'>
                <Button
                  size='sm'
                  className='h-8 w-full px-4 sm:w-auto'
                  onClick={() => navigate({ to: '/' })}
                >
                  Return Home
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='h-8 w-full border-input px-4 hover:bg-muted/30 sm:w-auto'
                  onClick={() => history.go(-1)}
                >
                  Go Back
                </Button>
              </div>
            </div>

            <p className='mx-auto mt-6 max-w-[42rem] text-sm font-normal text-muted-foreground opacity-80'>
              Need help?{' '}
              <a
                href='/contact'
                className='font-medium text-primary underline-offset-4 hover:underline'
              >
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

