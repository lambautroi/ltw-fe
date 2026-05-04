import React, { useState, useEffect } from "react";
import { Divider, List, ListItem, ListItemText, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import fetchModel from "../../lib/fetchModelData";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModel("/user/list")
      .then(function (data) {
        setUsers(data);
        setLoading(false);
      })
      .catch(function (err) {
        console.error("Loi tai danh sach user:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Typography style={{ padding: "16px" }}>Dang tai...</Typography>;
  }

  return (
    <div>
      <Typography variant="h6" style={{ padding: "16px 16px 8px" }}>
        Nguoi dung
      </Typography>
      <List component="nav">
        {users.map(function (user) {
          return (
            <div key={user._id}>
              <ListItem
                button
                component={Link}
                to={"/users/" + user._id}
              >
                <ListItemText
                  primary={
                    `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
                    user.login_name ||
                    "Nguoi dung"
                  }
                />
              </ListItem>
              <Divider />
            </div>
          );
        })}
      </List>
    </div>
  );
}

export default UserList;
