const sources = [
  "/assets/data/resources.json",
  "/assets/data/manual-resources.json"
];

function createScriptCard(tool) {
  const sectionId = `${tool.section}-section`;
  const section = document.getElementById(sectionId);
  if (!section) return;

  const entry = document.createElement("div");
  entry.className = "script-entry col-12 col-md-6 col-lg-4 fade-in";

  const description = tool.description || "No description provided.";
  const developer = tool.developer ? `<p><strong>Developer:</strong> ${tool.developer}</p>` : "";
  const github = tool.github ? `<p><strong>Repo:</strong> <a href="${tool.github}" target="_blank" rel="noopener noreferrer">GitHub</a></p>` : "";
  const toolLink = tool.tool ? `<p><strong>Tool:</strong> <a href="${tool.tool}" target="_blank" rel="noopener noreferrer">Launch</a></p>` : "";
  const external = tool.external ? `<p><strong>External:</strong> <a href="${tool.external}" target="_blank" rel="noopener noreferrer">Visit Site</a></p>` : "";
  const paper = tool.paper ? `<p><strong>Paper:</strong> <a href="${tool.paper}" target="_blank" rel="noopener noreferrer">Link</a></p>` : "";

  entry.innerHTML = `
    <div class="summary">${tool.title}</div>
    <div class="script-body">
      <p class="card-text">${description}</p>
      ${developer}
      ${github}
      ${toolLink}
      ${external}
      ${paper}
    </div>
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

function attachCardToggleBehavior() {
  const entries = document.querySelectorAll(".script-entry");

  entries.forEach((entry) => {
    const summary = entry.querySelector(".summary");

    if (summary) {
      summary.addEventListener("click", () => {
        entries.forEach((e) => {
          if (e !== entry) e.classList.remove("is-open");
        });
        entry.classList.toggle("is-open");
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  Promise.all(sources.map(loadResources)).then(() => {
    attachCardToggleBehavior(); // Run this after all cards are rendered
  });
});

