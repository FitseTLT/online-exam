import styles from "./sidebar.module.css";
import {
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

const menus = [
    {
        name: "categories",
        path: "/admin/categories",
    },
];

const Sidebar = () => {
    const router = useRouter();
    const [selectedMenu, setSelectedMenu] = useState("");

    const onMenuSelect = (name: string, path: string) => {
        setSelectedMenu(name);
        router.push(path);
    };

    return (
        <Drawer
            variant="permanent"
            anchor="left"
            className={styles.sidebar}
            sx={{
                "& .MuiPaper-root": {
                    background: "transparent",
                    width: "300px",
                },
            }}
        >
            <Typography className="text-gray-300 mx-8 my-12">
                DASHBOARD
            </Typography>
            <Divider className="bg-gray-500" />
            <List
                className="bg-transparent"
                sx={{ "& .MuiPaper-root": { background: "transparent" } }}
            >
                {menus.map(({ name, path }) => (
                    <ListItem
                        key={name}
                        className={`text-gray-400 ${
                            name === selectedMenu ? styles["selected-menu"] : ""
                        }`}
                        onClick={() => onMenuSelect(name, path)}
                    >
                        <ListItemButton>{name}</ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

export default Sidebar;
