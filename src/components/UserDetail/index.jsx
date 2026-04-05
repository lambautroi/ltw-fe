import React from "react";
import { Typography, Button } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import models from "../../modelData/models";

import "./styles.css";

/**
 * UserDetail hiển thị thông tin chi tiết của một người dùng.
 * userId lấy từ URL thông qua useParams().
 */
function UserDetail() {
  const { userId } = useParams();
  const user = models.userModel(userId);

  // Nếu không tìm thấy user, hiển thị thông báo lỗi
  if (!user) {
    return <Typography>Không tìm thấy người dùng.</Typography>;
  }

  return (
    <div style={{ padding: "16px" }}>
      <Typography variant="h5" gutterBottom>
        {user.first_name} {user.last_name}
      </Typography>

      <Typography variant="body1"><strong>Địa chỉ:</strong> {user.location}</Typography>
      <Typography variant="body1"><strong>Nghề nghiệp:</strong> {user.occupation}</Typography>
      <Typography variant="body1" style={{ marginTop: "8px" }}>
        <strong>Mô tả:</strong> {user.description}
      </Typography>

      {/* Nút chuyển sang trang ảnh của người dùng này */}
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to={`/photos/${user._id}`}
        style={{ marginTop: "16px" }}
      >
        Xem ảnh của {user.first_name}
      </Button>
    </div>
  );
}

export default UserDetail;
