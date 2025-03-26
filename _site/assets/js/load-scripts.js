fetch("/assets/data/resources.json")
  .then(response => response.json())
  .then(data => {
    data.forEach((tool, index) => {
      const sectionId = `${tool.section}-section`;
      const section = document.getElementById(sectionId);
      if (!section) return;

      const safeTitle = tool.title.replace(/\s+/g, "-").replace(/[^\w-]/g, "").toLowerCase();
      const collapseId = `collapse-${safeTitle}-${index}`;

      const card = document.createElement("div");
      card.className = "col-12 col-md-6 col-lg-4 fade-in";

      card.innerHTML = `
        <div class="card shadow-sm script-card">
          <div class="card-header collapse-toggle"
              data-bs-toggle="collapse"
              data-bs-target="#${collapseId}"
              aria-expanded="false"
              aria-controls="${collapseId}">
            <h5 class="mb-0 text-center">${tool.title}</h5>
          </div>
          <div id="${collapseId}" class="collapse">
            <div class="card-body">
              <p class="card-text">${tool.description}</p>
              ${tool.developer ? `<p><strong>Developer:</strong> ${tool.developer}</p>` : ""}
              ${tool.github ? `<p><strong>Repo:</strong> <a href="${tool.github}" target="_blank" rel="noopener noreferrer">GitHub</a></p>` : ""}
              ${tool.tool ? `<p><strong>Tool:</strong> <a href="${tool.tool}" target="_blank" rel="noopener noreferrer">Launch</a></p>` : ""}
              ${tool.external ? `<p><strong>External:</strong> <a href="${tool.external}" target="_blank" rel="noopener noreferrer">Visit Site</a></p>` : ""}
              ${tool.paper ? `<p><strong>Paper:</strong> <a href="${tool.paper}" target="_blank" rel="noopener noreferrer">Link</a></p>` : ""}
            </div>
          </div>
        </div>
      `;

      section.appendChild(card);

      setTimeout(() => {
        card.classList.add("visible");
      }, index * 100);
    });
  });
