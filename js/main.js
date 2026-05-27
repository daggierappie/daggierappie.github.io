// =======================================================
// 1. ORIGINAL NAVIGATION LOADER (FIXED MATCHING YOUR HTML)
// =======================================================
function loadComponent(id, url) {
    const element = document.getElementById(id);
    if (!element) return; // Safely skip if the page doesn't have this placeholder

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to load ${url}`);
            return response.text();
        })
        .then(data => {
            element.innerHTML = data;
        })
        .catch(error => console.error('Error loading component:', error));
}

// =======================================================
// 2. AUTOMATIC NOVEL LIST GENERATOR
// =======================================================
function loadNovelsList() {
    const listContainer = document.getElementById('novel-list');
    if (!listContainer) return; 

    fetch('stories.txt')
        .then(res => {
            if (!res.ok) throw new Error("Add stories.txt to your main GitHub folder.");
            return res.text();
        })
        .then(text => {
            const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            listContainer.innerHTML = '';

            lines.forEach(folder => {
                const prettyTitle = folder.replace(/-/g, ' ').toUpperCase();
                listContainer.innerHTML += `
                    <div style="margin: 20px 0; padding: 15px; border: 1px solid #333; border-radius: 8px; background: #0d0d11;">
                        <h2 style="margin: 0 0 10px 0; color: #fff;">${prettyTitle}</h2>
                        <a href="novels.html?story=${folder}" style="color: #ff66b2; text-decoration: none; font-weight: bold;">Read Story →</a>
                    </div>
                `;
            });
        })
        .catch(err => {
            console.error(err);
            listContainer.innerHTML = `<p style="color: #666;">Create a 'stories.txt' file in your main folder to display works.</p>`;
        });
}

// =======================================================
// 3. AUTOMATIC CHAPTER DISCOVERY ENGINE
// =======================================================
function loadStoryChapters() {
    const params = new URLSearchParams(window.location.search);
    const story = params.get('story');
    if (!story) return;

    const listContainer = document.getElementById('novel-list');
    if (listContainer) listContainer.style.display = 'none';

    let viewer = document.getElementById('story-viewer');
    if (!viewer) {
        viewer = document.createElement('div');
        viewer.id = 'story-viewer';
        const mainContent = document.querySelector('.content') || document.body;
        mainContent.appendChild(viewer);
    }

    viewer.innerHTML = `<h1 style="color: #ff66b2;">${story.replace(/-/g, ' ').toUpperCase()}</h1><hr style="border-color: #222;"><br>`;

    let chapterIndex = 1;

    function fetchNextChapter() {
        fetch(`${story}/chapter-${chapterIndex}.md`)
            .then(res => {
                if (!res.ok) return; 
                return res.text();
            })
            .then(text => {
                if (!text) return;

                const parsedHTML = text
                    .replace(/^# (.*)$/gm, '<h2 style="color: #9933ff; margin-top:30px;">$1</h2>')
                    .replace(/\n\n/g, '</p><p style="line-height: 1.8; margin-bottom: 20px; color: #ddd;">');

                viewer.innerHTML += `
                    <div class="chapter-block" style="margin-bottom: 50px;">
                        ${parsedHTML}
                    </div>
                    <hr style="border: 0; border-top: 1px dashed #333; margin: 40px 0;">
                `;

                chapterIndex++;
                fetchNextChapter(); 
            })
            .catch(() => {});
    }

    fetchNextChapter();
}

// =======================================================
// INITIALIZE WHEN PAGE LOADS
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    // 🎯 We handle BOTH possibilities here so both index.html and novels.html work perfectly!
    loadComponent('header-placeholder', 'components/nav.html');
    loadComponent('nav-placeholder', 'components/nav.html');
    
    loadNovelsList();
    loadStoryChapters();
});
