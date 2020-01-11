export function scrollToTopAndLock() {
  const scrollPosition = window.scrollY;

  window.scrollTo(0, 0);

  document.body.style.overflow = "hidden";

  return () => {
    window.scrollTo(0, scrollPosition);
    document.body.style.removeProperty("overflow");
  };
}
