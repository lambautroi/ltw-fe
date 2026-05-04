import React, { useState, useEffect } from "react";
import { Box, Typography, Divider, Button, TextField } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import fetchModel, { PHOTO_LIST_CHANGED, imageUrlForFileName } from "../../lib/fetchModelData";

function PhotoCommentsBlock({ photo, onPosted }) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const trimmed = text.trim();
    if (!trimmed) {
      setError("Khong duoc gui binh luan trong.");
      return;
    }
    setSubmitting(true);
    fetchModel("/commentsOfPhoto/" + photo._id, {
      method: "POST",
      body: { comment: trimmed },
    })
      .then(function (payload) {
        if (payload && payload.comment) {
          onPosted(photo._id, payload.comment);
        }
        setText("");
      })
      .catch(function (err) {
        setError(err.message || "Khong gui duoc binh luan.");
      })
      .finally(function () {
        setSubmitting(false);
      });
  }

  return (
    <>
      <Typography variant="subtitle1" style={{ marginTop: "12px", fontWeight: "bold" }}>
        Binh luan ({photo.comments ? photo.comments.length : 0})
      </Typography>
      <Divider />

      {photo.comments && photo.comments.length > 0 ? (
        photo.comments.map(function (comment) {
          return (
            <div
              key={String(comment._id)}
              style={{ marginTop: "8px", paddingLeft: "8px", borderLeft: "3px solid #1976d2" }}
            >
              <Typography variant="body2">
                <Link
                  to={"/users/" + comment.user._id}
                  style={{ fontWeight: "bold", color: "#1976d2" }}
                >
                  {comment.user.first_name} {comment.user.last_name}
                </Link>
                {" - "}
                {new Date(comment.date_time).toLocaleString("vi-VN")}
              </Typography>
              <Typography variant="body2" style={{ marginTop: "4px" }}>
                {comment.comment}
              </Typography>
            </div>
          );
        })
      ) : (
        <Typography variant="body2" color="textSecondary" style={{ marginTop: "8px" }}>
          Chua co binh luan.
        </Typography>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          label="Viet binh luan"
          value={text}
          onChange={(e) => setText(e.target.value)}
          fullWidth
          multiline
          minRows={2}
          size="small"
          placeholder="Noi dung binh luan..."
        />
        {error ? (
          <Typography color="error" variant="caption" display="block" sx={{ mt: 0.5 }}>
            {error}
          </Typography>
        ) : null}
        <Button type="submit" variant="contained" size="small" sx={{ mt: 1 }} disabled={submitting}>
          {submitting ? "Dang gui..." : "Gui binh luan"}
        </Button>
      </Box>
    </>
  );
}

function UserPhotos() {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchModel("/user/" + userId),
      fetchModel("/photosOfUser/" + userId),
    ])
      .then(function (results) {
        const userData = results[0];
        const photosData = results[1];
        setUser(userData);
        setPhotos(photosData);
        setLoading(false);
      })
      .catch(function (err) {
        console.error("Loi tai anh:", err);
        setLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    function onPhotosChanged(ev) {
      const ownerId = ev && ev.detail && ev.detail.userId;
      if (ownerId === undefined || String(ownerId) !== String(userId)) return;
      fetchModel("/photosOfUser/" + userId)
        .then(function (photosData) {
          setPhotos(photosData);
        })
        .catch(function (err) {
          console.error("Loi lam moi danh sach anh:", err);
        });
    }
    window.addEventListener(PHOTO_LIST_CHANGED, onPhotosChanged);
    return function () {
      window.removeEventListener(PHOTO_LIST_CHANGED, onPhotosChanged);
    };
  }, [userId]);

  function appendComment(photoId, newComment) {
    setPhotos(function (prev) {
      return prev.map(function (p) {
        if (String(p._id) !== String(photoId)) return p;
        const list = Array.isArray(p.comments) ? p.comments.slice() : [];
        list.push(newComment);
        return Object.assign({}, p, { comments: list });
      });
    });
  }

  if (loading) {
    return <Typography style={{ padding: "16px" }}>Dang tai...</Typography>;
  }

  if (!user) {
    return <Typography>Khong tim thay nguoi dung.</Typography>;
  }

  return (
    <div style={{ padding: "16px" }}>
      <Typography variant="h5" gutterBottom>
        Anh cua {user.first_name} {user.last_name}
      </Typography>

      {photos.map(function (photo) {
        return (
          <div
            key={photo._id}
            style={{ marginBottom: "32px", border: "1px solid #ddd", borderRadius: "8px", padding: "12px" }}
          >
            <img
              src={imageUrlForFileName(photo.file_name)}
              alt={photo.file_name}
              style={{ maxWidth: "100%", borderRadius: "4px" }}
            />

            <Typography variant="body2" color="textSecondary" style={{ marginTop: "8px" }}>
              Dang ngay: {new Date(photo.date_time).toLocaleString("vi-VN")}
            </Typography>

            <PhotoCommentsBlock photo={photo} onPosted={appendComment} />
          </div>
        );
      })}
    </div>
  );
}

export default UserPhotos;
