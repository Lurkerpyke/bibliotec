'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import Image from 'next/image'

const Header = () => {

  const pathname = usePathname();

  return (
    <header className='flex justify-between gap-5 my-10'>
      <Link href="/">
        <Image src="/icons/logo.svg" alt='logo' width={40} height={40}></Image>
      </Link>


      <ul className='flex flex-row items-center gap-8'>
        <li>
          <Link href="/livraria" className={cn(
            'text-base cursor-pointer capitalize',
            pathname === 'livraria' ? 'text-primary-foreground' : 'text-primary-foreground')}>livraria</Link>
        </li>
      </ul>
    </header>
  )
}

export default Header