document.addEventListener("DOMContentLoaded", function() {
  var currentYear = new Date().getFullYear();
  document.getElementById("currentYear").innerText = currentYear;
  document.getElementById("currentYearSmall").innerText = currentYear;

    var scrollToTopBtn = document.getElementById("scrollToTopBtn");
  
    scrollToTopBtn.addEventListener("click", function() {
      // Scroll to the top of the document
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  });