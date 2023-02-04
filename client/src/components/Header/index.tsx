import styles from "./header.module.css";
import axios from "@/src/axios";
import { Logout } from "@mui/icons-material";
import { Avatar, IconButton, ListItemIcon, Menu } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import { useState } from "react";

type Props = {
    isLoggedIn: boolean;
    avatar: string;
};

export const Header = ({ isLoggedIn, avatar }: Props) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const router = useRouter();
    const signOut = async () => {
        try {
            await axios.post("/api/signout");
            router.replace("/auth/signin");
        } catch (e) {
            console.log(e);
        }
    };

    const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
    };
    const handleClose = () => setAnchorEl(null);

    return (
        <nav className="flex justify-between relative mx-auto p-6 bg-gray-800">
            <Link href="/">
                <h1 className="text-xl text-white">Online Exam</h1>
            </Link>
            <div>
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
                    <>
                        <IconButton onClick={handleOpen}>
                            <Avatar src={avatar} />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            onClick={handleClose}
                            onClose={handleClose}
                            open={Boolean(anchorEl)}
                            className="text-sm"
                        >
                            <MenuItem onClick={() => router.push("/profile")}>
                                <ListItemIcon className="mr-6">
                                    <Avatar className="w-7 h-7" />
                                </ListItemIcon>
                                My Profile
                            </MenuItem>
                            <MenuItem onClick={signOut}>
                                <ListItemIcon className="mr-6">
                                    <Logout className="w-7 h-7" />
                                </ListItemIcon>
                                Log out
                            </MenuItem>
                        </Menu>
                    </>
                )}
            </div>
        </nav>
    );
};
