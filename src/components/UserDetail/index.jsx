import React, { useState, useEffect } from "react";
import { Typography, Button } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchModel("/user/" + userId)
      .then(function (data) {
        setUser(data);
        setLoading(false);
      })
      .catch(function (err) {
        console.error("Loi tai user:", err);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return <Typography style={{ padding: "16px" }}>Dang tai...</Typography>;
  }

  if (!user) {
    return <Typography>Khong tim thay nguoi dung.</Typography>;
  }

  const fullName =
    `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
    user.login_name ||
    "Nguoi dung";

  return (
    <div style={{ padding: "16px" }}>
      <Typography variant="h5" gutterBottom>
        {fullName}
      </Typography>

      <Typography variant="body1"><strong>Dia chi:</strong> {user.location}</Typography>
      <Typography variant="body1"><strong>Nghe nghiep:</strong> {user.occupation}</Typography>
      <Typography variant="body1" style={{ marginTop: "8px" }}>
        <strong>Mo ta:</strong> {user.description}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        component={Link}
        to={"/photos/" + user._id}
        style={{ marginTop: "16px" }}
      >
        Xem anh cua {fullName}
      </Button>
    </div>
  );
}

export default UserDetail;
