const docList = document.getElementById("document-list");
const fileInput = document.getElementById("file-input");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const sortSelect = document.getElementById("sort-select");
const previewModal = document.getElementById("preview-modal");
const previewContent = document.getElementById("preview-content");
const editModal = document.getElementById("edit-modal");
const editNameInput = document.getElementById("edit-name-input");
const editSizeInput = document.getElementById("edit-size-input");
const editSaveBtn = document.getElementById("edit-save-btn");

let documents = [];

function displayDocuments(docs) {
  docList.innerHTML = "";
  docs.forEach((doc) => {
    const docItem = document.createElement("li");
    const docLink = document.createElement("a");
    docLink.href = "#";
    docLink.textContent = doc.name;
    docLink.addEventListener("click", (event) => {
      event.preventDefault();
      showPreview(doc);
    });
    docItem.appendChild(docLink);
    const docSize = document.createElement("span");
    docSize.classList.add("doc-size");
    docSize.textContent = `${formatBytes(doc.size)}`;
    docItem.appendChild(docSize);
    const docEditLink = document.createElement("a");
    docEditLink.href = "#";
    docEditLink.textContent = "Edit";
    docEditLink.addEventListener("click", (event) => {
      event.preventDefault();
      showEditModal(doc);
    });
    docItem.appendChild(docEditLink);
    docList.appendChild(docItem);
  });
}

function showPreview(doc) {
  previewContent.innerHTML = (
    <>
      {" "}
      <h2>${doc.name}</h2> <p>${formatBytes(doc.size)}</p>
    </>
  );
  previewModal.style.display = "block";
}

function showEditModal(doc) {
  editNameInput.value = doc.name;
  editSizeInput.value = doc.size;
  editModal.style.display = "block";
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

function uploadFile(file) {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const doc = {
      name: file.name,
      size: file.size,
      content: reader.result,
    };
    documents.push(doc);
    displayDocuments(documents);
  });
  reader.readAsText(file);
}

fileInput.addEventListener("change", () => {
  const files = fileInput.files;
  for (let i = 0; i < files.length; i++) {
    uploadFile(files[i]);
  }
  fileInput.value = "";
});

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim().toLowerCase();
  const searchResults = documents.filter((doc) =>
    doc.name.toLowerCase().includes(query)
  );
  displayDocuments(searchResults);
});

sortSelect.addEventListener("change", () => {
  const sortBy = sortSelect.value;
  let sortedDocuments;
  if (sortBy === "name") {
    sortedDocuments = documents.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "size") {
    sortedDocuments = documents.sort((a, b) => a.size - b.size);
  }
  displayDocuments(sortedDocuments);
});

previewModal.addEventListener("click", (event) => {
  if (event.target === previewModal) {
    previewModal.style.display = "none";
  }
});

editModal.addEventListener("click", (event) => {
  if (event.target === editModal) {
    editModal.style.display = "none";
  }
});

editSaveBtn.addEventListener("click", () => {
  const newName = editNameInput.value.trim();
  const newSize = parseInt(editSizeInput.value.trim());
  if (newName !== "" && newSize > 0) {
    const docIndex = documents.findIndex(
      (doc) => doc.name === editNameInput.defaultValue
    );
    documents[docIndex].name = newName;
    documents[docIndex].size = newSize;
    editModal.style.display = "none";
    displayDocuments(documents);
  }
});

displayDocuments(documents);
