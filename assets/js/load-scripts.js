fetch("/assets/data/resources.json")
  .then(response => response.json())
  .then(data => {
    data.forEach(tool => {
      const sectionId = `${tool.section}-section`;
      const section = document.getElementById(sectionId);
      if (!section) return;

      const card = document.createElement("div");
      card.className = "col";
      card.innerHTML = `
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">${tool.title}</h5>
            <p class="card-text">${tool.description}</p>
            ${tool.github ? `<p><strong>Repo:</strong> <a href="${tool.github}" target="_blank">GitHub</a></p>` : ""}
            ${tool.tool ? `<p><strong>Tool:</strong> <a href="${tool.tool}" target="_blank">Launch</a></p>` : ""}
            ${tool.external ? `<p><strong>External:</strong> <a href="${tool.external}" target="_blank">Visit Site</a></p>` : ""}
          </div>
        </div>
      `;
      section.appendChild(card);
    });
  });
