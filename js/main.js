// This script automatically fetches folders from your GitHub repository to build the novel list!
const USERNAME = 'daggierappie';
const REPO = 'daggierappie.github.io';

async function loadNovels() {
    const novelListContainer = document.getElementById('novel-list'); // Assumes your HTML has an element with this ID
    if (!novelListContainer) return;

    try {
        // Ask GitHub for everything in the main folder
        const response = await fetch(`https://api.github.com/repos/${USERNAME}/${REPO}/contents/`);
        const files = await response.json();

        // Filter out folders that aren't system files
        const ignoredFolders = ['components', 'css', 'js', '.github', 'novels'];
        const novelFolders = files.filter(file => file.type === 'dir' && !ignoredFolders.includes(file.name));

        // Clear loading text
        novelListContainer.innerHTML = '';

        if (novelFolders.length === 0) {
            novelListContainer.innerHTML = '<p>No stories found yet! Add a folder to start.</p>';
            return;
        }

        // Automatically build a link for every single story folder found
        novelFolders.forEach(folder => {
            const prettyName = folder.name.replace(/-/g, ' ').toUpperCase(); // Turn "coco-bandicoot" into "COCO BANDICOOT"
            const card = document.createElement('div');
            card.className = 'novel-card';
            card.innerHTML = `
                <h3>${prettyName}</h3>
                <a href="novels.html?story=${folder.name}">Read Story</a>
            `;
            novelListContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Error loading novels automatically:", error);
        novelListContainer.innerHTML = '<p>Error loading stories. Please try again later.</p>';
    }
}

// Run the function when the page loads
document.addEventListener('DOMContentLoaded', loadNovels);
