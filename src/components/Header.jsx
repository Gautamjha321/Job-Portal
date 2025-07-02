import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from './ui/button';
import {
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
  useUser
} from '@clerk/clerk-react';
import { PenBox, BriefcaseBusiness, Heart } from 'lucide-react';

function Header() {
  const [search, setSearch] = useSearchParams();
  const [showSignIn, setShowSignIn] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (search.get('sign-in')) {
      setShowSignIn(true);
    }
  }, [search]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({});
    }
  };

  return (
    <>
      <header className='w-full shadow-sm'>
        <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center'>
          <Link to='/' className='flex items-center gap-2'>
            <img src="/logo.png" alt="Logo" className='h-12 sm:h-16 object-contain' />
          </Link>

          <div className='flex items-center gap-4 sm:gap-6'>
            <SignedOut>
              <Button
                variant="outline"
                onClick={() => setShowSignIn(true)}
                className='rounded-full px-4 py-2'
              >
                Login
              </Button>
            </SignedOut>

            <SignedIn>
              {user?.unsafeMetadata?.role === 'recruiter' && (
                <Link to='/post-job'>
                  <Button variant='destructive' className='rounded-full flex items-center gap-2 px-4 py-2'>
                    <PenBox size={18} /> Post a Job
                  </Button>
                </Link>
              )}

              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-10 h-10',
                  }
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Link
                    label='My Jobs'
                    labelIcon={<BriefcaseBusiness size={16} />}
                    href='/my-jobs'
                  />
                  <UserButton.Link
                    label='Saved Jobs'
                    labelIcon={<Heart size={16} />}
                    href='/save-job'
                  />
                </UserButton.MenuItems>
              </UserButton>
            </SignedIn>
          </div>
        </nav>
      </header>

      {showSignIn && (
        <div
          className='fixed inset-0   backdrop-blur-sm flex items-center justify-center z-50'
          onClick={handleOverlayClick}
        >
          <div className='max-w-md w-full p-4 rounded-lg shadow-lg'>
            <SignIn
              signUpForceRedirectUrl='/onboarding'
              fallbackRedirectUrl='/onboarding'
              routing='virtual'
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
