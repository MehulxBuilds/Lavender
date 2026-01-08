import LogoutButton from '@/components/layout/logout-button';
import UserButton from '@/components/layout/user-button';
import { Button } from '@/components/ui/button'
import { requireAuth } from '@/utils/auth-utils';

const page = async () => {
  const { user } = await requireAuth();
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <UserButton user={user} />
      <LogoutButton>
        <Button>Logout</Button>
      </LogoutButton>
    </div>
  )
}

export default page;