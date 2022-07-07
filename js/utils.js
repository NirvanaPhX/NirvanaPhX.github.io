// This function can be used to implement smooth scroll
// @param source the element need to add the action to
// @param section the jump position element id
// @param offset
function smoothScroll(source, section, offset) {
  const coords = section.getBoundingClientRect();

  source.addEventListener("click", function (e) {
    window.scrollTo({
      left: coords.left + window.pageXOffset + offset,
      top: coords.top + window.pageYOffset + offset,
      behavior: "smooth",
    });
  });
}
