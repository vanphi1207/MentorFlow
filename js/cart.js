$(document).ready(function () {
    let cart = JSON.parse(sessionStorage.getItem("cart") || "[]");
    const token = localStorage.getItem("token");

    if (cart.length === 0) {
        $(".cart-container").html("<p>Giỏ hàng trống</p>");
        return;
    }

    cart.forEach(courseId => {
        $.ajax({
            url: `http://localhost:8080/api/v1/courses/courseDetails/${courseId}`,
            type: "GET",
            headers: { Authorization: token ? `Bearer ${token}` : "" },
            success: function(response) {
                const course = response.result;
                const itemHTML = `
                    <div class="cart-item" data-id="${courseId}">
                        <img src="${course.thumbnailImg || ''}" class="cart-img">
                        <div class="cart-info">
                            <h3 class="cart-title">${course.titleCourse}</h3>
                            <p class="cart-desc">${course.description}</p>
                            <p class="cart-price">${course.priceCourse.toLocaleString()}₫</p>
                        </div>
                        <div class="cart-actions">
                            <button class="btn btn-pay">Thanh toán</button>
                            <button class="btn btn-remove">Xóa</button>
                        </div>
                    </div>
                `;
                $(".cart-container").append(itemHTML);
            },
            error: function(xhr) { console.error("Lỗi API course:", xhr); }
        });
    });

    // Xóa course khỏi cart
    $(document).on("click", ".btn-remove", function () {
        const courseId = $(this).closest(".cart-item").data("id");
        let cart = JSON.parse(sessionStorage.getItem("cart") || "[]");
        cart = cart.filter(id => id !== courseId);
        sessionStorage.setItem("cart", JSON.stringify(cart));

        // Xóa phần tử khỏi DOM
        $(this).closest(".cart-item").remove();

        // Nếu muốn, gọi API xóa khóa học server-side (tuỳ bạn)
        /*
        $.ajax({
            url: `http://localhost:8080/api/v1/courses/${courseId}`,
            type: "DELETE",
            headers: { Authorization: token ? `Bearer ${token}` : "" },
            success: function() { console.log("Đã xóa khóa học"); },
            error: function(xhr) { console.error(xhr); }
        });
        */
    });
});
