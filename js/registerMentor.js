const daysOfWeek = ['Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7','Chủ nhật'];
const startTime = "19:00";
const endTime = "23:00";

let slotsData = {}; // Map slotKey -> slot info

// ================= FETCH SLOTS =================
function fetchScheduleSlots() {
    $.ajax({
        url: "http://localhost:8080/api/v1/schedule-slots",
        method: "GET",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        data: { startTime: startTime, endTime: endTime },
        success: function(res) {
            if(res && res.result){
                slotsData = {};
                res.result.forEach(slot => {
                    const date = slot.date;
                    const day = new Date(date).getDay() === 0 ? 6 : new Date(date).getDay()-1;
                    const slotKey = `${date}-${slot.startTime}`;
                    slotsData[slotKey] = slot;
                });
                renderCalendar();
            }
        },
        error: function(err) { console.error("Lỗi fetch schedule slots:", err); }
    });
}

// ================= RENDER CALENDAR =================
function renderCalendar() {
    const content = document.querySelector('.content');
    content.innerHTML = '';
    
    for(let day=0; day<7; day++){
        const dayColumn = document.createElement('div');
        dayColumn.className = 'day-column';
        
        const header = document.createElement('div');
        header.className = 'day-header';
        header.textContent = daysOfWeek[day];
        dayColumn.appendChild(header);

        // Hiển thị các slot
        const daySlots = Object.values(slotsData).filter(slot => {
            const slotDay = new Date(slot.date).getDay() === 0 ? 6 : new Date(slot.date).getDay()-1;
            return slotDay === day;
        }).sort((a,b)=>a.startTime.localeCompare(b.startTime));

        daySlots.forEach(slot => {
            const slotDiv = document.createElement('div');
            slotDiv.className = 'time-slot';
            slotDiv.textContent = `${slot.startTime} - ${slot.endTime}`;
            slotDiv.dataset.slotId = slot.slotId;

            // click để xóa
            slotDiv.onclick = () => deleteSlot(slot.slotId);

            dayColumn.appendChild(slotDiv);
        });

        // Click vào cột ngày để thêm slot mới
        dayColumn.onclick = (e) => {
            if(e.target.classList.contains('time-slot')) return; // tránh click vào slot hiện có
            addSlot(day);
        };

        content.appendChild(dayColumn);
    }
}

// ================= ADD SLOT =================
function addSlot(day) {
    // Tạo date từ day (Thứ 2=0,... CN=6)
    const today = new Date();
    const firstDay = new Date(today);
    firstDay.setDate(today.getDate() - today.getDay() + 1 + day);
    const dateStr = firstDay.toISOString().split('T')[0];

    $.ajax({
        url: "http://localhost:8080/api/v1/schedule-slots",
        method: "POST",
        contentType: "application/json",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        data: JSON.stringify({ startTime: startTime, endTime: endTime, date: dateStr }),
        success: function(res){
            alert(`Thêm slot thành công ngày ${dateStr} ${startTime}-${endTime}`);
            fetchScheduleSlots();
        },
        error: function(err){
            console.error("Lỗi thêm slot:", err);
            alert("Thêm slot thất bại!");
        }
    });
}

// ================= DELETE SLOT =================
function deleteSlot(slotId) {
    if(!confirm("Bạn có chắc muốn xóa slot này?")) return;

    $.ajax({
        url: `http://localhost:8080/api/v1/schedule-slots/${slotId}`,
        method: "DELETE",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        success: function(){
            fetchScheduleSlots();
        },
        error: function(err){
            console.error("Lỗi xóa slot:", err);
            alert("Xóa slot thất bại!");
        }
    });
}

// ================= INIT =================
$(document).ready(function(){
    fetchScheduleSlots();
});