import React from "react";
import { Typography, Divider } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import models from "../../modelData/models";

import "./styles.css";

/**
 * UserPhotos hiển thị tất cả ảnh và bình luận của một người dùng.
 * Dùng useParams() để lấy userId từ URL.
 */
function UserPhotos() {
  const { userId } = useParams();
  const photos = models.photoOfUserModel(userId);
  const user = models.userModel(userId);

  if (!user) {
    return <Typography>Không tìm thấy người dùng.</Typography>;
  }

  return (
    <div style={{ padding: "16px" }}>
      <Typography variant="h5" gutterBottom>
        Ảnh của {user.first_name} {user.last_name}
      </Typography>

      {/* Duyệt qua từng bức ảnh */}
      {photos.map((photo) => (
        <div
          key={photo._id}
          style={{ marginBottom: "32px", border: "1px solid #ddd", borderRadius: "8px", padding: "12px" }}
        >
          {/* Hiển thị ảnh */}
          <img
            src={`/images/${photo.file_name}`}
            alt={photo.file_name}
            style={{ maxWidth: "100%", borderRadius: "4px" }}
          />

          {/* Ngày đăng ảnh - dùng toLocaleString() để format dễ đọc */}
          <Typography variant="body2" color="textSecondary" style={{ marginTop: "8px" }}>
            Đăng ngày: {new Date(photo.date_time).toLocaleString("vi-VN")}
          </Typography>

          {/* Danh sách bình luận */}
          <Typography variant="subtitle1" style={{ marginTop: "12px", fontWeight: "bold" }}>
            Bình luận ({photo.comments ? photo.comments.length : 0})
          </Typography>
          <Divider />

          {photo.comments && photo.comments.length > 0 ? (
            photo.comments.map((comment) => (
              <div
                key={comment._id}
                style={{ marginTop: "8px", paddingLeft: "8px", borderLeft: "3px solid #1976d2" }}
              >
                {/* Tên người bình luận - có thể nhấn vào để xem trang chi tiết */}
                <Typography variant="body2">
                  <Link
                    to={`/users/${comment.user._id}`}
                    style={{ fontWeight: "bold", color: "#1976d2" }}
                  >
                    {comment.user.first_name} {comment.user.last_name}
                  </Link>
                  {" – "}
                  {new Date(comment.date_time).toLocaleString("vi-VN")}
                </Typography>
                <Typography variant="body2" style={{ marginTop: "4px" }}>
                  {comment.comment}
                </Typography>
              </div>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary" style={{ marginTop: "8px" }}>
              Chưa có bình luận.
            </Typography>
          )}
        </div>
      ))}
    </div>
  );
}

export default UserPhotos;
