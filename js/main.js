// =======================================================
// 1. FIXED NAVIGATION LOADER FOR ALL PAGES
// =======================================================
async function loadNavbar() {
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (!navPlaceholder) return;

    try {
        const response = await fetch('components/nav.html');
        if (response.ok) {
            navPlaceholder.innerHTML = await response.text();
        } else {
            // Fallback for subpages
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
    if (!menuContainer) return; // Safely stops right here if we aren't on the novels page

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
        console.error("Error loading novel list:", err);
    }
}

// =======================================================
// 3. LOADS THE CHAPTERS WHEN A STORY IS CLICKED
// =======================================================
async function loadCurrentStory() {
    const urlParams = new URLSearchParams(window.location.search);
    const storyFolder = urlParams.get('story');
    if (!storyFolder) return; // Safely stops right here if a specific story isn't open

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
    } catch (err) {
        console.error("Error loading chapters:", err);
    }
}

// =======================================================
// RUN EVERYTHING SAFELY WITHOUT INTERRUPTING EACH OTHER
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    // Wrapping each call in a try/catch prevents one failure from killing the entire script
    try { loadNavbar(); } catch(e) { console.error(e); }
    try { loadNovelMenu(); } catch(e) { console.error(e); }
    try { loadCurrentStory(); } catch(e) { console.error(e); }
});
