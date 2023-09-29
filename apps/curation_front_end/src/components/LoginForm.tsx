// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { loginFormSchema, LoginFormType } from 'validation-helpers';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { PasswordInput, UsernameInput } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


interface LoginFormProps {
    onSubmit: (data: LoginFormType) => void;
    errMsg?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, errMsg }) => {
    const form = useForm<LoginFormType>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const errVisibilityClass = errMsg ? 'visible' : 'hidden';

    return (
        <div className='w-72 bg-white rounded-md h-min'>
            <Form {...form}>
                <div className={errVisibilityClass + ' text-xs text-red-500 pt-4 pr-4 pl-4'}>{errMsg}</div>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 p-4 flex flex-col'>

                    <FormField
                        control={form.control}
                        name='username'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <UsernameInput placeholder='username' {...field} required />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (
                            <FormItem className='!mt-4'>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <PasswordInput placeholder='********' type='password' {...field} required />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button className='grow' type='submit'>Login</Button>
                </form>
            </Form>
        </div>
    )
}

export default LoginForm;