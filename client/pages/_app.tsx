import axios from "@/src/axios";
import { Header } from "@/src/components/Header";
import Sidebar from "@/src/components/Sidebar";
import { UserAvatar } from "@/src/components/UserAvatar";
import "@/styles/globals.css";
import { NextPageContext, NextPage } from "next";
import type { AppProps } from "next/app";
import { useRouter } from "next/dist/client/router";
import Head from "next/dist/shared/lib/head";
import { useEffect } from "react";

interface Props extends AppProps {
    userRole: string | null;
    isLoggedIn: boolean;
    name: string;
    avatar: string;
}

const App = function ({
    Component,
    pageProps,
    userRole,
    isLoggedIn,
    avatar,
    name,
}: Props) {
    const router = useRouter();

    useEffect(() => {
        const { pathname } = router;
        if (!isLoggedIn && !pathname.includes("/auth"))
            router.replace("/auth/signin");
        else if (
            (isLoggedIn &&
                userRole === "user" &&
                (pathname.includes("/admin") || pathname.includes("/auth"))) ||
            (userRole === "admin" &&
                (pathname.includes("/user") || pathname.includes("/auth")))
        )
            router.replace("/");
    }, []);

    return (
        <div className="min-h-full w-screen">
            <Head>
                <title>Online Exam</title>
            </Head>
            {userRole === "admin" ? (
                <Sidebar />
            ) : (
                userRole === "user" &&
                !router.pathname.includes("/tests/start") && (
                    <Header isLoggedIn={isLoggedIn} avatar={avatar} />
                )
            )}
            <div
                className={`${
                    userRole === "admin"
                        ? "admin-main"
                        : userRole === "user" &&
                          !router.pathname.includes("/tests/start")
                        ? "mt-[70px]"
                        : ""
                } absolute left-0 overflow-y-auto bottom-0 top-0 right-0 bg-gray-100 max-w-full`}
            >
                {userRole === "admin" && (
                    <UserAvatar className="absolute right-0" avatar={avatar} />
                )}
                <Component
                    suppressHydrationWarning
                    {...pageProps}
                    userRole={userRole}
                    isLoggedIn={isLoggedIn}
                    name={name}
                    avatar={avatar}
                />
            </div>
        </div>
    );
};

export default App;

App.getInitialProps = async function ({ ctx }: { ctx: NextPageContext }) {
    const cookie = ctx?.req?.headers.cookie;
    let userRole = null,
        avatar,
        name,
        email;

    try {
        const res = await axios("/api/current-user", {
            headers: {
                cookie: cookie,
            },
        });

        ({ avatar, name, userRole, email } = res.data);
    } catch (e) {
        console.log(e);
    }

    return {
        isLoggedIn: !!userRole,
        userRole,
        avatar,
        name,
        email,
    };
};
