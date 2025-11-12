document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.querySelector(".logout button");

  logoutBtn.addEventListener("click", () => {
    // Xóa dữ liệu đăng nhập
    localStorage.removeItem("token");
    localStorage.removeItem("userData");

    // Chuyển về trang login (hoặc trang index)
    window.location.href = "/pages/login/login.html";
  });
});
