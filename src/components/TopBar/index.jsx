import React, { useState, useEffect, useRef } from "react";
import { AppBar, Toolbar, Typography, Button, Snackbar } from "@mui/material";
import { useLocation } from "react-router-dom";
import fetchModel, { uploadPhoto, PHOTO_LIST_CHANGED } from "../../lib/fetchModelData";
import { useAuth } from "../../context/AuthContext";

import "./styles.css";

/**
 * Toolbar: "Hi <login_name>" + Logout khi đã đăng nhập; "Please Login" khi chưa.
 */
function TopBarContent() {
  const { user, token, logout } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;
  const [context, setContext] = useState("");
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState("");

  function handleAddPhotoClick() {
    fileInputRef.current && fileInputRef.current.click();
  }

  function handlePhotoFile(ev) {
    const f = ev.target.files && ev.target.files[0];
    ev.target.value = "";
    if (!f || !user || !user._id) return;
    setUploading(true);
    uploadPhoto(f)
      .then(function () {
        setToast("Đã thêm ảnh.");
        window.dispatchEvent(
          new CustomEvent(PHOTO_LIST_CHANGED, {
            detail: { userId: user._id },
          })
        );
      })
      .catch(function (err) {
        setToast(err.message || "Tải ảnh thất bại.");
      })
      .finally(function () {
        setUploading(false);
      });
  }

  useEffect(() => {
    if (!token) {
      setContext("");
      return;
    }
    const photosMatch = pathname.match(/^\/photos\/(.+)$/);
    const usersMatch = pathname.match(/^\/users\/(.+)$/);

    if (photosMatch) {
      const userId = photosMatch[1];
      fetchModel("/user/" + userId)
        .then((u) => {
          setContext(`Ảnh của ${u.first_name} ${u.last_name}`);
        })
        .catch(() => setContext("Lỗi tải thông tin"));
    } else if (usersMatch) {
      const userId = usersMatch[1];
      fetchModel("/user/" + userId)
        .then((u) => {
          setContext(`Chi tiết: ${u.first_name} ${u.last_name}`);
        })
        .catch(() => setContext("Lỗi tải thông tin"));
    } else if (pathname === "/users" || pathname === "/") {
      setContext("Danh sách người dùng");
    } else {
      setContext("");
    }
  }, [pathname, token]);

  const displayName = user && user.login_name ? user.login_name : "";

  return (
    <>
      <AppBar className="topbar-appBar" position="absolute">
      <Toolbar style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <Typography variant="h6" color="inherit">
          Nguyễn Văn A
        </Typography>
        <Typography variant="h6" color="inherit" style={{ flex: 1, textAlign: "center" }}>
          {context}
        </Typography>
        {token ? (
          <>
            <Typography variant="body1" color="inherit" style={{ marginRight: 8 }}>
              Hi {displayName}
            </Typography>
            <Button
              color="secondary"
              variant="contained"
              size="small"
              disabled={uploading}
              onClick={handleAddPhotoClick}
              sx={{ mr: 1 }}
            >
              Add Photo
            </Button>
            <input
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={handlePhotoFile}
            />
            <Button color="inherit" variant="outlined" size="small" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <Typography variant="body1" color="inherit">
            Please Login
          </Typography>
        )}
      </Toolbar>
      </AppBar>
      <Snackbar open={Boolean(toast)} autoHideDuration={5000} onClose={() => setToast("")} message={toast || ""} />
    </>
  );
}

export default TopBarContent;
