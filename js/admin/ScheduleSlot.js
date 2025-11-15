$(document).ready(function () {
  let selectedDay = null;
  const token = localStorage.getItem("token");
  const authHeaders = token ? { Authorization: "Bearer " + token } : {};

  // LOAD DATA
  loadSlots();

  function loadSlots() {
    $.ajax({
      url: "http://localhost:8080/api/v1/schedule-slots",
      type: "GET",
      headers: authHeaders,
      success: function (res) {
        renderSlots(res.result || []);
      },
      error: function (err) {
        console.error("Lỗi khi tải slot:", err);
      }
    });
  }

  function renderSlots(slots) {
    $(".slot-list").html("");
    slots.forEach(slot => {
      const dayCol = $(`.day-column[data-day='${slot.dayOfWeek}'] .slot-list`);
      dayCol.append(`
        <div class='slot-item' data-id='${slot.slotId}'>
          ${slot.startTime} - ${slot.endTime}
          <button class="delete-slot-btn" data-id='${slot.slotId}'>🗑</button>
        </div>
      `);
    });
  }

  // OPEN POPUP
  $(document).on("click", ".add-slot-btn", function () {
    selectedDay = $(this).closest(".day-column").data("day");
    $("#startTime").val("").focus();
    $("#endTime").val("");
    $("#popup").removeClass("hidden");
  });

  // CLOSE POPUP
  $("#closePopup").on("click", () => $("#popup").addClass("hidden"));

  // SAVE SLOT
  $("#saveSlotBtn").on("click", function (e) {
    e.preventDefault(); // phòng trường hợp trong form
    const startTime = $("#startTime").val();
    const endTime = $("#endTime").val();

    if (!startTime || !endTime) {
      alert("Vui lòng chọn thời gian!");
      return;
    }

    if (startTime >= endTime) {
      alert("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc!");
      return;
    }

    const data = { dayOfWeek: selectedDay, startTime, endTime };

    $.ajax({
      url: "http://localhost:8080/api/v1/schedule-slots",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(data),
      headers: authHeaders,
      success: function () {
        $("#popup").addClass("hidden");
        loadSlots();
      },
      error: function (err) {
        console.error("Lỗi khi tạo slot:", err);
        alert("Tạo slot thất bại!");
      }
    });
  });

  // DELETE SLOT
  $(document).on("click", ".delete-slot-btn", function () {
    const slotId = $(this).data("id");

    if (!confirm("Bạn có chắc muốn xóa slot này?")) return;

    $.ajax({
      url: `http://localhost:8080/api/v1/schedule-slots/${slotId}`,
      type: "DELETE",
      headers: authHeaders,
      success: function () {
        loadSlots();
      },
      error: function (err) {
        console.error("Lỗi khi xóa slot:", err);
        alert("Xóa slot thất bại!");
      }
    });
  });
});
