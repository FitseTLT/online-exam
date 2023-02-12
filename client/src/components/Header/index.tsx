import Link from "next/link";
import { UserAvatar } from "../UserAvatar";

type Props = {
    isLoggedIn: boolean;
    avatar: string;
};

export const Header = ({ isLoggedIn, avatar }: Props) => {
    return (
        <nav className="fixed top-0 h-[70px] right-0 left-0 mx-auto bg-gray-800">
            <div className="flex justify-between bg-gray-800 items-center h-full">
                <Link href="/" className="ml-4">
                    <h1 className="text-xl text-white">Online Exam</h1>
                </Link>
                <ul className="text-white font-sans flex">
                    <li className="mr-8">
                        <Link href="/user/tests">Tests</Link>{" "}
                    </li>
                    <li>
                        <Link href="/user/test-reports">Test Reports</Link>{" "}
                    </li>
                </ul>
                <div className="block">
                    {!isLoggedIn ? (
                        <>
                            <Link
                                href="/auth/signin"
                                className="m-1 bg-red-500 rounded py-2 px-4 text-white text-sm active:scale-95"
                            >
                                Sign in
                            </Link>
                            <Link
                                href="/auth/signup"
                                className="m-1 bg-red-500 rounded py-2 px-4 text-white text-sm active:scale-95"
                            >
                                Sign up
                            </Link>
                        </>
                    ) : (
                        <UserAvatar avatar={avatar} className="my-auto" />
                    )}
                </div>
            </div>
        </nav>
    );
};
