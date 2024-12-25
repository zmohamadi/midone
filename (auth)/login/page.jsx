"use client";

import { useLang } from "@/lib/lang";
// import { useConfig } from "@/lib/config";
// import { useAuth } from "@/lib/auth";
// import { useState } from "react";
// import Link from "next/link";
import {Login} from "./Login"

export default function Main() {
    const { Lang } = useLang();
    return <Login Lang = {Lang} />
}
