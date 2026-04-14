document.addEventListener('DOMContentLoaded', () => {
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach(alert => {
    setTimeout(() => {
      alert.style.transition = 'opacity 0.5s ease';
      alert.style.opacity = '0';
      setTimeout(() => alert.remove(), 500);
    }, 4000);
  });

 const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPath ||
        (currentPath.startsWith(link.getAttribute('href')) && link.getAttribute('href') !== '/')) {
      link.style.color = 'var(--accent)';
      link.style.background = 'var(--accent-glow)';
    }
  });
});
