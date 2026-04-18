/**
 * fetchModel - Gửi HTTP GET request đến server và trả về dữ liệu JSON.
 *
 * @param {string} url  URL cần gọi (ví dụ: "/user/list")
 * @returns {Promise}   Promise chứa dữ liệu JSON từ server
 */
async function fetchModel(url) {
  let BASE_URL = process.env.REACT_APP_API_URL;

  if (!BASE_URL) {
    if (window.location.hostname.includes("csb.app")) {
      // Đảm bảo đây là ID sandbox backend của bạn
      BASE_URL = "https://hnzt3m-3000.csb.app";
    } else {
      BASE_URL = "http://localhost:3000";
    }
  }

  const fullUrl = BASE_URL + url;
  console.log("Đang gọi API:", fullUrl); // Log để kiểm tra URL

  try {
    const response = await fetch(fullUrl);

    if (!response.ok) {
      throw new Error("Lỗi khi gọi API: " + response.status + " " + response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi chi tiết trong fetchModel:", error);
    throw error;
  }
}

export default fetchModel;
