"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { bookSchema } from "@/lib/validations";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileUpload } from "@/components/FileUpload";
import ColorPicker from "../ColorPicker";
import { createBook } from "@/lib/admin/actions/book";

interface Props extends Partial<Book> {
    type?: "create" | "update";
}

const BookForm = ({ type, ...book }: Props) => {
    const router = useRouter();

    const form = useForm<z.infer<typeof bookSchema>>({
        resolver: zodResolver(bookSchema),
        defaultValues: {
            title: "",
            description: "",
            author: "",
            genre: "",
            rating: 1,
            totalCopies: 1,
            coverUrl: "",
            coverColor: "",
            videoUrl: "",
            summary: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof bookSchema>) => {
        console.log(values);
        const result = await createBook(values);

        if (result.success) {
            toast.success("Book created successfully");

            router.push(`/admin/books/${result.data.id}`);
        } else {
            toast.error(result.message);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-xl border border-slate-200"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                        control={form.control}
                        name={"title"}
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-2">
                                <FormLabel className="text-base font-medium text-slate-700">
                                    Book Title
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        required
                                        placeholder="The Great Novel"
                                        {...field}
                                        className="min-h-14 border border-slate-200 bg-white p-4 text-base font-medium rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-blue-700"
                                    />
                                </FormControl>
                                <FormMessage className="text-rose-500 font-medium" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={"author"}
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-2">
                                <FormLabel className="text-base font-medium text-slate-700">
                                    Author
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        required
                                        placeholder="Jane Austen"
                                        {...field}
                                        className="min-h-14 border border-slate-200 bg-white p-4 text-base font-medium rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-blue-700"
                                    />
                                </FormControl>
                                <FormMessage className="text-rose-500 font-medium" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={"genre"}
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-2">
                                <FormLabel className="text-base font-medium text-slate-700">
                                    Genre
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        required
                                        placeholder="Science Fiction"
                                        {...field}
                                        className="min-h-14 border border-slate-200 bg-white p-4 text-base font-medium rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-blue-700"
                                    />
                                </FormControl>
                                <FormMessage className="text-rose-500 font-medium" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name={"rating"}
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-2">
                                <FormLabel className="text-base font-medium text-slate-700">
                                    Rating <span className="text-slate-400 text-sm">(1-5)</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={5}
                                        placeholder="4.5"
                                        {...field}
                                        className="min-h-14 border border-slate-200 bg-white p-4 text-base font-medium rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-blue-700"
                                    />
                                </FormControl>
                                <FormMessage className="text-rose-500 font-medium" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name={"totalCopies"}
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-2">
                                <FormLabel className="text-base font-medium text-slate-700">
                                    Total Copies
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={10000}
                                        placeholder="50"
                                        {...field}
                                        className="min-h-14 border border-slate-200 bg-white p-4 text-base font-medium rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-blue-700"
                                    />
                                </FormControl>
                                <FormMessage className="text-rose-500 font-medium" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name={"coverUrl"}
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-2 md:col-span-2">
                                <FormLabel className="text-base font-medium text-slate-700">
                                    Book Cover Image
                                </FormLabel>
                                <div className="rounded-xl bg-white p-4 border border-slate-200 shadow-sm">
                                    <FileUpload
                                        type="image"
                                        accept="image/*"
                                        placeholder="Upload a book cover"
                                        folder="books/covers"
                                        variant="light"
                                        onFileChange={field.onChange}
                                        value={field.value}
                                    />
                                </div>
                                <FormMessage className="text-rose-500 font-medium" />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name={"coverColor"}
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                            <FormLabel className="text-base font-normal text-black">
                                Primary Color
                            </FormLabel>
                            <FormControl>
                                <ColorPicker onPickerChange={field.onChange} value={field.value} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name={"description"}
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                            <FormLabel className="text-base font-medium text-slate-700">
                                Book Description
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="A captivating story about..."
                                    {...field}
                                    rows={5}
                                    className="min-h-[150px] border border-slate-200 bg-white p-4 text-base font-medium rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-blue-700"
                                />
                            </FormControl>
                            <FormMessage className="text-rose-500 font-medium" />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                        control={form.control}
                        name={"videoUrl"}
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-2">
                                <FormLabel className="text-base font-medium text-slate-700">
                                    Book Trailer
                                </FormLabel>
                                <div className="rounded-xl bg-white p-4 border border-slate-200 shadow-sm">
                                    <FileUpload
                                        type="video"
                                        accept="video/*"
                                        placeholder="Upload a book trailer"
                                        folder="books/videos"
                                        variant="light"
                                        onFileChange={field.onChange}
                                        value={field.value}
                                    />
                                </div>
                                <FormMessage className="text-rose-500 font-medium" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name={"summary"}
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-2">
                                <FormLabel className="text-base font-medium text-slate-700">
                                    Short Summary
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Key highlights and takeaways..."
                                        {...field}
                                        rows={5}
                                        className="min-h-[150px] border border-slate-200 bg-white p-4 text-base font-medium rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-blue-700"
                                    />
                                </FormControl>
                                <FormMessage className="text-rose-500 font-medium" />
                            </FormItem>
                        )}
                    />
                </div>

                <Button
                    type="submit"
                    className="min-h-14 w-full bg-indigo-950 text-white font-bold text-lg cursor-pointer rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                    {type === "update" ? "Update Book" : "Add Book to Library"}
                </Button>
            </form>
        </Form>
    );
};
export default BookForm;