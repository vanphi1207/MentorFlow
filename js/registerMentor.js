let currentPage = 1;

        function updateProgress(page) {
            const progressFill = document.getElementById('progressFill');
            const progressPercent = (page / 4) * 100;
            progressFill.style.width = progressPercent + '%';

            for (let i = 1; i <= 4; i++) {
                const step = document.getElementById('step' + i);
                if (i <= page) {
                    step.classList.add('active');
                } else {
                    step.classList.remove('active');
                }
            }
        }

        function showPage(pageNum) {
            for (let i = 1; i <= 4; i++) {
                const page = document.getElementById('page' + i);
                if (i === pageNum) {
                    page.classList.add('active');
                } else {
                    page.classList.remove('active');
                }
            }
            currentPage = pageNum;
            updateProgress(pageNum);
            window.scrollTo(0, 0);
        }

        function nextPage(pageNum) {
            showPage(pageNum);
        }

        function prevPage(pageNum) {
            showPage(pageNum);
        }

        function submitForm() {
            const agreeTerms = document.getElementById('agreeTerms');
            if (!agreeTerms.checked) {
                alert('Vui lòng đồng ý với các điều khoản trước khi tiếp tục!');
                return;
            }
            alert('Đăng ký thành công! Chúng tôi sẽ xem xét hồ sơ của bạn trong thời gian sớm nhất.');
        }

        document.getElementById('photoUpload').addEventListener('change', function(e) {
            const fileName = e.target.files[0]?.name || 'No file chosen';
            document.getElementById('fileName').textContent = fileName;
        });

        updateProgress(1);