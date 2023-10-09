// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { authHooks } from '@/hooks/zodiosHooks';
import { useEffect } from 'react';

export default function Logout() {
    const { data, error, isSuccess, isLoading } = authHooks.useImmutableQuery('/logout', undefined, { withCredentials: true })
    
    const queryClient = useQueryClient();

    useEffect(() => {
        if (isSuccess) {
            queryClient.removeQueries(['user']);
        }
    }, [isSuccess, queryClient])

    return (
        <div className='bg-gray-200 h-screen'>
            {isLoading &&
                <div className='flex justify-center items-center h-full bg-gray-200'>
                    <Loader2 className='mr-2 h-16 w-16 animate-spin' />
                </div>
            }
            {error &&
                <div className='flex justify-center items-center h-full bg-gray-200'>
                    <h1 className='text-2xl'>Error</h1>
                </div>
            }
            {isSuccess &&
                <div className='flex justify-center items-center h-full bg-gray-200'>
                    <h1 className='text-2xl'>Logged out successfully</h1>
                </div>
            }
            {data && 
                <div className='flex justify-center items-center h-full bg-gray-200'>
                    <h1 className='text-2xl'>{data.message}</h1>
                </div>
            }
        </div>
    )
}