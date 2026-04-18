/**
 * fetchModel - Gửi HTTP GET request đến server và trả về dữ liệu JSON.
 *
 * @param {string} url  URL cần gọi (ví dụ: "/user/list")
 * @returns {Promise}   Promise chứa dữ liệu JSON từ server
 */
async function fetchModel(url) {
  // Đổi thành URL backend CodeSandbox khi deploy lên sandbox
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
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
