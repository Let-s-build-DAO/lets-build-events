import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <footer className='m-10'>
      <div className='text-center'>
        <p className='text-[#C4C4C4] mb-6'>Quick Links</p>
        <div className='flex lg:w-80 mx-auto justify-between'>
          <p><Link href='/'>Home</Link></p>
          <p><Link href='https://lbdao.xyz/'> DAO </Link></p>
          <p><Link href="https://academy.lbdao.xyz/">Academy</Link> </p>
          <p><Link href="https://lazy.lbdao.xyz/">Lazy NFT</Link></p>
        </div>
      </div>
      <div className='lg:flex justify-between my-8'>
        <img className='w-10 my-4 lg:mx-0 lg:my-0 mx-auto' src="/images/new-logo.png" alt="" />
        <div className='flex my-auto justify-between gap-1'>
          <Link href={'https://web.facebook.com/profile.php?id=61575270601827'}>
            <img className='w-12 h-12 my-auto' src="/images/icons/001.svg" alt="" />
          </Link>
          <Link href={'https://x.com/letsbuild_dao'}><img className='w-12 h-12 my-auto' src="/images/icons/002.svg" alt="" />          </Link>
          <Link href={'https://t.me/letsbuilddaocommunity'}>
            <img className='w-12 h-12 my-auto' src="/images/icons/003.svg" alt="" />
          </Link>
          <Link href={'https://www.instagram.com/letsbuilddao/'}>
            <img className='w-12 h-12 my-auto' src="/images/icons/004.svg" alt="" />
          </Link>
          <Link href={'https://www.linkedin.com/in/let-s-build-labs-208b52296/'}>
            <img className='w-12 h-12 my-auto' src="/images/icons/005.svg" alt="" />
          </Link>
        </div>
      </div>
      <div className='bg-[#E5DEFF] text-[#030303] rounded-sm mt-6 text-center p-4 text-sm'>
        <p>Copyright © {new Date().getFullYear()} LB Labs. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;