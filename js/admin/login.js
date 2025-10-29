document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (!form) {
    console.error("Không tìm thấy form login!");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert("Sai tên đăng nhập hoặc mật khẩu!");
        return;
      }

      const token = data.result?.token;
      if (!token) {
        alert("Không tìm thấy token!");
        return;
      }

      // Lưu token vào localStorage
      localStorage.setItem("token", token);

      // Giải mã JWT để lấy role
      const payload = JSON.parse(atob(token.split(".")[1]));
      const scope = payload.scope || "";

      console.log("Scope:", scope);

      if (scope.includes("ROLE_ADMIN")) {
        window.location.href = "/pages/admin/dashboard.html";
      } else if (scope.includes("ROLE_USER")) {
        window.location.href = "/public/index.html"
      } else {
        alert("Không xác định được quyền!");
      }
    } catch (err) {
      console.error("Lỗi:", err);
      alert("Không thể kết nối server!");
    }
  });
});
