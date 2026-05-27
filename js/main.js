const USERNAME = 'daggierappie';
const REPO = 'daggierappie.github.io';

// 1. AUTOMATICALLY LIST STORIES ON THE MAIN PAGE
async function loadNovelMenu() {
    const menuContainer = document.getElementById('novel-list');
    if (!menuContainer) return; // Skip if we aren't on the novels menu page

    try {
        const response = await fetch(`https://api.github.com/repos/${USERNAME}/${REPO}/contents/`);
        const files = await response.json();

        // Find folders, ignoring system stuff
        const ignored = ['components', 'css', 'js', '.github', 'novels'];
        const storyFolders = files.filter(f => f.type === 'dir' && !ignored.includes(f.name));

        menuContainer.innerHTML = '';
        
        storyFolders.forEach(folder => {
            const cleanName = folder.name.replace(/-/g, ' ').toUpperCase();
            menuContainer.innerHTML += `
                <div class="story-card">
                    <h2>${cleanName}</h2>
                    <a href="novels.html?story=${folder.name}">Read This Story</a>
                </div>
            `;
        });
    } catch (err) {
        menuContainer.innerHTML = '<p>Error loading stories.</p>';
    }
}

// 2. AUTOMATICALLY GRAB AND DISPLAY CHAPTERS INSIDE A STORY FOLDER
async function loadCurrentStory() {
    const urlParams = new URLSearchParams(window.location.search);
    const storyFolder = urlParams.get('story');
    
    // If there's no "?story=" in the web address, we are just looking at the main menu
    if (!storyFolder) return; 

    const menuContainer = document.getElementById('novel-list');
    if (menuContainer) menuContainer.style.display = 'none'; // Hide the main list

    // Create a place on the page to dump the chapters
    let storyViewer = document.getElementById('story-viewer');
    if (!storyViewer) {
        storyViewer = document.createElement('div');
        storyViewer.id = 'story-viewer';
        document.body.appendChild(storyViewer);
    }

    try {
        // Look INSIDE the specific story folder (e.g., /coco-bandicoot)
        const response = await fetch(`https://api.github.com/repos/${USERNAME}/${REPO}/contents/${storyFolder}`);
        const files = await response.json();

        // Get all markdown (.md) files and sort them nicely
        const chapters = files.filter(f => f.name.endsWith('.md')).sort((a, b) => a.name.localeCompare(b.name));

        storyViewer.innerHTML = `<h1>${storyFolder.replace(/-/g, ' ').toUpperCase()}</h1>`;

        // Grab the actual text content of each chapter file
        for (const file of chapters) {
            const fileData = await fetch(file.download_url);
            const text = await fileData.text();
            
            // Clean up the basic markdown formatting for the browser
            const cleanHtml = text
                .replace(/^# (.*)$/gm, '<h2>$1</h2>') // Turns "# Title" into a heading
                .replace(/\n\n/g, '</p><p>');       // Turns double spaces into paragraphs

            storyViewer.innerHTML += `
                <div class="chapter-content">
                    <p>${cleanHtml}</p>
                </div>
                <hr>
            `;
        }
    } catch (err) {
        storyViewer.innerHTML = '<p>Could not load the chapters for this story.</p>';
    }
}

// Run everything when the browser loads
document.addEventListener('DOMContentLoaded', () => {
    loadNovelMenu();
    loadCurrentStory();
});
