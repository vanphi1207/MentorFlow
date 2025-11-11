// ===============================
// 🔐 AUTH.JS - QUẢN LÝ TOKEN & LOGIN FLOW
// ===============================

// Gọi khi người dùng đăng nhập
async function loginUser(username, password) {
  try {
    const res = await fetch("http://localhost:8080/api/v1/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert("❌ Sai tài khoản hoặc mật khẩu!");
      return;
    }

    const token = data.result?.token;
    const refreshToken = data.result?.refreshToken;

    if (!token) {
      alert("Không nhận được token từ server!");
      return;
    }

    // ✅ Lưu token và refreshToken
    localStorage.setItem("token", token);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    // ✅ Giải mã JWT để lấy quyền
    const payload = JSON.parse(atob(token.split(".")[1]));
    const scope = payload.scope || "";

    console.log("Đăng nhập thành công với quyền:", scope);

    // ✅ Điều hướng theo quyền
    if (scope.includes("ROLE_ADMIN")) {
      window.location.href = "/pages/admin/dashboard.html";
    } else if (scope.includes("ROLE_USER")) {
      window.location.href = "/public/index.html";
    } else {
      alert("Không xác định được quyền truy cập!");
    }
  } catch (err) {
    console.error("Lỗi đăng nhập:", err);
    alert("⚠️ Không thể kết nối đến server!");
  }
}

// ===============================
// 📦 Hàm fetch có tự động refresh token
// ===============================
async function fetchWithAuth(url, options = {}) {
  let token = localStorage.getItem("token");
  if (!token) {
    alert("Bạn chưa đăng nhập!");
    window.location.href = "/pages/login.html";
    return;
  }

  // Gắn Authorization header
  options.headers = {
    ...options.headers,
    "Authorization": `Bearer ${token}`,
  };

  // Gửi request chính
  let res = await fetch(url, options);

  // Nếu token hết hạn (401)
  if (res.status === 401) {
    console.warn("Token hết hạn, đang làm mới...");

    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      localStorage.clear();
      window.location.href = "/pages/login.html";
      return;
    }

    // Gọi API refresh token
    const refreshRes = await fetch("http://localhost:8080/api/v1/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (refreshRes.ok) {
      const newData = await refreshRes.json();
      const newToken = newData.result?.token;

      if (newToken) {
        localStorage.setItem("token", newToken);

        // Gửi lại request ban đầu với token mới
        options.headers["Authorization"] = `Bearer ${newToken}`;
        res = await fetch(url, options);
      } else {
        alert("Không nhận được token mới!");
        localStorage.clear();
        window.location.href = "/pages/login.html";
        return;
      }
    } else {
      alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      localStorage.clear();
      window.location.href = "/pages/login.html";
      return;
    }
  }

  return res;
}

// ===============================
// 🚪 Đăng xuất
// ===============================
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  window.location.href = "/pages/login.html";
}

// ===============================
// 🔍 Hàm kiểm tra đăng nhập
// ===============================
function requireAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Bạn chưa đăng nhập!");
    window.location.href = "/pages/login.html";
  }
}

// ===============================
// ⚡ Xử lý form login khi DOM load
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!username || !password) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
      }

      await loginUser(username, password);
    });
  }
});
