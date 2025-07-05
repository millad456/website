document.addEventListener('DOMContentLoaded', function() {
  // Try both possible paths
  const pathsToTry = [
    'components/sidebar.html',  // Relative to index.html
    './components/sidebar.html' // Explicit relative
  ];

  const loadSidebar = (path) => {
    fetch(path)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.text();
      })
      .then(html => {
        document.body.insertAdjacentHTML('afterbegin', html);
        highlightActiveLink();
        console.log(`Sidebar loaded successfully from: ${path}`);
      })
      .catch(error => {
        console.error(`Failed to load from ${path}:`, error);
        // Try next path or fallback
        const nextPath = pathsToTry.indexOf(path) + 1;
        if (nextPath < pathsToTry.length) {
          loadSidebar(pathsToTry[nextPath]);
        } else {
          createFallbackSidebar();
        }
      });
  };

  const highlightActiveLink = () => {
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('#sidebar a').forEach(link => {
      const linkPath = link.getAttribute('href').split('/').pop();
      if (linkPath === currentPage || 
          (currentPage === 'index.html' && link.getAttribute('href').includes('index.html'))) {
        link.classList.add('active');
      }
    });
  };

  const createFallbackSidebar = () => {
    console.warn('Creating fallback sidebar');
    document.body.insertAdjacentHTML('afterbegin', `
      <nav id="sidebar">
        <div class="sidebar-content">
          <h3>Navigation</h3>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="index.html#experience">Experience</a></li>
            <li><a href="index.html#projects">Projects</a></li>
          </ul>
        </div>
      </nav>
    `);
  };

  // Start loading process
  loadSidebar(pathsToTry[0]);
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 20, // Adjust offset if needed
        behavior: 'smooth',
        // Speed control (non-standard but widely supported)
        duration: 400 // milliseconds (default is usually 500-1000)
      });
    }
  });
});

// Alternative using scrollIntoView with options
function smoothScroll(target) {
  target.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    // These are non-standard but work in most browsers
    inline: 'nearest',
    duration: 400, // Faster than default
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
  });
}
});