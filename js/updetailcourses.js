// Ẩn/hiện module
function toggleModule(element) {
  const module = element.parentElement;
  const lessons = module.querySelector('.lesson-list');
  const icon = element.querySelector('i.fa-chevron-down');

  if (lessons.style.display === 'block') {
    lessons.style.display = 'none';
    icon.classList.remove('fa-chevron-up');
    icon.classList.add('fa-chevron-down');
  } else {
    lessons.style.display = 'block';
    icon.classList.remove('fa-chevron-down');
    icon.classList.add('fa-chevron-up');
  }
}

// Xử lý bình luận
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("commentInput");
  const button = document.getElementById("submitComment");
  const list = document.getElementById("commentList");

  button.addEventListener("click", () => {
    const text = input.value.trim();
    if (text !== "") {
      const comment = document.createElement("div");
      comment.classList.add("comment");
      comment.innerText = text;
      list.appendChild(comment);
      input.value = "";
    }
  });
});
