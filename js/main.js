// =======================================================
// 1. FIXED NAVIGATION LOADER FOR ALL PAGES
// =======================================================
async function loadNavbar() {
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (!navPlaceholder) return;

    try {
        // Try to fetch from the local components folder
        const response = await fetch('components/nav.html');
        if (response.ok) {
            navPlaceholder.innerHTML = await response.text();
        } else {
            // Fallback just in case it needs a leading slash depending on the subpage
            const fallbackResponse = await fetch('/components/nav.html');
            if (fallbackResponse.ok) {
                navPlaceholder.innerHTML = await fallbackResponse.text();
            }
        }
    } catch (err) {
        console.error("Could not load navigation bar:", err);
    }
}

// =======================================================
// 2. AUTOMATICALLY LIST STORIES ON THE NOVELS PAGE
// =======================================================
async function loadNovelMenu() {
    const menuContainer = document.getElementById('novel-list');
    if (!menuContainer) return; // Safely stop if we aren't on the novels page

    try {
        const response = await fetch('stories.txt');
        if (!response.ok) return;
        
        const text = await response.text();
        const folders = text.split('\n').map(f => f.trim()).filter(f => f.length > 0);

        menuContainer.innerHTML = '';
        
        folders.forEach(folder => {
            const cleanName = folder.replace(/-/g, ' ').toUpperCase();
            menuContainer.innerHTML += `
                <div style="margin: 20px 0; padding: 15px; border: 1px solid #333; border-radius: 5px;">
                    <h2>${cleanName}</h2>
                    <a href="novels.html?story=${folder}" style="color: #ff66b2; text-decoration: none; font-weight: bold;">Read Story →</a>
                </div>
            `;
        });
    } catch (err) {
        menuContainer.innerHTML = '<p>Error loading story directory.</p>';
    }
}

// =======================================================
// 3. LOADS THE CHAPTERS WHEN A STORY IS CLICKED
// =======================================================
async function loadCurrentStory() {
    const urlParams = new URLSearchParams(window.location.search);
    const storyFolder = urlParams.get('story');
    if (!storyFolder) return; 

    const menuContainer = document.getElementById('novel-list');
    if (menuContainer) menuContainer.style.display = 'none'; 

    let storyViewer = document.getElementById('story-viewer');
    if (!storyViewer) {
        storyViewer = document.createElement('div');
        storyViewer.id = 'story-viewer';
        const contentArea = document.querySelector('.content') || document.body;
        contentArea.appendChild(storyViewer);
    }

    try {
        storyViewer.innerHTML = `<h1>${storyFolder.replace(/-/g, ' ').toUpperCase()}</h1><hr><br>`;
        
        let chapterNum = 1;
        let hasMoreChapters = true;

        while (hasMoreChapters) {
            try {
                const response = await fetch(`${storyFolder}/chapter-${chapterNum}.md`);
                if (!response.ok) {
                    hasMoreChapters = false;
                    break;
                }
                const text = await response.text();
                
                const cleanHtml = text
                    .replace(/^# (.*)$/gm, '<h2>$1</h2>')
                    .replace(/\n\n/g, '</p><p>');

                storyViewer.innerHTML += `
                    <div class="chapter-content" style="line-height: 1.6; margin-bottom: 40px;">
                        ${cleanHtml}
                    </div>
                    <hr style="border: 0; border-top: 1px dashed #333; margin: 40px 0;">
                `;
                chapterNum++;
            } catch (e) {
                hasMoreChapters = false;
            }
        }

        if (chapterNum === 1) {
            storyViewer.innerHTML += '<p>No chapters found in this folder yet. Make sure files are named chapter-1.md, chapter-2.md, etc.</p>';
        }

    } catch (err) {
        storyViewer.innerHTML = '<p>Could not load the chapters.</p>';
    }
}

// =======================================================
// RUN EVERYTHING SAFELY ON PAGE LOAD
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    loadNavbar();      // Restores headers to all pages immediately
    loadNovelMenu();   // Runs only on novels page
    loadCurrentStory(); // Runs only when viewing a story
});
