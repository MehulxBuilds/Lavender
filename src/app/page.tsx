import LogoutButton from '@/components/layout/logout-button';
import { Button } from '@/components/ui/button'

const page = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <LogoutButton>
        <Button>Logout</Button>
      </LogoutButton>
    </div>
  )
}

export default page;