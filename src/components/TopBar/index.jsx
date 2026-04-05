import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import models from "../../modelData/models";

import "./styles.css";

/**
 * TopBar hiển thị tên sinh viên bên trái và trạng thái trang bên phải.
 * Dùng useLocation() để đọc đường dẫn hiện tại và xác định đang xem trang nào.
 */
function TopBarContent() {
  const location = useLocation();
  const pathname = location.pathname;

  let context = "";

  // Kiểm tra đường dẫn /photos/:userId
  const photosMatch = pathname.match(/^\/photos\/(.+)$/);
  // Kiểm tra đường dẫn /users/:userId
  const usersMatch = pathname.match(/^\/users\/(.+)$/);

  if (photosMatch) {
    const userId = photosMatch[1];
    const user = models.userModel(userId);
    if (user) {
      context = `Ảnh của ${user.first_name} ${user.last_name}`;
    }
  } else if (usersMatch) {
    const userId = usersMatch[1];
    const user = models.userModel(userId);
    if (user) {
      context = `Chi tiết: ${user.first_name} ${user.last_name}`;
    }
  } else if (pathname === "/users") {
    context = "Danh sách người dùng";
  }

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
