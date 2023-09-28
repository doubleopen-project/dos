// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import LoginForm from "@/components/LoginForm";
import { useEffect, useState } from "react";
import { authHooks } from '@/hooks/zodiosHooks';
import { LoginFormType } from "validation-helpers";
import { useRouter } from 'next/router';

export default function Login() {
    useEffect(() => {
        // redirect to home if already logged in
    }, []);

    const router = useRouter();

    const { mutate } = authHooks.usePostLoginPassword(undefined, {
        onSuccess: () => {
            const next = router.query.next;
            if (next) {
                router.push(next as string);
            } else {
                router.push('/');
            }
        }
    })

    const submitForm = (loginData: LoginFormType) => {
        mutate(loginData);
    }


    return (
        <main className='bg-gray-200 h-screen flex justify-center items-center'>
            <LoginForm onSubmit={submitForm} />
        </main>
    )

}