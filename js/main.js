// Function to dynamically load HTML components
function loadComponent(elementId, componentPath) {
    fetch(componentPath)
        .then(response => {
            if (!response.ok) throw new Error('Failed to load component: ' + componentPath);
            return response.text();
        })
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        })
        .catch(error => console.error('Error loading component:', error));
}

// Automatically load the navigation when the website opens
document.addEventListener("DOMContentLoaded", () => {
    // Note the path: relative to index.html, it looks into components/nav.html
    loadComponent('header-placeholder', './components/nav.html');
});
