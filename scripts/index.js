document.addEventListener("DOMContentLoaded", function() {
  const imageContainers = document.querySelectorAll(".image-container");

      imageContainers.forEach(imageContainer => {
        const imageUrls = getImageUrlsFromDiv(imageContainer);
        fetchImages(imageUrls, imageContainer);
      });

      function getImageUrlsFromDiv(container) {
        const folderPath = container.getAttribute("data-folder");
        return folderPath.split(" ");
      }

      function fetchImages(imageUrls, container) {
        imageUrls.forEach(imageUrl => {
          const img = document.createElement("img");
          img.src = imageUrl;
          img.alt = imageUrl;
          img.classList.add("hyperlink-image");
          container.appendChild(img);
        });
      }

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