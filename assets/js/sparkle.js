document.addEventListener('mousemove', function(e) {
    const sparkleContainer = document.getElementById('sparkle-container');
    
    const sparkle = document.createElement('div');
    sparkle.classList.add('sparkle');
    
    // Position the sparkle at the cursor
    sparkle.style.left = `${e.clientX}px`;
    sparkle.style.top = `${e.clientY}px`;
    
    // Append the sparkle to the container
    sparkleContainer.appendChild(sparkle);
    
    // Remove the sparkle after the animation ends
    sparkle.addEventListener('animationend', () => {
      sparkle.remove();
    });
  });
  