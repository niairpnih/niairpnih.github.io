import requests
from bs4 import BeautifulSoup
import json
import re
import time

KEYWORDS = ["data", "analysis", "visualizer", "tool", "pipeline"]
SECTION_MAP = {
    "data": "data",
    "analysis": "analysis",
    "visualizer": "tools",
    "tool": "tools",
    "pipeline": "analysis"
}

def get_repositories(user_url):
    repos = []
    username = user_url.strip("/").split("/")[-1]
    page = 1
    while True:
        url = f"https://github.com/{username}?page={page}&tab=repositories"
        r = requests.get(url)
        soup = BeautifulSoup(r.content, "html.parser")
        repo_list = soup.select("li[itemprop='owns']")

        if not repo_list:
            break  # No more repos

        for li in repo_list:
            a_tag = li.find("a", itemprop="name codeRepository")
            if not a_tag:
                continue
            repo_name = a_tag.text.strip()
            repo_href = "https://github.com" + a_tag["href"]
            desc = li.find("p", itemprop="description")
            description = desc.text.strip() if desc else ""

            full_text = f"{repo_name} {description}".lower()
            if any(keyword in full_text for keyword in KEYWORDS):
                section = next((SECTION_MAP[k] for k in SECTION_MAP if k in full_text), "analysis")
                repo_data = {
                    "title": repo_name,
                    "description": description or "No description provided.",
                    "github": repo_href,
                    "external": "",
                    "section": section
                }

                # Look inside README for publication links (simplified)
                readme_url = f"https://raw.githubusercontent.com/{username}/{repo_name}/main/README.md"
                readme_r = requests.get(readme_url)
                if readme_r.status_code == 200:
                    match = re.search(r'https?://\S*(ncbi\.nlm\.nih\.gov|doi\.org)/\S+', readme_r.text)
                    if match:
                        repo_data["paper"] = match.group(0)

                repos.append(repo_data)

        page += 1
        time.sleep(1)  # Be nice to GitHub

    return repos

def scrape_all_profiles(input_json, output_json="assets/data/resources.json"):
    with open(input_json, "r") as f:
        profiles = json.load(f)

    all_resources = []
    for profile_url in profiles:
        print(f"Scraping {profile_url}")
        all_resources.extend(get_repositories(profile_url))

    with open(output_json, "w") as f:
        json.dump(all_resources, f, indent=2)

    print(f"Saved {len(all_resources)} entries to {output_json}")

if __name__ == "__main__":
    scrape_all_profiles("assets/data/github_profiles.json")
