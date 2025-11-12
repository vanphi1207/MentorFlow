document.addEventListener("DOMContentLoaded", async () => {
  const navbarBtn = document.querySelector(".navbar__btn");
  const loginBtn = document.querySelector(".btn-login");
  const registerBtn = document.querySelector(".btn-register");

  let token = localStorage.getItem("token");
  let userData = JSON.parse(localStorage.getItem("userData"));

  if (token) {
    // Nếu chưa có userData, gọi API my-info
    if (!userData) {
      try {
        const res = await fetch("http://localhost:8080/api/v1/users/my-info", {
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          userData = data.result;
          localStorage.setItem("userData", JSON.stringify(userData));
        } else {
          console.warn("Không lấy được thông tin user.");
        }
      } catch (err) {
        console.error("Lỗi khi lấy thông tin user:", err);
      }
    }

    if (navbarBtn && userData) {
      // Ẩn login/register
      if (loginBtn) loginBtn.style.display = "none";
      if (registerBtn) registerBtn.style.display = "none";

      // Tạo container avatar
      const avatarContainer = document.createElement("div");
      avatarContainer.className = "navbar__avatar-container";
      avatarContainer.style.position = "relative";
      avatarContainer.style.display = "inline-block";

      // Tạo avatar image hoặc chữ viết tắt
      const avatarImg = document.createElement("div");
      avatarImg.className = "navbar__avatar-img";
      avatarImg.style.width = "40px";
      avatarImg.style.height = "40px";
      avatarImg.style.borderRadius = "50%";
      avatarImg.style.display = "flex";
      avatarImg.style.alignItems = "center";
      avatarImg.style.justifyContent = "center";
      avatarImg.style.fontWeight = "bold";
      avatarImg.style.color = "#fff";
      avatarImg.style.backgroundColor = "#6c63ff";
      avatarImg.style.cursor = "pointer";
      avatarImg.style.fontSize = "14px";
      avatarImg.style.textTransform = "uppercase";
      
      // tao ten nguoi dung
      const userName = document.createElement("span");
      userName.className = "navbar__username";
      userName.textContent = `${userData.firstName || ""} ${userData.lastName || ""}`.trim();
      userName.style.marginLeft = "10px";
      userName.style.fontWeight = "500";
      userName.style.color = "#333";
      userName.style.cursor = "pointer";
      userName.style.fontSize = "15px";
      userName.style.verticalAlign = "middle";
      avatarContainer.style.display = "flex";
      avatarContainer.style.alignItems = "center";
      
      if (userData.avatar) {
        avatarImg.style.backgroundImage = `url(${userData.avatar})`;
        avatarImg.style.backgroundSize = "cover";
        avatarImg.style.backgroundPosition = "center";
        avatarImg.textContent = "";
      } else {
        const firstName = userData.firstName || "";
        const lastName = userData.lastName || "";
        const initials = (firstName[0] || "") + (lastName[0] || "");
        avatarImg.textContent = initials;
      }

      // Tạo dropdown menu
      const dropdown = document.createElement("ul");
      dropdown.className = "navbar__avatar-dropdown";
      dropdown.style.display = "none";
      dropdown.style.position = "absolute";
      dropdown.style.top = "50px";
      dropdown.style.right = "-65px";
      dropdown.style.background = "#fff";
      dropdown.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
      dropdown.style.listStyle = "none";
      dropdown.style.padding = "10px 0";
      dropdown.style.margin = "0";
      dropdown.style.minWidth = "160px";
      dropdown.style.borderRadius = "8px";
      dropdown.style.zIndex = "1000";

      dropdown.innerHTML = `
        <li><a href="/pages/profileMentor.html" style="display:block; padding:5px 15px; color:#333; text-decoration:none;">Hồ sơ</a></li>
        <li><a href="#" id="logoutBtn" style="display:block; padding:5px 15px; color:#333; text-decoration:none;">Đăng xuất</a></li>
      `;

      avatarContainer.appendChild(avatarImg);
      avatarContainer.appendChild(userName);  
      avatarContainer.appendChild(dropdown);
      navbarBtn.appendChild(avatarContainer);

      // Click vào avatar → toggle dropdown
      avatarImg.addEventListener("click", (e) => {
        e.stopPropagation(); // tránh click lan ra document
        dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
      });

      // Click ra ngoài → ẩn dropdown
      document.addEventListener("click", () => {
        dropdown.style.display = "none";
      });

      // Ngăn click vào dropdown menu bị ẩn
      dropdown.addEventListener("click", (e) => e.stopPropagation());

      // Logout
      const logoutBtn = document.getElementById("logoutBtn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
          e.preventDefault();
          localStorage.removeItem("token");
          localStorage.removeItem("userData");
          location.href = "/pages/login/login.html";
        });
      }
    }
  }
});
