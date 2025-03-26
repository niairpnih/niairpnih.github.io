fetch("/assets/data/manual-resources.json")
  .then(response => response.json())
  .then(resources => {
    resources.forEach((tool, index) => {
      const sectionId = `${tool.section}-section`;
      const section = document.getElementById(sectionId);
      if (!section) return;

      const card = document.createElement("div");
      card.className = "col fade-in";
      card.innerHTML = `
        <div class="card h-100 shadow-sm script-card">
          <div class="card-header collapse-toggle" data-bs-toggle="collapse" data-bs-target="#manual-${index}" aria-expanded="false" aria-controls="manual-${index}">
            <h5 class="mb-0 text-center">${tool.title}</h5>
          </div>
          <div id="manual-${index}" class="collapse">
            <div class="card-body">
              <p class="card-text">${tool.description}</p>
              ${tool.github ? `<p><strong>Repo:</strong> <a href="${tool.github}" target="_blank" rel="noopener noreferrer">GitHub</a></p>` : ""}
              ${tool.external ? `<p><strong>External:</strong> <a href="${tool.external}" target="_blank" rel="noopener noreferrer">Visit Site</a></p>` : ""}
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
