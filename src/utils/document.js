export function scrollToTopAndLock() {
  const scrollPosition = window.scrollY;
  window.scrollTo(0, 0);
  const locker = lock();
  return () => {
    window.scrollTo(0, scrollPosition);
    locker();
  };
}

export function lock() {
  document.body.style.overflow = "hidden";
  return () => {
    document.body.style.removeProperty("overflow");
  };
}
