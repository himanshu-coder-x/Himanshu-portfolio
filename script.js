document.getElementById("download-btn").addEventListener("click", () => {
    const url = "Himanshu_cv.pdf"; // Ensure this is the path to your PDF file
    const progressBar = document.getElementById("progress-bar");
  
    progressBar.style.display = "block"; // Show the progress bar
  
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
  
        const contentLength = response.headers.get("content-length");
        if (!contentLength) {
          throw new Error("Content-Length header is missing");
        }
  
        const total = parseInt(contentLength, 10);
        let loaded = 0;
  
        const reader = response.body.getReader();
  
        return new ReadableStream({
          start(controller) {
            function push() {
              reader.read().then(({ done, value }) => {
                if (done) {
                  controller.close();
                  return;
                }
  
                loaded += value.length;
                const progress = Math.floor((loaded / total) * 100);
                progressBar.value = progress; // Update progress bar value
  
                controller.enqueue(value);
                push();
              });
            }
  
            push();
          },
        });
      })
      .then((stream) => new Response(stream))
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "resume.pdf"; // Force the download as a PDF
        a.click();
  
        // Hide the progress bar after completion
        progressBar.style.display = "none";
      })
      .catch((err) => {
        console.error("Download failed:", err);
        progressBar.style.display = "none";
      });
  })

  