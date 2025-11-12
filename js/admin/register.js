document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".auth__form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Lấy giá trị từ form
    const username = document.getElementById("username").value.trim();
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const dob = document.getElementById("dob").value;

    // Mapping gender từ form sang chuẩn backend
    const genderInput = document.querySelector("input[name='gender']:checked");
    let gender = null;
    if (genderInput) {
      switch (genderInput.value) {
        case "Nam":
          gender = "MALE";
          break;
        case "Nữ":
          gender = "FEMALE";
          break;
        case "Khác":
          gender = "OTHER";
          break;
        default:
          gender = "PREFER_NOT_TO_SAY";
      }
    }

    // Kiểm tra mật khẩu
    if (password !== confirmPassword) {
      alert("❌ Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }

    // Chuẩn bị dữ liệu gửi lên API
    const userData = {
      username,
      firstName,
      lastName,
      email,
      password,
      birthday: dob || null,
      gender
    };

    try {
      const response = await fetch("http://localhost:8080/api/v1/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });

      const result = await response.json();

      if (response.ok && result.code === 1000) {
        alert(`✅ Đăng ký thành công! UserID: ${result.result.userId}`);
        form.reset();
      } else {
        // Nếu backend trả về lỗi, hiển thị thông báo chi tiết
        const errorMessage = result.message || JSON.stringify(result);
        alert(`❌ Đăng ký thất bại: ${errorMessage}`);
      }
    } catch (error) {
      console.error(error);
      alert(`❌ Có lỗi xảy ra khi kết nối server: ${error.message}`);
    }
  });
});
