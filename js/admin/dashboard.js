document.addEventListener("DOMContentLoaded", () => {
      const menuItems = document.querySelectorAll(".menu-item[data-section], .submenu-item");
      const sections = document.querySelectorAll(".content");

      menuItems.forEach(item => {
        item.addEventListener("click", () => {
          const target = item.getAttribute("data-section");
          if (!target) return;

          sections.forEach(sec => sec.classList.add("hidden"));
          document.getElementById(target)?.classList.remove("hidden");

          menuItems.forEach(i => i.classList.remove("active"));
          item.classList.add("active");
        });
      });

      // Toggle submenu
      document.querySelectorAll(".has-submenu .menu-title").forEach(title => {
        title.addEventListener("click", (e) => {
          e.stopPropagation();
          const parent = title.closest('.has-submenu');
          const submenu = title.nextElementSibling;
          
          parent.classList.toggle('open');
          submenu.classList.toggle("show");
        });
      });

      // Initialize DataTables
      const tables = document.querySelectorAll("table");
      tables.forEach(table => {
        $(table).DataTable({
          paging: true,
          searching: true,
          ordering: true,
          language: {
            url: "https://cdn.datatables.net/plug-ins/2.0.8/i18n/vi.json",
          },
        });
      });

      // Action buttons
      document.querySelectorAll(".btn-add").forEach(btn => {
        btn.addEventListener("click", () => alert("Thêm khóa học mới"));
      });

      document.querySelectorAll(".btn-edit").forEach(btn => {
        btn.addEventListener("click", () => alert("Chỉnh sửa khóa học"));
      });

      document.querySelectorAll(".btn-delete").forEach(btn => {
        btn.addEventListener("click", () => {
          if (confirm("Bạn có chắc muốn xóa khóa học này?")) {
            btn.closest("tr").remove();
          }
        });
      });
    });