/**
 * fetchModel - Gửi HTTP GET request đến server và trả về dữ liệu JSON.
 *
 * @param {string} url  URL cần gọi (ví dụ: "/user/list")
 * @returns {Promise}   Promise chứa dữ liệu JSON từ server
 */
async function fetchModel(url) {
  // Ưu tiên dùng biến môi trường, nếu không có thì kiểm tra xem có phải đang chạy trên CodeSandbox không
  let BASE_URL = process.env.REACT_APP_API_URL;

  if (!BASE_URL) {
    // Nếu đang chạy trên CodeSandbox (hostname chứa .csb.app)
    if (window.location.hostname.includes("csb.app")) {
      // Thay thế bằng URL backend của bạn trên CodeSandbox
      BASE_URL = "https://hnzt3m-3000.csb.app";
    } else {
      // Chạy local
      BASE_URL = "http://localhost:3000";
    }
  }

  const fullUrl = BASE_URL + url;

  const response = await fetch(fullUrl);

  // Kiểm tra server có trả về lỗi không
  if (!response.ok) {
    throw new Error("Lỗi khi gọi API: " + response.status + " " + response.statusText);
  }

  // Chuyển response về JSON và trả về
  const data = await response.json();
  return data;
}

export default fetchModel;
