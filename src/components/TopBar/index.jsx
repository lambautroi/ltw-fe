import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

import "./styles.css";

/**
 * TopBar hiển thị tên sinh viên bên trái và trạng thái trang bên phải.
 */
function TopBarContent() {
  const location = useLocation();
  const pathname = location.pathname;
  const [context, setContext] = useState("");

  useEffect(() => {
    // Kiểm tra đường dẫn /photos/:userId
    const photosMatch = pathname.match(/^\/photos\/(.+)$/);
    // Kiểm tra đường dẫn /users/:userId
    const usersMatch = pathname.match(/^\/users\/(.+)$/);

    if (photosMatch) {
      const userId = photosMatch[1];
      fetchModel("/user/" + userId)
        .then((user) => {
          setContext(`Ảnh của ${user.first_name} ${user.last_name}`);
        })
        .catch(() => setContext("Lỗi tải thông tin"));
    } else if (usersMatch) {
      const userId = usersMatch[1];
      fetchModel("/user/" + userId)
        .then((user) => {
          setContext(`Chi tiết: ${user.first_name} ${user.last_name}`);
        })
        .catch(() => setContext("Lỗi tải thông tin"));
    } else if (pathname === "/users" || pathname === "/") {
      setContext("Danh sách người dùng");
    } else {
      setContext("");
    }
  }, [pathname]);

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" color="inherit">
          Nguyễn Văn A
        </Typography>
        <Typography variant="h6" color="inherit">
          {context}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBarContent;
