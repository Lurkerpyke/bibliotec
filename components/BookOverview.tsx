import React from 'react'
import Image from 'next/image'
import { Button } from './ui/button'
import BookCover from './BookCover'

const BookOverview = ({
    title,
    author,
    genre,
    rating,
    totalCopies,
    availableCopies,
    description,
    color,
    cover,
}: Book) => {
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

                    <Button className='mt-4 min-h-10 w-fit bg-primary text-dark-100 hover:bg-primary-foreground/90 max-md:w-full'>
                        <Image src='/icons/book.svg' alt='book' width={20} height={20} />
                        <p className='ml-2 text-xl text-black'>Escolher</p>
                    </Button>
                </div>
            </div>

            {/* IMAGEM */}
            <div className='flex flex-1 justify-center'>
                <div className='relative'>
                    <BookCover
                        variant='wide'
                        className='z-10'
                        coverColor={color}
                        coverImage={cover}
                    />

                    <div className='absolute left-16 top-10 rotate-12 opacity-40 max-sm:hidden'>
                        <BookCover
                            variant='wide'
                            coverColor={color}
                            coverImage={cover}
                        />
                    </div>
                </div>
            </div>
        </section>

    )
}

export default BookOverview;