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





// call api

// ===============================
// Load danh sách booking của tôi
// ===============================
function loadMyBookings() {
  $.ajax({
    url: "http://localhost:8080/api/v1/bookings/my-bookings",
    method: "GET",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    success: function (res) {
      renderBookingList(res.result);
    },
    error: function (err) {
      console.log("Error loadMyBookings:", err);
    },
  });
}

// ===============================
// Render danh sách (LEFT COLUMN)
// ===============================
function renderBookingList(bookings) {
  // Reset từng tab
  const containers = {
    pending: $("#booking-list-pending"),
    upcoming: $("#booking-list-upcoming"),
    past: $("#booking-list-completed"),
    cancel: $("#booking-list-cancel")
  };

  // Xóa nội dung cũ
  for (let key in containers) {
    containers[key].html("");
  }

  bookings.forEach((b) => {
    const dateObj = new Date(b.bookAvailability.date);
    const day = ("0" + dateObj.getDate()).slice(-2);
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const year = dateObj.getFullYear();

    const html = `
      <div class="request-item booking-item" data-id="${b.bookingId}">
        <div class="request-header">
          <img src="${b.bookAvailability.mentorAvatar}" class="mentor-avatar" />
          <div class="mentor-info">
            <div class="mentor-name">${b.bookAvailability.fullName}</div>
            <div class="mentor-meta">
              <span>${day}-${month}-${year}</span>
              <span class="status-badge badge-${b.status.toLowerCase()}">${b.statusDisplay}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Chọn container theo status
    switch (b.status.toLowerCase()) {
      case "pending":
        containers.pending.append(html);
        break;
      case "confirmed":
        containers.upcoming.append(html);
        break;
      case "completed":
        containers.past.append(html);
        break;
      case "canceled":
      case "cancel":
        containers.cancel.append(html);
        break;
      default:
        console.warn("Unknown status:", b.status);
    }
  });
}

// ===============================
// BẮT SỰ KIỆN CLICK DYNAMIC
// ===============================
$(document).on("click", ".booking-item", function () {
  const id = $(this).data("id");
  const tabWrapper = $(this).closest(".content-wrapper");
  const rightPanel = tabWrapper.find(".right-panel");
  loadBookingDetails(id, rightPanel);
});


// ===============================
// Load chi tiết booking (RIGHT)
// ===============================
function loadBookingDetails(bookingId, panel) {
  $.ajax({
    url: `http://localhost:8080/api/v1/bookings/${bookingId}`,
    method: "GET",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    success: function (response) {
      const b = response.result;
      renderBookingDetails(b, panel);
    },
    error: function (err) {
      console.log("Error loadBookingDetails:", err);
    },
  });
}


// ===============================
// Render panel chi tiết bên phải
// ===============================
function renderBookingDetails(b, panel) {
  if (!b.bookAvailability) {
    panel.html("<p>Không có chi tiết lịch hẹn.</p>");
    return;
  }

  const d = b.bookAvailability;
  const dateObj = new Date(d.date);
  const day = ("0" + dateObj.getDate()).slice(-2);
  const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
  const year = dateObj.getFullYear();

  const status = b.status.toLowerCase();

  // Xử lý link Meet
  let meetLink = "";
  if ((status === "confirmed" || status === "upcoming") && d.linkMeet?.startsWith("http")) {
    // Sắp tới → link click được
    meetLink = `
      <div class="detail-row">
        <div class="detail-label">Link Meet:</div>
        <div class="detail-value"><a href="${d.linkMeet}" target="_blank">${d.linkMeet}</a></div>
      </div>
    `;
  } else if (status === "completed" || status === "past") {
    // Đã qua → chỉ hiển thị text
    if (d.linkMeet) {
      meetLink = `
        <div class="detail-row">
          <div class="detail-label">Link Meet:</div>
          <div class="detail-value">${d.linkMeet}</div>
        </div>
      `;
    }
  }

  const html = `
    <div class="info-box">
      ${b.statusDisplay} – từ mentor ${d.fullName}
    </div>

    <div class="verify-section">
      <div class="check-icon">✓</div>
      <img src="${d.mentorAvatar}" class="verify-avatar" />
      <span><strong>${d.fullName}</strong></span>
    </div>

    <div class="details-section">
      <div class="detail-row">
        <div class="detail-label">Chủ đề:</div>
        <div class="detail-value">${b.topic}</div>
      </div>

      <div class="detail-row">
        <div class="detail-label">Thời gian:</div>
        <div class="detail-value">${b.time}, ngày ${day}-${month}-${year}</div>
      </div>

      <div class="detail-row">
        <div class="detail-label">Thời lượng:</div>
        <div class="detail-value">1 giờ</div>
      </div>

      <div class="detail-row">
        <div class="detail-label">Hình thức kết nối:</div>
        <div class="detail-value">${b.connectionForm}</div>
      </div>

      ${meetLink}
    </div>

    <div class="note-section">
      <div class="note-label">Tin nhắn</div>
      <div class="note-content">${b.note}</div>
    </div>
  `;

  panel.html(html);
}



// ===============================
// Khi load trang → load danh sách
// ===============================
$(document).ready(function () {
  loadMyBookings();
});


