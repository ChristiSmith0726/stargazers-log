const repositoryList = document.querySelector("#repository-list");
const repositoryCount = document.querySelector("#repository-count");

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(`${dateString}T00:00:00`));
}

function createRepositoryCard(repository) {
  const item = document.createElement("li");
  item.className = "repository-card";

  const details = document.createElement("div");
  const link = document.createElement("a");
  link.className = "repository-link";
  link.href = repository.html_url;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = repository.name;

  const description = document.createElement("p");
  description.className = "repository-description";
  description.textContent = repository.description || "No description provided.";

  const metadata = document.createElement("p");
  metadata.className = "repository-meta";
  const language = document.createElement("span");
  language.className = "language";
  language.textContent = repository.language || "Various";

  const starredDate = document.createElement("span");
  starredDate.textContent = `Starred ${formatDate(repository.starred_at)}`;
  metadata.append(language, starredDate);
  details.append(link, description, metadata);

  const stars = document.createElement("span");
  stars.className = "star-count";
  stars.textContent = `★ ${new Intl.NumberFormat("en", { notation: "compact" }).format(repository.stargazers_count)} stars`;

  item.append(details, stars);
  return item;
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const repositories = await response.json();
    repositoryList.replaceChildren(...repositories.map(createRepositoryCard));
    repositoryCount.textContent = `${repositories.length} repositories`;
  } catch (error) {
    repositoryList.replaceChildren();
    const message = document.createElement("li");
    message.className = "status-message";
    message.textContent = "Unable to load starred repositories right now.";
    repositoryList.append(message);
    repositoryCount.textContent = "Unavailable";
    console.error(error);
  }
}

loadRepositories();
