import { render, screen } from "@testing-library/react";
import App from "./App";

test("hiển thị Please Login và form đăng nhập khi chưa có token", () => {
  render(<App />);
  expect(screen.getByText(/Please Login/i)).toBeInTheDocument();
  expect(screen.getAllByText(/Photo Sharing/i).length).toBeGreaterThan(0);
});
