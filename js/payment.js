function selectPayment(element) {
  // Remove active class from all payment methods
  document.querySelectorAll(".payment-method").forEach((el) => {
    el.classList.remove("active");
  });
  // Add active class to selected method
  element.classList.add("active");

  const method = element.querySelector("input").value;

  // Show/hide appropriate sections
  document.getElementById("cardSection").style.display =
    method === "card" ? "block" : "none";
}

function completePayment() {
  const name = document.querySelector(
    'input[placeholder="Nhập họ và tên"]'
  ).value;
  const email = document.querySelector('input[placeholder="Nhập email"]').value;
  const terms = document.getElementById("terms").checked;

  if (!name || !email) {
    alert("Vui lòng điền đầy đủ thông tin cá nhân");
    return;
  }

  if (!terms) {
    alert("Vui lòng đồng ý với điều khoản dịch vụ");
    return;
  }

  // Show success message
  const successMsg = document.getElementById("successMessage");
  successMsg.classList.add("show");

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Reset after 3 seconds
  setTimeout(() => {
    successMsg.classList.remove("show");
  }, 3000);
}

function goBack() {
  window.history.back();
}
