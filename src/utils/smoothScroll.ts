export const smoothScrollTo = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
    
    // Use native smooth scrolling
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
};

export const smoothScrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};