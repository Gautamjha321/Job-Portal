import React, { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Button } from './ui/button'
import { SignedIn, SignedOut, SignIn, SignInButton, UserButton, useUser } from '@clerk/clerk-react'
import { BriefcaseBusiness, BriefcaseBusinessIcon, Heart, PenBox } from 'lucide-react'

function Header() {

  const [search , setSearch]= useSearchParams();
 const [showSignIn , setShowSignIn] = useState(false)
const {user} = useUser();

  useEffect(()=>{
    if(search.get('sign-in')){
      setShowSignIn(true);
    }
  },[search]);


const handleOverlayClick=(e)=>{
if(e.target === e.currentTarget){
  setShowSignIn(false);
  setSearch({})
}
}

  return (
    <>
    
    <nav className='py-4 flex  justify-around items-center'>
      
      <Link>
      <img src="/logo.png" alt="" className='h-20' />
      </Link>
     
<div className='flex gap-8'>
        <SignedOut>
         <Button variant="outline" onClick={()=>setShowSignIn(true)} >Login </Button>
      </SignedOut>
     
      <SignedIn>
        { user?.unsafeMetadata?.role ==='recruiter' && (
        <Link to='/post-job'>
            <Button variant='destructive' className='rounded-full' >
        <PenBox size={20} className='mr-2' />
        Post a Job
      </Button>
      </Link>
)}
        
        
        <UserButton appearance={{
          elements:{
            avatarBox:'w-10 h-10',
          }
        }} > 
        <UserButton.MenuItems>
          <UserButton.Link label='My-jobs' labelIcon={<BriefcaseBusiness size={15}/>}  
          href='/my-jobs'
          />
          <UserButton.Link label='Save-Job' labelIcon={<Heart size={15}/>}  
          href='/Save-job'
          />
        
        </UserButton.MenuItems>
        </UserButton>
      </SignedIn> 
      </div>

    </nav>
    {showSignIn && <div className='fixed inset-0 flex items-center justify-center gradient bg-opacity-0.5' onClick={handleOverlayClick} >
      <SignIn signUpForceRedirectUrl='/onboarding' 
      fallbackRedirectUrl='/onboarding'
      />
    </div> }
    </>
  )
}

export default Header