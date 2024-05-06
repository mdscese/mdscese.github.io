document.addEventListener("DOMContentLoaded", function() {
  const imageContainers = document.querySelectorAll(".image-container");

  imageContainers.forEach(imageContainer => {
    const folderPath = imageContainer.getAttribute("data-folder");
    fetchImages(folderPath, imageContainer);
  });

  function fetchImages(folderPath, container) {
    // Log the folder path
    console.log("Folder path:", folderPath);

    // Fetch the images from the folder
    fetch(folderPath)
      .then(response => response.text())
      .then(text => {
        // Parse HTML text to extract image filenames
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(text, "text/html");
        const imageFilenames = Array.from(htmlDoc.querySelectorAll("a"))
          .map(a => a.getAttribute("href"))
          .filter(href => /\.(jpeg|jpg|gif|png)$/i.test(href));

        // Log the files found at the folder path
        console.log("Files found:", imageFilenames);

        // Append images to the container
        imageFilenames.forEach(filename => {
          const img = document.createElement("img");
          const imagePath = folderPath.endsWith("/") ? folderPath : folderPath + "/";
          console.log("imagepath", imagePath);
          console.log("filename", filename);
          img.src = filename;
          img.alt = filename;
          container.appendChild(img);
        });
      })
      .catch(error => console.error("Error fetching images:", error));
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