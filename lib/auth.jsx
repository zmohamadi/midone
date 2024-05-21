"use client"

import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { useConfig } from "@/lib/config";

export function useAuth ({ middleware, redirectIfAuthenticated, guard } = {}) {
    const router = useRouter()
    const {laraAdmin, nextAdmin} = useConfig();
    const csrf = () => axios.get('/sanctum/csrf-cookie')

    let userUrl = "/api/user", loginUrl = "/login", logoutUrl = "/logout";
    if(guard == "admin"){
        userUrl = laraAdmin+"/user", loginUrl = laraAdmin+"/login", logoutUrl = laraAdmin+"/logout";
    }

    const { data: user, error, mutate } = useSWR(userUrl, () =>
        axios
            .get(userUrl)
            .then(res => res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error
            }),
    )

    const login = async ({ setErrors, setStatus, ...props }) => {
        await csrf()

        setErrors([])
        setStatus(null)
        // console.log("login");

        axios
            .post(loginUrl, props)
            .then(() => mutate())
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const logout = async () => {
        if (!error) {
            await axios.post(logoutUrl).then(() => mutate())
        }

        window.location.pathname = nextAdmin+"/login";
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user)
            router.push(redirectIfAuthenticated)
        if (
            window.location.pathname === '/verify-email' &&
            user?.email_verified_at
        )
            router.push(redirectIfAuthenticated)
        if (middleware === 'auth' && error) logout()
    }, [user, error])

    return {
        user,
        login,
        logout,
    }
}
