// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import LoginForm from '@/components/LoginForm';
import { useEffect } from 'react';
import { authHooks } from '@/hooks/zodiosHooks';
import { LoginFormType } from 'validation-helpers';
import { useRouter } from 'next/router';

const getErrorString = (errorCode: number) => {
    switch (errorCode) {
        case 401:
            return 'Invalid username or password';
        default:
            return 'Something went wrong. Please try again.';
    }
}

export default function Login() {
    useEffect(() => {
        // redirect to home if already logged in
    }, []);

    const router = useRouter();

    const { error, isSuccess, isLoading, mutate: loginUser } = authHooks.useMutation('post', '/login/password')

    const submitForm = (loginData: LoginFormType) => {
        loginUser(loginData);
    }

    if (isSuccess) {
        router.push('/');
    }

    return (
        <div className='bg-gray-200 h-screen flex justify-center items-center'>
            <LoginForm onSubmit={submitForm} errMsg={error? getErrorString(parseInt(error.message.slice(-3) as string)): undefined} isLoading={isLoading || isSuccess} />
        </div>
    )
}