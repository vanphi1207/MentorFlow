// Hàm đóng/mở từng module trong phần nội dung khóa học
function toggleModule(headerElement) {
    // Lấy phần tử cha .module-item của header được click
    const moduleItem = headerElement.closest('.module-item');
    
    // Kiểm tra xem module đó đang active hay không
    const isActive = moduleItem.classList.contains('active');
    
    // Đóng tất cả các module khác
    document.querySelectorAll('.module-item').forEach(item => {
        item.classList.remove('active');
    });

    // Nếu module được click chưa mở thì mở nó
    if (!isActive) {
        moduleItem.classList.add('active');
    }
}

// Sau khi DOM đã load
document.addEventListener('DOMContentLoaded', () => {
    // Có thể mở sẵn module đầu tiên nếu muốn
    const firstModule = document.querySelector('.module-item');
    if (firstModule) {
        firstModule.classList.add('active');
    }

    // Thêm hiệu ứng cuộn mượt khi mở module
    document.querySelectorAll('.module-header').forEach(header => {
        header.addEventListener('click', () => {
            setTimeout(() => {
                header.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 400);
        });
    });
});