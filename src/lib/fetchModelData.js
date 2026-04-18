/**
 * fetchModel - Gửi HTTP GET request đến server và trả về dữ liệu JSON.
 */
async function fetchModel(url) {
  let BASE_URL = process.env.REACT_APP_API_URL;

  if (!BASE_URL) {
    if (window.location.hostname.includes("csb.app")) {
      /**
       * QUAN TRỌNG: Thay 'ID_BACKEND' bằng ID thực tế của sandbox backend của bạn.
       * Ví dụ: nếu URL backend là https://ptp6y6-3000.csb.app thì ID là ptp6y6
       */
      const BACKEND_ID = "ptp6y6"; // <--- BẠN HÃY SỬA ID Ở ĐÂY
      BASE_URL = `https://${BACKEND_ID}-3000.csb.app`;
    } else {
      BASE_URL = "http://localhost:3000";
    }
  }

  const fullUrl = BASE_URL + url;
  console.log("Đang gọi API:", fullUrl);

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
