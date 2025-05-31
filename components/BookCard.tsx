import React from 'react'
import Link from 'next/link'
import BookCover from './BookCover'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Button } from './ui/button'

const BookCard = ({
    id,
    title,
    genre,
    coverColor,
    coverUrl,
    isLoanedBook = false
}: Book) => {
    return (
        <li className={cn(isLoanedBook && 'w-full sm:w-52')}>
            <Link href={`/books/${id}`} className={cn(isLoanedBook && "w-full flex flex-col items-center")}>
                <BookCover coverImage={coverUrl} coverColor={coverColor} />

                <div className={cn('mt-4', !isLoanedBook && 'xs:max-w-40 max-w-28')}>
                    <p className='mt-2 line-clamp-1 text-base font-semibold text-white xs:text-xl'>
                        {title}
                    </p>
                    <p className='mt-1 line-clamp-1 text-sm italic text-light-100 xs:text-base'>{genre}</p>
                </div>

                {isLoanedBook && (
                    <div className='mt-3w-full'>
                        <div className='flex flex-row items-center gap-1 max-xs:justify-center'>
                            <Image src='/icons/calendar.svg' alt='calendar' width={18} height={18} className='object-contain' />

                            <p className='text-sm font-semibold text-primary-foreground'>5 dias para retornar</p>
                        </div>
                        <Button className='bg-slate-800 mt-3 min-h-14 w-full text-base cursor-pointer'>
                            Download Ticket
                        </Button>
                    </div>
                )}
            </Link>
        </li>
    )
}

export default BookCard