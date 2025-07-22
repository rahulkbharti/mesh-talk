import React, { useState } from "react";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, IconButton } from "@mui/material";
import { Home, Info, Contacts, Article, Interests, VideoCall, PermMedia, Menu } from "@mui/icons-material";
import { Link } from "react-router-dom";

const menuItems = [
    { text: "Home", icon: <Home />, path: "/" },
    { text: "About", icon: <Info />, path: "/about" },
    { text: "Contact", icon: <Contacts />, path: "/contact" },
    { text: "Posts", icon: <Article />, path: "/post" },
    { text: "Interest", icon: <Interests />, path: "/intrest" },
    { text: "Video Chat", icon: <VideoCall />, path: "/video-chat" },
    { text: "Media Test", icon: <PermMedia />, path: "/media" }
];

const Sidebar = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* <IconButton onClick={() => setOpen(true)} sx={{ position: "absolute", top: 15, left: 15 }}>
                <Menu fontSize="large" />
            </IconButton>

            <Drawer anchor="left" open={open} onClose={() => setOpen(false)}> */}
                <List sx={{ width: 250 }}>
                    {menuItems.map(({ text, icon, path }) => (
                        <ListItemButton component={Link} to={path} key={text} onClick={() => setOpen(false)}>
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    ))}
                </List>
            {/* </Drawer> */}
        </>
    );
};

export default Sidebar;
