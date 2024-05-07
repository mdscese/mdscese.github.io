document.addEventListener("DOMContentLoaded", function() {
  var currentYear = new Date().getFullYear();
  document.getElementById("currentYear").innerText = currentYear;
  document.getElementById("currentYearSmall").innerText = currentYear;

  var scrollToTopBtns = document.querySelectorAll("#scrollToTopBtn");

  // Loop through each scrollToTopBtn
  scrollToTopBtns.forEach(function(scrollToTopBtn) {
      // Attach click event listener to each scrollToTopBtn
      scrollToTopBtn.addEventListener("click", function() {
          // Scroll to the top of the document
          window.scrollTo({
              top: 0,
              behavior: "smooth"
          });
      });
  });
});