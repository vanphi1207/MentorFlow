    // Initialize Lucide icons
    lucide.createIcons();

    // State
    let modules = [];
    let currentModuleLessons = [];
    let editingModuleIndex = null;

    // File uploads
    document.getElementById('videoUpload').addEventListener('change', (e) => {
      if (e.target.files[0]) {
        document.getElementById('videoStatus').innerHTML = '<span style="color: #10b981; font-weight: 600;">✓ Video đã được tải lên</span>';
      }
    });

    document.getElementById('thumbnailUpload').addEventListener('change', (e) => {
      if (e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const preview = document.getElementById('thumbnailPreview');
          preview.innerHTML = `
            <img src="${event.target.result}" style="width: 100%; height: 8rem; object-fit: cover; border-radius: 0.5rem; margin-bottom: 0.5rem;">
            <p style="font-size: 0.875rem; color: #10b981; font-weight: 600;">✓ Hình ảnh đã được tải lên</p>
          `;
          document.getElementById('previewThumbnail').src = event.target.result;
          document.getElementById('previewThumbnail').style.display = 'block';
        };
        reader.readAsDataURL(e.target.files[0]);
      }
    });

    // Module Modal
    function openModuleModal() {
      document.getElementById('moduleModal').classList.add('active');
      lucide.createIcons();
    }

    function closeModuleModal() {
      document.getElementById('moduleModal').classList.remove('active');
      document.getElementById('moduleTitle').value = '';
      document.getElementById('moduleDescription').value = '';
      document.getElementById('moduleDuration').value = '';
      currentModuleLessons = [];
      editingModuleIndex = null;
      renderLessonList();
      document.getElementById('moduleModalTitle').textContent = 'Thêm Module Mới';
      document.getElementById('moduleSubmitText').textContent = 'Thêm Module';
    }

    // Lesson Modal
    function openLessonModal() {
      document.getElementById('lessonModal').classList.add('active');
      lucide.createIcons();
    }

    function closeLessonModal() {
      document.getElementById('lessonModal').classList.remove('active');
      document.getElementById('lessonTitle').value = '';
      document.getElementById('lessonDuration').value = '';
      document.getElementById('lessonType').value = 'video';
    }

    function addLesson() {
      const title = document.getElementById('lessonTitle').value;
      const duration = document.getElementById('lessonDuration').value;
      const type = document.getElementById('lessonType').value;

      if (!title || !duration) {
        alert('Vui lòng điền đầy đủ thông tin bài học');
        return;
      }

      currentModuleLessons.push({
        id: Date.now(),
        title,
        duration,
        type
      });

      renderLessonList();
      closeLessonModal();
    }

    function removeLesson(id) {
      currentModuleLessons = currentModuleLessons.filter(l => l.id !== id);
      renderLessonList();
    }

    function renderLessonList() {
      const container = document.getElementById('lessonList');
      
      if (currentModuleLessons.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 1rem; font-size: 0.875rem; color: #6b7280;">Chưa có bài học nào</p>';
        return;
      }

      container.innerHTML = currentModuleLessons.map(lesson => `
        <div class="lesson-form-item">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i data-lucide="video" width="16" height="16" style="color: #9ca3af;"></i>
            <span style="font-size: 0.875rem;">${lesson.title}</span>
            <span style="font-size: 0.75rem; color: #6b7280;">(${lesson.duration})</span>
          </div>
          <button onclick="removeLesson(${lesson.id})" style="background: transparent; border: none; color: #dc2626; cursor: pointer; padding: 0.25rem;">
            <i data-lucide="trash-2" width="16" height="16"></i>
          </button>
        </div>
      `).join('');
      
      lucide.createIcons();
    }

    function addModule() {
      const title = document.getElementById('moduleTitle').value;
      const description = document.getElementById('moduleDescription').value;
      const duration = document.getElementById('moduleDuration').value;

      if (!title || !duration) {
        alert('Vui lòng điền đầy đủ thông tin module');
        return;
      }

      const moduleData = {
        id: Date.now(),
        title,
        description,
        duration,
        lessons: [...currentModuleLessons]
      };

      if (editingModuleIndex !== null) {
        modules[editingModuleIndex] = moduleData;
      } else {
        modules.push(moduleData);
      }

      renderModuleList();
      closeModuleModal();
      updatePreview();
    }

    function editModule(index) {
      const module = modules[index];
      document.getElementById('moduleTitle').value = module.title;
      document.getElementById('moduleDescription').value = module.description;
      document.getElementById('moduleDuration').value = module.duration;
      currentModuleLessons = [...module.lessons];
      editingModuleIndex = index;
      
      document.getElementById('moduleModalTitle').textContent = 'Chỉnh Sửa Module';
      document.getElementById('moduleSubmitText').textContent = 'Cập Nhật Module';
      
      renderLessonList();
      openModuleModal();
    }

    function removeModule(index) {
      if (confirm('Bạn có chắc chắn muốn xóa module này?')) {
        modules.splice(index, 1);
        renderModuleList();
        updatePreview();
      }
    }

    function toggleModule(index) {
      const content = document.getElementById(`module-content-${index}`);
      const icon = document.getElementById(`module-icon-${index}`);
      
      if (content.classList.contains('active')) {
        content.classList.remove('active');
        icon.setAttribute('data-lucide', 'chevron-down');
      } else {
        content.classList.add('active');
        icon.setAttribute('data-lucide', 'chevron-up');
      }
      lucide.createIcons();
    }

    function renderModuleList() {
      const container = document.getElementById('moduleList');
      
      if (modules.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <i data-lucide="video" width="48" height="48" style="color: #d1d5db; margin: 0 auto 0.75rem;"></i>
            <p>Chưa có module nào. Nhấn "Thêm Module" để bắt đầu.</p>
          </div>
        `;
        lucide.createIcons();
        return;
      }

      container.innerHTML = modules.map((module, index) => `
        <div class="module-item">
          <div class="module-header" onclick="toggleModule(${index})">
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-weight: 600;">Module ${index + 1}:</span>
                <span>${module.title}</span>
              </div>
              <div style="font-size: 0.875rem; color: #6b7280; margin-top: 0.25rem;">
                ${module.lessons.length} bài học • ${module.duration}
              </div>
            </div>
            <div class="module-actions">
              <button class="btn-edit" onclick="event.stopPropagation(); editModule(${index})">Sửa</button>
              <button class="btn-delete" onclick="event.stopPropagation(); removeModule(${index})">Xóa</button>
              <i id="module-icon-${index}" data-lucide="chevron-down" width="20" height="20" style="color: #9ca3af;"></i>
            </div>
          </div>
          <div id="module-content-${index}" class="module-content">
            ${module.lessons.map(lesson => `
              <div class="lesson-item">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <i data-lucide="video" width="16" height="16" style="color: #9ca3af;"></i>
                  <span style="color: #374151;">${lesson.title}</span>
                  <span style="font-size: 0.875rem; color: #6b7280;">(${lesson.duration})</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('');
      
      lucide.createIcons();
    }

    function updatePreview() {
      const totalLessons = modules.reduce((sum, module) => sum + module.lessons.length, 0);
      document.getElementById('previewLessons').textContent = totalLessons;
    }

    function saveCourse() {
      const courseData = {
        title: document.getElementById('courseTitle').value,
        description: document.getElementById('courseDescription').value,
        price: document.getElementById('coursePrice').value,
        duration: document.getElementById('courseDuration').value,
        level: document.getElementById('courseLevel').value,
        modules: modules,
        totalLessons: modules.reduce((sum, m) => sum + m.lessons.length, 0),
        createdAt: new Date().toISOString()
      };

      if (!courseData.title || !courseData.price || modules.length === 0) {
        alert('Vui lòng điền đầy đủ thông tin khóa học và thêm ít nhất 1 module');
        return;
      }

      console.log('Course Data:', courseData);
      alert('Khóa học đã được lưu thành công! (Xem console để xem dữ liệu)');
    }

    // Initialize
    lucide.createIcons();
