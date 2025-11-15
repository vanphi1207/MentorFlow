$(document).ready(function () {
  let currentWeekOffset = 0;
  const token = localStorage.getItem("token");
  const authHeaders = token ? { Authorization: "Bearer " + token } : {};

  let slotsData = [];
  let myAvailabilities = []; // ⭐ ADD

  // =============================
  // ⭐ 1. LOAD MY AVAILABILITIES
  // =============================
  function loadMyAvailabilities() {
    $.ajax({
      url: "http://localhost:8080/api/v1/availabilities/my-availabilities",
      type: "GET",
      headers: authHeaders,
      success: function (res) {
        if (res.code === 1000) {
          myAvailabilities = res.result.map(a => ({
            slotId: a.slot.slotId,
            date: a.date,
            bookAvailabilityId: a.bookAvailabilityId
          }));
          console.log("✔ MY AVAIL:", myAvailabilities);

          highlightMyAvailabilities(); // ⭐ APPLY CSS
        }
      }
    });
  }

  // =============================
  // ⭐ 2. HIGHLIGHT LỊCH RẢNH
  // =============================
  function highlightMyAvailabilities() {
    $(".slot-item").each(function () {
      const slotId = $(this).data("slot-id");
      const dayName = $(this).data("day");

      const date = getDateForDay(dayName);

      const matched = myAvailabilities.some(
        a => a.slotId === slotId && a.date === date
      );

      if (matched) {
        $(this).addClass("booked-availability");
      }
    });
  }

  // =============================
  // 3. LOAD SLOT TỪ SERVER
  // =============================
  function loadSlots() {
    $.ajax({
      url: "http://localhost:8080/api/v1/schedule-slots",
      type: "GET",
      headers: authHeaders,
      success: function (res) {
        console.log("RAW SLOT DATA:", res.result);
        slotsData = res.result || [];
        renderSlots();
      },
      error: function () {
        console.error("Lỗi tải lịch");
      }
    });
  }

  // =============================
  // 4. RENDER SLOT
  // =============================
  function renderSlots() {
    $(".slot-list").empty();

    slotsData.forEach(slot => {
      const slotId = slot.slotId;
      const dayName = slot.dayOfWeek;
      const availabilityId = slot.availabilityId || null;
      const isAvailable = availabilityId !== null;

      const dayCol = $(`.day-column[data-day='${dayName}'] .slot-list`);
      if (dayCol.length === 0) return;

      const slotDiv = $(`  
        <div class="slot-item"
            data-slot-id="${slotId}"
            data-day="${dayName}"
            data-availability-id="${availabilityId || ""}">
          ${slot.startTime} - ${slot.endTime}
        </div>
      `);

      if (slot.isBooked) {
        slotDiv.addClass("booked");
        slotDiv.append("<span class='booked-text'>Đã đặt</span>");
        dayCol.append(slotDiv);
        return;
      }

      if (isAvailable) {
        slotDiv.addClass("selected");
      }

      // CLICK SLOT
      slotDiv.on("click", function () {
        const clickedSlotId = $(this).data("slot-id");
        const clickedDay = $(this).data("day");
        const currentAvailabilityId = $(this).data("availability-id");
        const selected = $(this).hasClass("selected");

        console.log("Clicked Slot ID:", clickedSlotId);

        if (!selected) {
          const date = getDateForDay(clickedDay);
          console.log("→ POST date:", date);

          $.ajax({
            url: "http://localhost:8080/api/v1/availabilities",
            type: "POST",
            contentType: "application/json",
            headers: authHeaders,
            data: JSON.stringify({
              slotId: clickedSlotId,
              date: date
            }),
            success: (res) => {
              const newAvailabilityId = res.result.availabilityId;

              $(this).addClass("selected");
              $(this).attr("data-availability-id", newAvailabilityId);
              slot.availabilityId = newAvailabilityId;

              // ⭐ Update myAvailabilities
              myAvailabilities.push({
                slotId: clickedSlotId,
                date: date,
                bookAvailabilityId: newAvailabilityId
              });

              highlightMyAvailabilities();
            },
            error: function (xhr) {
              alert("Không thể tạo lịch rảnh!");
              console.log(xhr.responseText);
            }
          });

          return;
        }

        if (selected && currentAvailabilityId) {
          $.ajax({
            url: `http://localhost:8080/api/v1/availabilities/${currentAvailabilityId}`,
            type: "DELETE",
            headers: authHeaders,
            success: () => {
              $(this).removeClass("selected booked-availability");
              $(this).attr("data-availability-id", "");
              slot.availabilityId = null;

              // ⭐ Remove from myAvailabilities
              myAvailabilities = myAvailabilities.filter(
                a => a.bookAvailabilityId !== currentAvailabilityId
              );
            },
            error: function () {
              alert("Không thể xóa lịch rảnh!");
            }
          });
        }
      });

      dayCol.append(slotDiv);
    });

    // ⭐ AFTER RENDER: highlight booked slots
    highlightMyAvailabilities();
  }

  // =============================
  // 5. GET DATE THEO DAY NAME
  // =============================
  const dayIndex = {
    "MONDAY": 1,
    "TUESDAY": 2,
    "WEDNESDAY": 3,
    "THURSDAY": 4,
    "FRIDAY": 5,
    "SATURDAY": 6,
    "SUNDAY": 7
  };

  function getDateForDay(dayName) {
    const today = new Date();
    const isoDow = today.getDay() === 0 ? 7 : today.getDay();

    let monday = new Date(today);
    monday.setDate(today.getDate() - (isoDow - 1) + currentWeekOffset * 7);
    monday.setHours(0, 0, 0, 0);

    let target = new Date(monday);
    target.setDate(monday.getDate() + (dayIndex[dayName] - 1));

    return target.toISOString().split("T")[0];
  }

  // =============================
  // 6. UPDATE NGÀY TRÊN UI
  // =============================
  function updateWeekDates() {
    const today = new Date();
    const isoDow = today.getDay() === 0 ? 7 : today.getDay();

    let monday = new Date(today);
    monday.setDate(today.getDate() - (isoDow - 1) + currentWeekOffset * 7);
    monday.setHours(0, 0, 0, 0);

    const formatDate = d =>
      `${String(d.getDate()).padStart(2, "0")}/${String(
        d.getMonth() + 1
      ).padStart(2, "0")}`;

    const weekStart = new Date(monday);
    const weekEnd = new Date(monday);
    weekEnd.setDate(weekStart.getDate() + 6);

    $("#currentWeek").text(`${formatDate(weekStart)} - ${formatDate(weekEnd)}`);

    const days = [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY"
    ];

    days.forEach((day, idx) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + idx);

      const dateId = idx === 6 ? "0" : idx + 1;
      $("#date-" + dateId).text(formatDate(date));
    });
  }

  // =============================
  // 7. CHUYỂN TUẦN
  // =============================
  window.changeWeek = function (offset) {
    currentWeekOffset += offset;
    updateWeekDates();
    loadSlots();
    setTimeout(loadMyAvailabilities, 200); // ⭐ RELOAD BOOKED SLOTS
  };

  // =============================
  // 8. INIT
  // =============================
  updateWeekDates();
  loadSlots();
  loadMyAvailabilities(); // ⭐ LOAD NGAY TỪ ĐẦU
});
