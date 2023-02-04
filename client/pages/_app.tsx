import axios from "@/src/axios";
import { Header } from "@/src/components/Header";
import "@/styles/globals.css";
import { NextPageContext, NextPage } from "next";
import type { AppProps } from "next/app";
import { useRouter } from "next/dist/client/router";
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
                pathname.includes("/admin")) ||
            (userRole === "admin" && pathname.includes("/user"))
        )
            router.replace("/");
    }, []);
    return (
        <div>
            <Header isLoggedIn={isLoggedIn} avatar={avatar} />
            <div className="container flex justify-center items-center">
                <Component
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
        name;

    try {
        const res = await axios("/api/current-user", {
            headers: {
                Cookie: cookie,
            },
        });

        ({ avatar, name, userRole } = res.data);
    } catch (e) {
        console.log(e);
    }

    return {
        isLoggedIn: !!userRole,
        userRole,
        avatar,
        name,
    };
};
