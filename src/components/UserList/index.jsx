import React from "react";
import { Divider, List, ListItem, ListItemText, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import "./styles.css";
import models from "../../modelData/models";

/**
 * UserList hiển thị danh sách tên người dùng ở cột bên trái.
 * Nhấn vào tên sẽ chuyển đến trang chi tiết của người dùng đó.
 */
function UserList() {
  const users = models.userListModel();

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
