// Upgraded function to dynamically load HTML components from the absolute root
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
    // Adding a leading slash (/) tells the browser to look from the root domain down
    loadComponent('header-placeholder', '/components/nav.html');
});
