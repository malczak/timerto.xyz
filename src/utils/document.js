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
  const { body } = document;
  if (body.style.overflow === "hidden") {
    return () => {};
  }

  body.style.overflow = "hidden";
  return () => {
    body.style.removeProperty("overflow");
  };
}
