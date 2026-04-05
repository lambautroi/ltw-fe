import React, { useState, useEffect } from "react";
import { Typography, Button } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

import "./styles.css";

/**
 * UserDetail hiển thị thông tin chi tiết của một người dùng.
 * userId lấy từ URL thông qua useParams().
 */
function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Gọi API /user/:id mỗi khi userId thay đổi
  useEffect(() => {
    setLoading(true);
    fetchModel("/user/" + userId)
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi tải user detail:", err);
        setLoading(false);
      });
  }, [userId]); // [userId] nghĩa là chạy lại khi userId thay đổi

  if (loading) {
    return <Typography style={{ padding: "16px" }}>Đang tải...</Typography>;
  }

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
