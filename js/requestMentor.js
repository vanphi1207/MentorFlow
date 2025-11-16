const tabs = document.querySelectorAll(".tab");
const contentWrappers = document.querySelectorAll(".content-wrapper");

tabs.forEach((tab) => {
  tab.addEventListener("click", function () {
    const tabValue = this.getAttribute("data-tab");

    tabs.forEach((t) => t.classList.remove("active"));
    this.classList.add("active");

    contentWrappers.forEach((content) => {
      content.style.display = "none";
    });

    document.querySelector(`[data-content="${tabValue}"]`).style.display =
      "grid";
  });
});

document.querySelectorAll(".btn-primary").forEach((btn) => {
  btn.addEventListener("click", function () {
    if (this.textContent.includes("Chat")) {
      alert("Mở cửa sổ trò chuyện");
    } else if (this.textContent.includes("Đổi")) {
      alert("Mở trang đổi lịch hẹn");
    }
  });
});




