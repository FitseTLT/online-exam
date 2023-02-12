import styles from "./sidebar.module.css";
import {
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/router";
import { useState } from "react";

const menus = [
    {
        name: "Categories",
        path: "/admin/categories",
    },
    {
        name: "Questions",
        path: "/admin/questions",
    },
    {
        name: "Exams",
        path: "/admin/exams",
    },
    {
        name: "Tests",
        path: "/admin/tests",
    },
];

const Sidebar = () => {
    const router = useRouter();
    const [selectedMenu, setSelectedMenu] = useState("");
    const [open, setOpen] = useState(false);

    const onMenuSelect = (name: string, path: string) => {
        setSelectedMenu(name);
        router.push(path);
    };

    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <>
            <IconButton onClick={toggleDrawer} className="absolute z-10">
                <MenuIcon
                    sx={{
                        display: {
                            md: "none",
                        },
                    }}
                />
            </IconButton>
            {["permanent", "temporary"].map((type) => (
                <Drawer
                    key={type}
                    open={type === "permanent" ? undefined : open}
                    onClose={type === "permanent" ? undefined : toggleDrawer}
                    variant={type === "permanent" ? "permanent" : "temporary"}
                    anchor="left"
                    className={styles.sidebar}
                    sx={{
                        display: {
                            md: type === "permanent" ? "block" : "none",
                            xs: type === "permanent" ? "none" : "block",
                        },
                        "& .MuiPaper-root": {
                            background: "transparent",
                            width: "250px",
                        },
                    }}
                >
                    <Typography className="text-gray-300 mx-8 my-12">
                        DASHBOARD
                    </Typography>
                    <Divider className="bg-gray-500" />
                    <List
                        className="bg-transparent"
                        sx={{
                            "& .MuiPaper-root": {
                                background: "transparent",
                            },
                        }}
                    >
                        {menus.map(({ name, path }) => (
                            <ListItem
                                key={name}
                                className={`text-gray-400 ${
                                    name === selectedMenu
                                        ? styles["selected-menu"]
                                        : ""
                                }`}
                                onClick={() => onMenuSelect(name, path)}
                            >
                                <ListItemButton>{name}</ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
            ))}
        </>
    );
};

export default Sidebar;
