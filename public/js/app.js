document.addEventListener("DOMContentLoaded", () => {
    const fileList = document.getElementById("file-list");
    const uploadForm = document.getElementById("upload-form");
    const filter = document.getElementById("filter");
  
    // Fetch files
    const fetchFiles = (category = "") => {
      fetch(`/files${category ? `?category=${category}` : ""}`)
        .then((res) => res.json())
        .then((files) => {
          fileList.innerHTML = files
            .map(
              (file) => `
            <tr>
              <td>${file.path.endsWith(".jpg") || file.path.endsWith(".png") ? `<img src="${file.path}" width="50">` : ""}</td>
              <td>${file.name}</td>
              <td>${file.category}</td>
              <td>${file.size}</td>
              <td>
                <a href="${file.path}" target="_blank" class="btn btn-sm btn-info">View</a>
                <button class="btn btn-sm btn-danger" onclick="deleteFile('${file.name}')">Delete</button>
              </td>
            </tr>`
            )
            .join("");
        });
    };
  

    uploadForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(uploadForm);
  
      fetch("/upload", { method: "POST", body: formData })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            uploadForm.reset();
            fetchFiles();
          }
        });
    });
  

    window.deleteFile = (filename) => {
      fetch(`/files/${filename}`, { method: "DELETE" })
        .then((res) => res.json())
        .then(() => fetchFiles());
    };
  

    filter.addEventListener("change", () => {
      fetchFiles(filter.value);
    });
  

    fetchFiles();
  });
  