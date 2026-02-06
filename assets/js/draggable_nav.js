document.addEventListener('turbo:load', function() {
  const navWindow = document.getElementById('site-nav-windows-xp');
  const showNavHelp = document.getElementById('show-nav-help');
  if (!navWindow || !showNavHelp) return;
  
  const titleBar = navWindow.querySelector('.title-bar');
  let isDragging = false;
  let offsetX, offsetY;

  // Restore position from localStorage
  const savedPosition = JSON.parse(localStorage.getItem('navWindowPosition'));
  if (savedPosition) {
    navWindow.style.left = savedPosition.left;
    navWindow.style.top = savedPosition.top;
  }

  function checkNavVisibility() {
    const rect = navWindow.getBoundingClientRect();
    const isVisible = (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
    showNavHelp.style.display = isVisible ? 'none' : 'block';
  }

  titleBar.addEventListener('mousedown', function(e) {
    isDragging = true;
    offsetX = e.clientX - navWindow.getBoundingClientRect().left;
    offsetY = e.clientY - navWindow.getBoundingClientRect().top;
    navWindow.style.zIndex = 1000; // Bring to front
  });

  document.addEventListener('mousemove', function(e) {
    if (isDragging) {
      const left = `${e.clientX - offsetX}px`;
      const top = `${e.clientY - offsetY}px`;
      navWindow.style.left = left;
      navWindow.style.top = top;
      // Save position to localStorage
      localStorage.setItem('navWindowPosition', JSON.stringify({ left, top }));
      checkNavVisibility();
    }
  });

  document.addEventListener('mouseup', function() {
    isDragging = false;
  });

  window.addEventListener('resize', checkNavVisibility);

  // Initial check
  checkNavVisibility();
});
