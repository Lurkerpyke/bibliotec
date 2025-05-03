// AuthForm.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

// Base schema with common fields
const baseSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
})

// Extend base schema for sign-up
const signUpSchema = baseSchema.extend({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
})

// Infer types
type SignInForm = z.infer<typeof baseSchema>
type SignUpForm = z.infer<typeof signUpSchema>

export function AuthForm({ type }: { type: 'sign-in' | 'sign-up' }) {
    const form = useForm<SignInForm | SignUpForm>({
        resolver: zodResolver(type === 'sign-up' ? signUpSchema : baseSchema),
        defaultValues: type === 'sign-up'
            ? { name: '', email: '', password: '' }
            : { email: '', password: '' }
    })

    const onSubmit = (values: SignInForm | SignUpForm) => {
        console.log(values)
    }

    return (
        <div className="w-full lg:w-1/2 p-8 flex items-center justify-center">
            <div className="w-full max-w-md">
                <h1 className="text-3xl font-bold mb-8">
                    {type === 'sign-in' ? 'Sign In' : 'Create Account'}
                </h1>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {type === 'sign-up' && (
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full">
                            {type === 'sign-in' ? 'Sign In' : 'Sign Up'}
                        </Button>
                    </form>
                </Form>

                <div className="mt-8 text-center text-sm">
                    {type === 'sign-in' ? (
                        <>
                            Don't have an account?{' '}
                            <a href="/sign-up" className="font-semibold text-primary hover:underline">
                                Sign up
                            </a>
                        </>
                    ) : (
                        <>
                            Already have an account?{' '}
                            <a href="/sign-in" className="font-semibold text-primary hover:underline">
                                Sign in
                            </a>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}