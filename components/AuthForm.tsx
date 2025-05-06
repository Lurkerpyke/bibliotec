//components/AuthForm.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { DefaultValues, FieldValues, Path, SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
import { z, ZodType } from 'zod';
import Link from 'next/link';

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FIELD_NAMES, FIELD_TYPES } from '@/constants';
import ImageUpload from './ImageUpload';

interface Props<T extends FieldValues> {
    schema: ZodType<T>;
    defaultValues: T;
    onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
    type: "SIGN_IN" | "SIGN_UP";
}


const AuthForm = <T extends FieldValues>({
    type,
    schema,
    defaultValues,
    onSubmit,
}: Props<T>) => {

    const isSignIn = type === 'SIGN_IN';
    
    const form: UseFormReturn<T> = useForm({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as DefaultValues<T>,
    })

    // 2. Define a submit handler.
    const handleSubmit: SubmitHandler<T> = async (data) => { };


    return (
        <div className='flex flex-col gap-4'>
            <h1 className='text-2xl font-semibold text-white'>
                {isSignIn ? 'Bem-vindo de volta!' : 'Crie uma conta!'}
            </h1>
            <p className='text-primary-foreground text-sm'>
                {isSignIn ? 'Acesse a vasta coleção de recursos e se mantenha atualizado.' : 'Por favor, preencha os campos e insira um ID Escolar válido para acessar a livraria'}
            </p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 w-full">

                    {Object.keys(defaultValues).map((field) => (
                        <FormField
                            key={field}
                            control={form.control}
                            name={field as Path<T>}
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className='capitalize'>
                                        {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                                    </FormLabel>
                                    <FormControl>
                                        {field.name === 'universityCard' ? (
                                            <ImageUpload onFileChange={field.onChange} />
                                        ) : (
                                            <Input
                                                required
                                                type={FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]}
                                                {...field}
                                            />
                                        )}
                                    </FormControl>
                                    {/* Properly typed error message */}
                                    <FormMessage>
                                        {fieldState.error?.message as React.ReactNode}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />
                    ))}
                    
                    <Button type="submit" className='bg-primary text-slate-800 hover:bg-background inline-flex min-h-14 w-full items-center justify-center rounded-md px-6 py-2 font-bold text-base'>
                        {isSignIn ? 'Entrar' : 'Criar conta'}
                    </Button>
                </form>
            </Form>

            <p className='text-center text-base font-medium'>
                {isSignIn ? 'É novo aqui? ' : 'Já tem uma conta? '}
                
                <Link href={isSignIn ? '/sign-up' : '/sign-in'} className='text-primary font-bold'>
                    {isSignIn ? 'Crie uma conta' : 'Entre'}
                </Link>
            </p>
        </div>
    )
}

export default AuthForm