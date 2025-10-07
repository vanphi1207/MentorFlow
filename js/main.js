
  // Tabs chuyển đổi Hồ sơ / Đánh giá
  const tabs = document.querySelectorAll('.mentor-tab');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });



// tha cam xuc cmt  
        let liked = false;
        let likeCount = 125;
        
        function toggleLike() {
            const likeIcon = document.getElementById('likeIcon');
            const likeText = document.getElementById('likeText');
            const likesCount = document.getElementById('likesCount');
            const likeBtn = document.querySelector('.like-btn');
            
            liked = !liked;
            
            if (liked) {
                likeIcon.textContent = '❤️';
                likeText.textContent = 'Đã thích';
                likeBtn.classList.add('active');
                likeCount++;
            } else {
                likeIcon.textContent = '♡';
                likeText.textContent = 'Thích';
                likeBtn.classList.remove('active');
                likeCount--;
            }
            
            likesCount.textContent = likeCount + ' lượt thích';
        }
        
        function postComment() {
            const input = document.getElementById('commentInput');
            if (input.value.trim()) {
                alert('Đã đăng bình luận: ' + input.value);
                input.value = '';
            }
        }
        
        document.getElementById('commentInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                postComment();
            }
        });



