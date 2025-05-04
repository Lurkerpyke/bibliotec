import { cn } from '@/lib/utils';
import React from 'react'
import Image from 'next/image';
import BookCoverSvg from './BookCoverSvg';

type BookCoverVariant = 'extraSmall' | 'small' | 'medium' | 'regular' | 'wide';

const variantStyles: Record<BookCoverVariant, string> = {
    extraSmall: 'w-[28.95px] h-10',
    small: 'w-[55px] h-[76px]',
    medium: 'w-[144px] h-[199px]',
    regular: 'xs:w-[174px] w-[114px] xs:h-[239px] h-[169px]',
    wide: 'xs:w-[296px] w-[256px] xs:h-[404px] h-[354px]'
};

interface Props {
    className?: string;
    variant?: BookCoverVariant;
    coverColor: string;
    coverImage: string;
};

const BookCover = ({
    className,
    variant = 'regular',
    coverColor = '#012B48',
    coverImage = 'https://placehold.co/400x600.png',
}: Props) => {
    return (
        <div className={cn('relative transition-all duration-300', variantStyles[variant], className)}>

            <BookCoverSvg coverColor={coverColor} />

            <div className='absolute z-10' style={{ left: '12%', width: '87.5%', height: '88%' }}>
                <Image src={coverImage} alt='book cover' fill className='rounded-sm object-fill' />
            </div>
        </div>
    )
};

export default BookCover;