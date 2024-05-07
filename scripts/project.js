document.addEventListener("DOMContentLoaded", function() {
    var currentYear = new Date().getFullYear();
    document.getElementById("currentYear").innerText = currentYear;
    document.getElementById("currentYearSmall").innerText = currentYear;

    var rolodeck = document.getElementById('rolodeck');
    var nextButton = document.getElementById('nextButton');

    // Check if data-count is greater than 1
    if (parseInt(rolodeck.getAttribute('data-count')) > 1) {
      nextButton.style.display = 'block'; // Show the next button
    }

    nextButton.addEventListener('click', function() {
        var folder = rolodeck.getAttribute('data-folder');
        var count = parseInt(rolodeck.getAttribute('data-count'));
        var currentIndex = parseInt(rolodeck.src.match(/image(\d+)/)[1]);
        var nextIndex = (currentIndex % count) + 1;
  
        // Update the src attribute with the next image
        rolodeck.src = folder + 'image' + nextIndex + '.png';
    });
  
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