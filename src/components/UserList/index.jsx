import React, { useState, useEffect } from "react";
import { Divider, List, ListItem, ListItemText, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

/**
 * UserList hiển thị danh sách tên người dùng ở cột bên trái.
 * Nhấn vào tên sẽ chuyển đến trang chi tiết của người dùng đó.
 */
function UserList() {
  // useState lưu danh sách users, ban đầu là mảng rỗng
  const [users, setUsers] = useState([]);
  // useState lưu trạng thái loading
  const [loading, setLoading] = useState(true);

  // useEffect gọi API khi component được mount lần đầu
  useEffect(() => {
    fetchModel("/user/list")
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi tải danh sách user:", err);
        setLoading(false);
      });
  }, []); // [] nghĩa là chỉ chạy 1 lần khi mount

  if (loading) {
    return <Typography style={{ padding: "16px" }}>Đang tải...</Typography>;
  }

  return (
    <div>
      <Typography variant="h6" style={{ padding: "16px 16px 8px" }}>
        Người dùng
      </Typography>
      <List component="nav">
        {users.map((user) => (
          <div key={user._id}>
            {/* Link điều hướng đến trang chi tiết người dùng */}
            <ListItem
              button
              component={Link}
              to={`/users/${user._id}`}
            >
              <ListItemText primary={`${user.first_name} ${user.last_name}`} />
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
    </div>
  );
}

export default UserList;
