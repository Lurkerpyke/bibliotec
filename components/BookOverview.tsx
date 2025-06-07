import React from 'react';
import Image from 'next/image';
import BookCover from './BookCover';
import BorrowBook from './BorrowBook';
import { db } from '@/database/drizzle';
import { users } from '@/database/schema';
import { eq } from 'drizzle-orm';

interface Props extends Book {
    userId: string;
};

const BookOverview = async ({
    title,
    author,
    genre,
    rating,
    totalCopies,
    availableCopies,
    description,
    coverColor,
    coverUrl,
    id,
    userId,
}: Props) => {

    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

    const borrowingEligibility = {
        isEligible: availableCopies > 0 && user?.status === "APPROVED",
        message:
            availableCopies <= 0
                ? "Book is not available"
                : "Sua conta está em processo de aprovação",
    };

    return (
        <section className='flex flex-col-reverse items-center gap-12 sm:gap-32 xl:flex-row xl:gap-8'>
            {/* TEXTO E DETALHES */}
            <div className='flex flex-1 flex-col gap-5'>
                <h1 className='text-5xl font-semibold text-white md:text-7xl'>{title}</h1>

                <div className='mt-7 flex flex-row flex-wrap gap-4 text-xl text-light-100'>
                    <p>By <span className='font-semibold text-primary-foreground'>{author}</span></p>

                    <p>Categoria:{" "}<span className='font-semibold text-primary-foreground'>{genre}</span></p>

                    <div className='flex flex-row gap-1'>
                        <Image src='/icons/star.svg' alt='star' width={22} height={22} />
                        <p>{rating}</p>
                    </div>
                </div>

                <div className='flex flex-row flex-wrap gap-4 mt-1'>
                    <p className='text-xl text-light-100'>
                        Quantidade: <span className='ml-2 font-semibold text-primary'>{totalCopies}</span>
                    </p>

                    <p className='text-xl text-light-100'>
                        Disponíveis: <span className='ml-2 font-semibold text-primary'>{availableCopies}</span>
                    </p>

                    <p className='mt-2 text-justify text-xl text-light-100'>{description}</p>

                    {user && (<BorrowBook
                        bookId={id}
                        userId={userId}
                        borrowingEligibility={borrowingEligibility}
                    />)}
                </div>
            </div>

            {/* IMAGEM */}
            <div className='flex flex-1 justify-center'>
                <div className='relative'>
                    <BookCover
                        variant='wide'
                        className='z-10'
                        coverColor={coverColor}
                        coverImage={coverUrl}
                    />

                    <div className='absolute left-16 top-10 rotate-12 opacity-40 max-sm:hidden'>
                        <BookCover
                            variant='wide'
                            coverColor={coverColor}
                            coverImage={coverUrl}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
};

export default BookOverview;