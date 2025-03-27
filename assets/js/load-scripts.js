const sources = [
  "/assets/data/resources.json",
  "/assets/data/manual-resources.json"
];

function createScriptCard(tool) {
  const sectionId = `${tool.section}-section`;
  const section = document.getElementById(sectionId);
  if (!section) return;

  const entry = document.createElement("div");
  entry.className = "col-12 col-md-6 col-lg-4 fade-in";

  const description = tool.description || "No description provided.";
  const developer = tool.developer ? `<p><strong>Developer:</strong> ${tool.developer}</p>` : "";
  const github = tool.github ? `<p><strong>Repo:</strong> <a href="${tool.github}" target="_blank" rel="noopener noreferrer">GitHub</a></p>` : "";
  const toolLink = tool.tool ? `<p><strong>Tool:</strong> <a href="${tool.tool}" target="_blank" rel="noopener noreferrer">Launch</a></p>` : "";
  const external = tool.external ? `<p><strong>External:</strong> <a href="${tool.external}" target="_blank" rel="noopener noreferrer">Visit Site</a></p>` : "";
  const paper = tool.paper ? `<p><strong>Paper:</strong> <a href="${tool.paper}" target="_blank" rel="noopener noreferrer">Link</a></p>` : "";

  entry.innerHTML = `
    <details class="script-entry">
      <summary>${tool.title}</summary>
      <div class="script-body">
        <p class="card-text">${description}</p>
        ${developer}
        ${github}
        ${toolLink}
        ${external}
        ${paper}
      </div>
    </details>
  `;

  section.appendChild(entry);

  setTimeout(() => {
    entry.classList.add("visible");
  }, 100);
}

function loadResources(url) {
  return fetch(url)
    .then(res => res.json())
    .then(data => data.forEach(tool => createScriptCard(tool)))
    .catch(err => console.error(`Error loading ${url}:`, err));
}

document.addEventListener("DOMContentLoaded", () => {
  Promise.all(sources.map(loadResources));
});
