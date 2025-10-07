// xuat hien pop up dang bai viet

document.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('postPopup');
  const postBtn = document.getElementById('postBtn');
  const postText = document.getElementById('postText');
  const imageInput = document.getElementById('imageInput');
  const imagePreview = document.getElementById('imagePreview');

  window.openPopup = function() {
    popup.style.display = 'flex';
  };

  window.closePopup = function() {
    popup.style.display = 'none';
    postText.value = '';
    imagePreview.innerHTML = '';
    postBtn.disabled = true;
  };

  window.onclick = function(event) {
    if (event.target === popup) {
      closePopup();
    }
  };

  // Hiển thị ảnh xem trước
  imageInput.addEventListener('change', () => {
    imagePreview.innerHTML = ''; // reset
    const files = Array.from(imageInput.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = document.createElement('img');
        img.src = e.target.result;
        imagePreview.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
    checkPostValid();
  });

  // Kích hoạt nút đăng khi có nội dung hoặc ảnh
  postText.addEventListener('input', checkPostValid);

  function checkPostValid() {
    const hasText = postText.value.trim() !== '';
    const hasImage = imageInput.files.length > 0;
    postBtn.disabled = !(hasText || hasImage);
  }

  // Xử lý nút đăng
  postBtn.addEventListener('click', () => {
    alert(`Đăng bài: ${postText.value}\nSố ảnh: ${imageInput.files.length}`);
    closePopup();
  });
});