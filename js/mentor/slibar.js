document.addEventListener("DOMContentLoaded", () => {
    // Tìm phần menu có submenu (menu-dropdown)
    const dropdown = document.querySelector(".menu-dropdown");
    if (!dropdown) return;

    const toggle = dropdown.querySelector(".dropdown-toggle");

    // Khi click vào "Course" hoặc icon ▼
    toggle.addEventListener("click", () => {
      dropdown.classList.toggle("open");
    });
  });