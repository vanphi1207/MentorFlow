const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', 
    '13:00', '14:00', '15:00', '16:00', 
    '17:00', '18:00', '19:00', '20:00'
];

const daysOfWeek = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

let currentWeekOffset = 0;
let schedule = {};
let bookedSlots = {};
let selectedSlot = null;
let selectedOption = null;

function initSchedule() {
    // Setup 2 lịch mẫu
    // Lịch 1: Thứ 3, 10:00 - Chưa có người đặt (lịch trống)
    const slot1Key = `0-1-10:00`;
    schedule[slot1Key] = {
        day: 1,
        time: '10:00',
        type: 'once',
        weekOffset: 0
    };

    // Lịch 2: Thứ 5, 14:00 - Đã có người đặt
    const slot2Key = `0-3-14:00`;
    schedule[slot2Key] = {
        day: 3,
        time: '14:00',
        type: 'recurring',
        weekOffset: 0
    };
    
    // Đánh dấu lịch 2 đã được đặt
    bookedSlots[slot2Key] = {
        userName: 'Nguyễn Văn A',
        userEmail: 'nguyenvana@email.com',
        bookedAt: new Date().toISOString()
    };

    generateScheduleGrid();
    updateWeekDates();
}

function generateScheduleGrid() {
    const scheduleBody = document.getElementById('scheduleBody');
    scheduleBody.innerHTML = '';

    timeSlots.forEach(time => {
        const row = document.createElement('div');
        row.className = 'time-slot-row';

        const timeLabel = document.createElement('div');
        timeLabel.className = 'time-label';
        timeLabel.textContent = time;
        row.appendChild(timeLabel);

        for (let day = 0; day < 7; day++) {
            const slot = document.createElement('div');
            slot.className = 'time-slot';
            slot.dataset.day = day;
            slot.dataset.time = time;
            slot.onclick = () => openModal(day, time);
            row.appendChild(slot);
        }

        scheduleBody.appendChild(row);
    });
}

function updateWeekDates() {
    const today = new Date();
    const firstDay = new Date(today);
    firstDay.setDate(today.getDate() - today.getDay() + 1 + (currentWeekOffset * 7));

    const weekStart = new Date(firstDay);
    const weekEnd = new Date(firstDay);
    weekEnd.setDate(weekStart.getDate() + 6);

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}/${month}`;
    };

    document.getElementById('currentWeek').textContent = 
        `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;

    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(firstDay);
        currentDate.setDate(firstDay.getDate() + i);
        const dateElement = document.getElementById(`date-${i === 6 ? 0 : i + 1}`);
        if (dateElement) {
            dateElement.textContent = formatDate(currentDate);
        }
    }

    updateScheduleDisplay();
}

function changeWeek(offset) {
    currentWeekOffset += offset;
    updateWeekDates();
}

function openModal(day, time) {
    const slotKey = `${currentWeekOffset}-${day}-${time}`;
    
    // Nếu lịch đã được đặt, không cho phép thao tác
    if (bookedSlots[slotKey]) {
        alert('⚠️ Lịch này đã có người đặt, không thể chỉnh sửa!');
        return;
    }
    
    // Nếu đã có lịch, xóa lịch đó
    if (schedule[slotKey]) {
        if (confirm('Bạn có muốn xóa lịch rảnh này?')) {
            delete schedule[slotKey];
            updateScheduleDisplay();
        }
        return;
    }

    selectedSlot = { day, time, slotKey };
    selectedOption = null;
    
    const dayName = day === 6 ? 'Chủ nhật' : daysOfWeek[day];
    document.getElementById('modalTimeInfo').textContent = 
        `${dayName}, ${time} - ${getEndTime(time)}`;
    
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.getElementById('confirmBtn').disabled = true;
    
    document.getElementById('scheduleModal').classList.add('active');
}

function closeModal() {
    document.getElementById('scheduleModal').classList.remove('active');
    selectedSlot = null;
    selectedOption = null;
}

function selectOption(type) {
    selectedOption = type;
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-type="${type}"]`).classList.add('selected');
    document.getElementById('confirmBtn').disabled = false;
}

function confirmSelection() {
    if (!selectedSlot || !selectedOption) return;

    schedule[selectedSlot.slotKey] = {
        day: selectedSlot.day,
        time: selectedSlot.time,
        type: selectedOption,
        weekOffset: currentWeekOffset
    };

    updateScheduleDisplay();
    closeModal();
}

function updateScheduleDisplay() {
    document.querySelectorAll('.time-slot:not(.time-label)').forEach(slot => {
        slot.classList.remove('selected', 'recurring', 'booked');
        slot.innerHTML = '';
    });

    Object.entries(schedule).forEach(([key, data]) => {
        if (data.weekOffset === currentWeekOffset) {
            const slot = document.querySelector(
                `[data-day="${data.day}"][data-time="${data.time}"]`
            );
            if (slot) {
                // Kiểm tra xem lịch này đã được đặt chưa
                if (bookedSlots[key]) {
                    slot.classList.add('booked');
                    const bookingInfo = document.createElement('div');
                    bookingInfo.className = 'booking-info';
                    bookingInfo.innerHTML = `
                        <div class="booking-user">${bookedSlots[key].userName}</div>
                        <div class="booking-status">Đã đặt lịch</div>
                    `;
                    slot.appendChild(bookingInfo);
                } else {
                    // Lịch trống - chỉ hiển thị checkmark
                    slot.classList.add(data.type === 'once' ? 'selected' : 'recurring');
                }
            }
        }
    });
}

function getEndTime(startTime) {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = String(hours + 1).padStart(2, '0');
    return `${endHours}:${minutes.toString().padStart(2, '0')}`;
}

function clearAllSchedule() {
    const hasBookedSlots = Object.keys(schedule).some(key => bookedSlots[key]);
    
    if (hasBookedSlots) {
        alert('⚠️ Không thể xóa tất cả vì có một số lịch đã được đặt!');
        return;
    }
    
    if (confirm('Bạn có chắc chắn muốn xóa tất cả lịch rảnh?')) {
        // Chỉ xóa các lịch chưa được đặt
        Object.keys(schedule).forEach(key => {
            if (!bookedSlots[key]) {
                delete schedule[key];
            }
        });
        updateScheduleDisplay();
    }
}

function saveSchedule() {
    const scheduleCount = Object.keys(schedule).length;
    if (scheduleCount === 0) {
        alert('Vui lòng chọn ít nhất một khung giờ rảnh!');
        return;
    }

    const oneTimeSlots = Object.values(schedule).filter(s => s.type === 'once').length;
    const recurringSlots = Object.values(schedule).filter(s => s.type === 'recurring').length;
    const bookedCount = Object.keys(bookedSlots).length;

    alert(`✅ Đã lưu lịch rảnh thành công!\n\n` +
          `📅 Lịch một lần: ${oneTimeSlots} khung giờ\n` +
          `🔄 Lịch lặp lại: ${recurringSlots} khung giờ\n` +
          `👥 Đã có người đặt: ${bookedCount} khung giờ\n` +
          `📊 Tổng: ${scheduleCount} khung giờ`);
    
    console.log('Schedule saved:', schedule);
    console.log('Booked slots:', bookedSlots);
}

// Khởi tạo khi trang load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSchedule);
} else {
    initSchedule();
}