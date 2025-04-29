import requests
from bs4 import BeautifulSoup
import json
import re
import os
import time

# Keywords to categorize repositories
KEYWORDS = ["data", "analysis", "visualizer", "tool", "pipeline"]
SECTION_MAP = {
    "data": "data",
    "analysis": "analysis",
    "visualizer": "tools",
    "tool": "tools",
    "pipeline": "analysis"
}

RESOURCE_PATH = "../assets/data/resources.json"

def load_existing_resources():
    if os.path.exists(RESOURCE_PATH):
        with open(RESOURCE_PATH, "r") as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                print("[WARNING] resources.json is corrupted — starting fresh.")
                return []
    return []

def github_repo_exists(existing, url):
    return any(entry.get("github") == url for entry in existing)

def get_full_name_from_profile(username):
    profile_url = f"https://github.com/{username}"
    print(f"[DEBUG] Fetching profile: {profile_url}")
    try:
        r = requests.get(profile_url)
        if r.status_code != 200:
            print(f"[ERROR] Failed to fetch profile for {username}")
            return username

        soup = BeautifulSoup(r.text, "html.parser")
        name_span = soup.find("span", class_="p-name vcard-fullname")
        if name_span:
            full_name = name_span.text.strip()
            if full_name:
                print(f"[INFO] Found full name for {username}: {full_name}")
                return full_name
        print(f"[DEBUG] No full name found, using username: {username}")
        return username
    except Exception as e:
        print(f"[ERROR] Exception during profile scrape for {username}: {e}")
        return username

def get_repositories(username, existing_resources):
    new_resources = []
    developer_name = get_full_name_from_profile(username)
    repo_tab_url = f"https://github.com/{username}?tab=repositories"

    print(f"[INFO] Scraping GitHub user: {username}")
    print(f"[DEBUG] Fetching repo list: {repo_tab_url}")
    r = requests.get(repo_tab_url)

    if r.status_code != 200:
        print(f"[ERROR] Failed to load repo tab for {username} — status code: {r.status_code}")
        return new_resources

    soup = BeautifulSoup(r.content, "html.parser")
    repo_list = soup.select("li[itemprop='owns']")

    if not repo_list:
        print(f"[DEBUG] No repositories found for {username}")
        return new_resources

    for i, li in enumerate(repo_list, 1):
        a_tag = li.find("a", itemprop="name codeRepository")
        if not a_tag:
            continue

        repo_name = a_tag.text.strip()
        repo_href = "https://github.com" + a_tag["href"]
        desc = li.find("p", itemprop="description")
        description = desc.text.strip() if desc else ""
        full_text = f"{repo_name} {description}".lower()

        if not any(k in full_text for k in KEYWORDS):
            continue

        if github_repo_exists(existing_resources + new_resources, repo_href):
            print(f"[SKIP] Already exists: {repo_href}")
            continue

        section = next((SECTION_MAP[k] for k in SECTION_MAP if k in full_text), "analysis")
        print(f"[MATCH] Found '{repo_name}' in section '{section}'")

        repo_data = {
            "title": repo_name,
            "description": description or "No description provided.",
            "github": repo_href,
            "external": "",
            "section": section,
            "developer": developer_name
        }

        # Try to extract paper URL from README
        readme_url = f"https://raw.githubusercontent.com/{username}/{repo_name}/main/README.md"
        print(f"[DEBUG] Fetching README: {readme_url}")
        try:
            readme_r = requests.get(readme_url)
            if readme_r.status_code == 200:
                match = re.search(r'https?://\S*(ncbi\.nlm\.nih\.gov|doi\.org)/\S+', readme_r.text)
                if match:
                    repo_data["paper"] = match.group(0)
                    print(f"[PAPER] Found paper link: {match.group(0)}")
            else:
                print(f"[DEBUG] README not found (status {readme_r.status_code})")
        except Exception as e:
            print(f"[ERROR] Error checking README: {e}")

        new_resources.append(repo_data)

    print(f"[DONE] Total matches found for {username}: {len(new_resources)}")
    return new_resources

def scrape_all_profiles(profile_list_file):
    with open(profile_list_file, "r") as f:
        usernames = json.load(f)

    existing = load_existing_resources()
    total_new = []

    for username in usernames:
        user_resources = get_repositories(username, existing)
        if user_resources:
            print(f"[INFO] Added {len(user_resources)} new from {username}")
            total_new.extend(user_resources)
        else:
            print(f"[INFO] No new resources from {username}")

    updated = existing + total_new

    with open(RESOURCE_PATH, "w") as f:
        json.dump(sorted(updated, key=lambda x: x['title'].lower()), f, indent=2)

    print(f"[DONE] Total new entries added: {len(total_new)}")
    print(f"[DONE] Total entries in resources.json: {len(updated)}")

if __name__ == "__main__":
    scrape_all_profiles("scripts/github_profiles.json")
