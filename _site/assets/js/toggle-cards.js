document.addEventListener("DOMContentLoaded", () => {
    const entries = document.querySelectorAll(".script-entry");

    entries.forEach((entry) => {
      const summary = entry.querySelector("summary");

      summary.addEventListener("click", (e) => {
        // Allow native toggle to happen
        setTimeout(() => {
          if (entry.open) {
            // Close all others
            entries.forEach((other) => {
              if (other !== entry && other.open) {
                other.open = false;
                other.classList.remove("is-open");
              }
            });
            entry.classList.add("is-open");
          } else {
            entry.classList.remove("is-open");
          }
        }, 0);
      });
    });
  });