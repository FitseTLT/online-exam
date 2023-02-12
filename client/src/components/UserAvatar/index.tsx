import axios from "@/src/axios";
import { Logout } from "@mui/icons-material";
import {
    Avatar,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
} from "@mui/material";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";

export const UserAvatar = ({
    avatar,
    className,
}: {
    avatar: string;
    className?: string;
}) => {
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
        <>
            <IconButton onClick={handleOpen} className={className}>
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
    );
};
