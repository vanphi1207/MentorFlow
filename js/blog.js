document.addEventListener("DOMContentLoaded", () => {
  // -------------------
  // POPUP TẠO BÀI VIẾT
  // -------------------
  const postPopup = document.getElementById("postPopup");
  const postBtn = document.getElementById("postBtn");
  const postText = document.getElementById("postText");
  const imageInput = document.getElementById("imageInput");
  const imagePreview = document.getElementById("imagePreview");

  window.openPopup = () => { postPopup.style.display = "flex"; };
  window.closePopup = () => {
    postPopup.style.display = "none";
    postText.value = "";
    imagePreview.innerHTML = "";
    postBtn.disabled = true;
  };
  window.onclick = (event) => { if (event.target === postPopup) closePopup(); };

  imageInput.addEventListener("change", () => {
    imagePreview.innerHTML = "";
    Array.from(imageInput.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = document.createElement("img");
        img.src = e.target.result;
        imagePreview.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
    checkPostValid();
  });

  postText.addEventListener("input", checkPostValid);

  function checkPostValid() {
    postBtn.disabled = !(postText.value.trim() || imageInput.files.length > 0);
  }

  postBtn.addEventListener("click", () => {
    alert(`Đăng bài: ${postText.value}\nSố ảnh: ${imageInput.files.length}`);
    closePopup();
  });

  // -------------------
  // POPUP XEM BÀI VIẾT
  // -------------------
  const popupOverlay = document.getElementById("popupOverlay");
  const popupContainer = document.getElementById("popupContainer");
  const closeBtn = document.getElementById("closeBtn");

  window.openArticlePopup = () => {
    popupOverlay.style.display = "flex";
    popupContainer.classList.add("show");
  };
  window.closeArticlePopup = () => {
    popupOverlay.style.display = "none";
    popupContainer.classList.remove("show");
  };
  closeBtn.addEventListener("click", closeArticlePopup);
  window.addEventListener("click", e => { if (e.target === popupOverlay) closeArticlePopup(); });

  // -------------------
  // RENDER BLOG TỪ API CÓ TOKEN
  // -------------------
  const container = document.querySelector(".container");
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("Chưa có token. Hãy login trước!");
    return;
  }

  function renderBlog(blog) {
    const author = blog.blogOfUser?.fullName || "Người dùng";
    const avatarLetter = author[0].toUpperCase();
    const content = blog.content || "";
    const img = blog.img || "";
    const timeAgo = blog.timeAgo || "Vừa xong";
    const totalLikes = blog.totalLikes ?? 0;
    const commentCount = blog.commentCount ?? 0;

    const post = document.createElement("div");
    post.classList.add("post");

    post.innerHTML = `
      <div class="post-header">
        <div class="post-header-left">
          <div class="avatar">${avatarLetter}</div>
          <div class="post-info">
            <h3>${author}</h3>
            <p class="post-time">${timeAgo}</p>
          </div>
        </div>
      </div>

      <div class="post-content">${content}</div>

      ${img ? `<div class="post-image"><img src="${img}" alt="Blog Image" /></div>` : ''}

      <div class="post-stats_1">
        <div class="reactions"><span class="reaction-count">${totalLikes}</span></div>
        <div class="comment-count">${commentCount} bình luận</div>
      </div>

      <div class="post-actions">
        <button class="action-button">👍 Thích</button>
        <button class="action-button open-comment-btn" data-blog-id="${blog.blogId}">💬 Bình luận</button>
      </div>
    `;
    container.appendChild(post);
  }

  // GỌI API GET ALL BLOG
  fetch("http://localhost:8080/api/v1/blog", {
    headers: { "Authorization": "Bearer " + token }
  })
  .then(res => res.json())
  .then(data => {
    if (data.code === 1000 && Array.isArray(data.result)) {
      data.result.forEach(blog => renderBlog(blog));
    } else {
      console.error("Lỗi dữ liệu blog:", data);
    }
  })
  .catch(err => console.error("Lỗi fetch API:", err));

  // ==============================================
  // CLICK 💬 BÌNH LUẬN -> GỌI API LẤY CHI TIẾT BLOG
  // ==============================================
  $(document).on("click", ".open-comment-btn", function () {
    const blogId = $(this).data("blog-id");

    $.ajax({
      url: `http://localhost:8080/api/v1/blog/${blogId}`,
      method: "GET",
      headers: { Authorization: "Bearer " + token },
      success: function (data) {
        if (data.code === 1000 && data.result) {
          const blog = data.result;
          renderBlogPopup(blog);
        } else {
          alert("Không thể tải bài viết.");
        }
      },
      error: function () {
        alert("Lỗi khi gọi API.");
      },
    });
  });

  // ==============================================
  // HÀM HIỂN THỊ POPUP CHI TIẾT BLOG + COMMENT
  // ==============================================
  function renderBlogPopup(blog) {
    $("#popupOverlay").css("display", "flex");

    const commentsHTML = blog.comments && blog.comments.length
      ? blog.comments
          .map(
            (c) => `
          <div class="comment-item">
            <div class="comment-avatar"></div>
            <div class="comment-content">
              <div class="comment-bubble">
                <div class="comment-author">${c.commentOfUserResponse.fullName}</div>
                <div class="comment-text">${c.content}</div>
              </div>
              <div class="comment-actions">
                <span class="comment-action" style="color:#b0b3b8">${c.timeAgo}</span>
              </div>
            </div>
          </div>`
          )
          .join("")
      : `<p>Chưa có bình luận nào.</p>`;

    $("#popupContainer").html(`
      <div class="popup-header__article">
        <h2 class="popup-title">Bài viết của ${blog.blogOfUser.fullName}</h2>
        <button class="close-btn__article" id="closeBtn">×</button>
      </div>

      <div class="post-header__article">
        <div class="user-info__article">
          <div class="user-avatar"></div>
          <div class="user-details">
            <h3>${blog.blogOfUser.fullName}</h3>
            <p>${blog.timeAgo}</p>
          </div>
        </div>
      </div>

      <div class="post-content__article"><p>${blog.content}</p></div>

      ${
        blog.img
          ? `<div class="post-image"><img src="${blog.img}" alt="Post Image"/></div>`
          : ""
      }

      <div class="post-stats">
        <div class="likes"><span>${blog.totalLikes}</span></div>
        <div class="comments-count">${blog.commentCount} bình luận</div>
      </div>

      <div class="post-actions__article">
        <button class="action-btn__article">👍 Thích</button>
        <button class="action-btn__article">💬 Bình luận</button>
      </div>

      <div class="comments-section">${commentsHTML}</div>

      <div class="comment-input-section">
        <div class="input-avatar"></div>
        <div class="comment-input-wrapper">
          <textarea class="comment-input__article" placeholder="Viết bình luận..." rows="1"></textarea>
        </div>
        <button class="send-btn">➤</button>
      </div>
    `);

    // Gắn sự kiện nút đóng popup
    $("#closeBtn").on("click", () => $("#popupOverlay").hide());
  }
});
