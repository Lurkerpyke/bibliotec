import React from 'react'
import BookOverview from './BookOverview';
import BookCard from './BookCard';

interface Props {
    title: string;
    books: Book[];
    containerClassName?: string;
};

const BookList = ({ title, books, containerClassName }: Props) => {

    if (books.length < 2) return;

    return (
        <section className={containerClassName}>
            <h2 className='text-4xl text-foreground'>{title}</h2>

            <ul className='mt-10 flex flex-wrap gap-5 max-xs:justify-between xs:gap-10'>
                {books.map((book) => (
                    <BookCard key={book.title} {...book} />
                ))}
            </ul>
        </section>
    )
};

export default BookList;