"use client";

import useSWR from 'swr';
import axios from '@/lib/axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useConfig } from "@/lib/config";
import { Notif } from '@/Theme/Midone/Utils/Notif';
import { useLang } from '.';


export function useAuth ({ middleware, redirectIfAuthenticated, guard } = {}) {
    const router = useRouter();
    const { laraAdmin, nextAdmin } = useConfig();
    const csrf = () => axios.get('/sanctum/csrf-cookie');
    const { Lang } = useLang();

    const userUrl = `${laraAdmin}/user`;
    const loginUrl = `${laraAdmin}/login`;
    const logoutUrl = `${laraAdmin}/logout`;
    const verifyUrl = `${laraAdmin}/verify`;
    const registerUrl = `${laraAdmin}/register`;
    const loginWithCodeUrl = `${laraAdmin}/login-with-code`;
    const loginCheckUrl = `${laraAdmin}/login-check`;

    const { data: user, error, mutate } = useSWR(userUrl, () =>
        axios
            .get(userUrl)
            .then(res => res.data)
            .catch(error => {
                if (error.response?.status !== 409) throw error;
            })
    );

    const register = async ({ setErrors, ...props }) => {
        await csrf();

        setErrors([]);
        try {
            const response = await axios.post(registerUrl, props);

             // هدایت کاربر به صفحه verify با مقدار mobile
            if (response?.status === 200 && response?.data?.mobile) {
                // تبدیل مسیر به یک رشته کامل با پارامتر کوئری
                router.push(`${nextAdmin}/verify?mobile=${response.data.mobile}`);
            }
        } catch (error) {
            if (error?.response?.status !== 422) throw error;
            setErrors(error?.response?.data.errors);
        }
    };

    

    const verify = async ({ setErrors, ...props }) => {
        setErrors([]);
        try {
            const response = await axios.post(verifyUrl, props);
            mutate();
            Notif('success', Lang('public.code_send'));
            
            if (response.data?.redirect) {
                //console.log(34);
                window.location.href = `${nextAdmin}/${response.data?.url}`; // تغییر مسیر به صفحه لاگین
            }
        } catch (error) {
            if (error?.response?.status !== 422) throw error;
            setErrors(error?.response?.data.errors);
        }
    };
    

    const login = async ({ setErrors, setStatus, ...props }) => {
        await csrf();

        setErrors([]);
        setStatus("loading")

        try {
            await axios.post(loginUrl, props);
            setStatus("success")
            mutate();
        } catch (error) {
            if (error.response?.status !== 422) throw error;
            setErrors(error.response?.data.errors);
            setStatus("error")
        }
    };

    const loginWithCode = async ({ setErrors, ...props }) => {
        await csrf();

        setErrors([]);

        try {
            await axios.post(loginWithCodeUrl, props);
            mutate();
        } catch (error) {
            if (error.response?.status !== 422) throw error;
            setErrors(error.response?.data.errors);
        }
    };
    const loginCheck = async ({ setErrors, ...props }) => {
        await csrf();

        setErrors([]);

        try {
            await axios.post(loginCheckUrl, props);
            mutate();
        } catch (error) {
            if (error.response?.status !== 422) throw error;
            setErrors(error.response?.data.errors);
        }
    };

    const logout = async () => {
        if (!error) {
            await axios.post(logoutUrl);
            mutate();
        }
        window.location.pathname = `${nextAdmin}/login`;
    };

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user) {
            router.push(redirectIfAuthenticated);
        }
        if (window.location.pathname === '/verify-email' && user?.email_verified_at) {
            router.push(redirectIfAuthenticated);
        }
        if (middleware === 'auth' && error) {
            logout();
        }
    }, [user, error]);

    return {
        user,
        login,
        logout,
        register,
        verify,
        loginWithCode,
        loginCheck
    };
}
