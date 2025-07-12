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
                                    Título do Livro
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        required
                                        placeholder="O Grande Romance"
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
                                    Autor
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
                                    Gênero
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        required
                                        placeholder="Ficção Científica"
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
                                    Avaliação{" "}
                                    <span className="text-slate-400 text-sm">(1-5)</span>
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
                                    Total de Cópias
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
                                    Imagem da Capa do Livro
                                </FormLabel>
                                <div className="rounded-xl bg-white p-4 border text-black border-slate-200 shadow-sm">
                                    <FileUpload
                                        type="image"
                                        accept="image/*"
                                        placeholder="Enviar capa do livro"
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
                                Cor Primária
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
                                Descrição do Livro
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Uma história envolvente sobre..."
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
                                    Trailer do Livro
                                </FormLabel>
                                <div className="rounded-xl bg-white p-4 text-black overflow-hidden border border-slate-200 shadow-sm">
                                    <FileUpload
                                        type="video"
                                        accept="video/*"
                                        placeholder="Enviar trailer do livro"
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
                                    Resumo Curto
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Principais destaques e aprendizados..."
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
                    {type === "update" ? "Atualizar Livro" : "Adicionar Livro à Biblioteca"}
                </Button>
            </form>
        </Form>
    );
};
export default BookForm;