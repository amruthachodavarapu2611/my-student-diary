// script.js — plug-and-play localStorage for your Student Diary
// Works with: inputs (text/number/email/date) and textareas inside .container

(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const pageId =
      location.pathname.split("/").pop().replace(".html", "") || "home";
    const ns = (k) => `diary:${pageId}:${k}`;

    // Pick the main content area (fallback to document if not found)
    const container = document.querySelector(".container") || document;

    // All fields to store
    const fields = Array.from(
      container.querySelectorAll(
        'textarea, input[type="text"], input[type="number"], input[type="email"], input[type="date"]'
      )
    );

    // Give each field a stable key and load saved values
    fields.forEach((el, i) => {
      const key = ns(el.id || el.name || `field${i}`);
      el.dataset.storeKey = key;

      const saved = localStorage.getItem(key);
      if (saved !== null) el.value = saved;

      // Auto-save on typing / change
      el.addEventListener("input", () => {
        localStorage.setItem(key, el.value);
      });
      el.addEventListener("change", () => {
        localStorage.setItem(key, el.value);
      });
    });

    // Save button (first <button> inside container)
    const saveBtn = container.querySelector("button");
    if (saveBtn) {
      saveBtn.addEventListener("click", () => {
        // Save all visible fields
        fields.forEach((el) => {
          localStorage.setItem(el.dataset.storeKey, el.value);
        });

        // Special handling for Attendance page (collect marked dates)
        handleAttendanceList();

        toast("Saved!");
      });
    }

    // ===== Attendance helpers (safe no-op on other pages) =====
    function handleAttendanceList() {
      const dateInput = document.getElementById("attendance");
      if (!dateInput || !dateInput.value) return;

      const listKey = ns("dates"); // e.g., diary:attendance:dates
      const current = JSON.parse(localStorage.getItem(listKey) || "[]");

      if (!current.includes(dateInput.value)) current.push(dateInput.value);
      current.sort(); // keep chronological

      localStorage.setItem(listKey, JSON.stringify(current));
      renderAttendance(current);
    }

    function renderAttendance(arr = null) {
      const listEl = document.getElementById("attendanceList");
      const countEl = document.getElementById("attendanceCount");
      if (!listEl && !countEl) return; // nothing to render

      const listKey = ns("dates");
      const data = arr || JSON.parse(localStorage.getItem(listKey) || "[]");

      if (listEl) {
        listEl.innerHTML = "";
        data.forEach((d) => {
          const li = document.createElement("li");
          li.textContent = d;
          listEl.appendChild(li);
        });
      }
      if (countEl) countEl.textContent = data.length;
    }

    // If the page has attendance UI, render it on load too
    renderAttendance();

    // ===== Tiny toast =====
    function toast(msg) {
      const t = document.createElement("div");
      t.textContent = msg;
      Object.assign(t.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "10px 14px",
        background: "#4a90e2",
        color: "white",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
        fontFamily: "Arial, sans-serif",
        zIndex: 9999,
        opacity: 0,
        transition: "opacity .2s ease"
      });
      document.body.appendChild(t);
      requestAnimationFrame(() => (t.style.opacity = 1));
      setTimeout(() => {
        t.style.opacity = 0;
        setTimeout(() => t.remove(), 200);
      }, 1200);
    }
  });
})();
