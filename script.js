const password = "2421";

window.onload = function () {
  loadLegislation();
};

function loadLegislation() {
  const legislationList = document.getElementById("legislation-list");
  const existingLegislation = JSON.parse(sessionStorage.getItem("legislation")) || [];

  existingLegislation.forEach(item => {
    const newLegislationItem = createLegislationItemElement(item.title, item.content, item.category, item.act, item.date);
    legislationList.appendChild(newLegislationItem);
  });
}

function addLegislation() {
  const enteredPassword = prompt("Enter the password:");

  if (enteredPassword !== password) {
    alert("Incorrect password. Access denied.");
    return;
  }

  const legislationTitle = document.getElementById("titleInput").value;
  const legislationCategory = document.getElementById("categoryInput").value;
  const legislationContent = document.getElementById("contentEditor").innerHTML;
  const selectedAct = document.getElementById("actSelect").value;

  if (legislationTitle && legislationCategory && legislationContent && selectedAct) {
    const legislationList = document.getElementById("legislation-list");

    const newLegislationItem = createLegislationItemElement(legislationTitle, legislationContent, legislationCategory, selectedAct, getCurrentDate());
    legislationList.appendChild(newLegislationItem);

    saveLegislationToStorage(legislationTitle, legislationContent, legislationCategory, selectedAct);
    
    document.getElementById("titleInput").value = "";
    document.getElementById("contentEditor").innerHTML = "";
  }
}

function createLegislationItemElement(title, content, category, act, date) {
  const newLegislationItem = document.createElement("li");
  newLegislationItem.className = "legislation-item";
  newLegislationItem.innerHTML = `<strong>${title}</strong> - <em>${category}</em> - <em>${act}</em> - <em>Posted on ${date}</em>`;
  
  const contentParagraph = document.createElement("p");
  contentParagraph.innerHTML = parseMarkdown(content);
  newLegislationItem.appendChild(contentParagraph);

  const deleteButton = document.createElement("span");
  deleteButton.className = "delete-button";
  deleteButton.innerHTML = "Delete";
  deleteButton.onclick = function() {
    deleteLegislationItem(newLegislationItem, title);
  };

  newLegislationItem.appendChild(deleteButton);

  return newLegislationItem;
}

function deleteLegislationItem(itemElement, title) {
  const enteredPassword = prompt("Enter the password:");

  if (enteredPassword !== password) {
    alert("Incorrect password. Deletion denied.");
    return;
  }

  itemElement.style.animation = "fadeOut 0.5s ease-out";
  setTimeout(() => {
    itemElement.remove();
  }, 500);

  removeLegislationFromStorage(title);
}

function removeLegislationFromStorage(title) {
  const existingLegislation = JSON.parse(sessionStorage.getItem("legislation")) || [];
  const updatedLegislation = existingLegislation.filter(item => item.title !== title);
  sessionStorage.setItem("legislation", JSON.stringify(updatedLegislation));
}

function getCurrentDate() {
  const now = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return now.toLocaleDateString('en-US', options);
}

function saveLegislationToStorage(title, content, category, act) {
  const existingLegislation = JSON.parse(sessionStorage.getItem("legislation")) || [];
  existingLegislation.push({ title, content, category, act, date: getCurrentDate() });
  sessionStorage.setItem("legislation", JSON.stringify(existingLegislation));
}

function parseMarkdown(text) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}
function executeCommand(command) {
    document.execCommand(command, false, null);
  }
  
  function changeTextColor() {
    const color = prompt("Enter a color (e.g., red, #00ff00):");
    if (color !== null) {
      document.execCommand('foreColor', false, color);
    }
  }
  function handlePaste(event) {
    event.preventDefault();
  
    const pastedText = (event.clipboardData || window.clipboardData).getData('text/plain');
  
    // Insert the pasted text into the editor while maintaining formatting
    document.execCommand('insertHTML', false, pastedText);
  }
  document.getElementById("contentEditor").addEventListener("paste", function (e) {
    e.preventDefault();
  
    // Get the text content of the clipboard
    const text = (e.originalEvent || e).clipboardData.getData("text/plain");
  
    // Clean up the text and insert it into the editor
    document.execCommand("insertText", false, text);
  });
  
function filterLegislation() {
  const categoryFilter = document.getElementById("categoryFilter").value.toLowerCase();
  const actFilter = document.getElementById("actFilter").value.toLowerCase();
  const searchInput = document.getElementById("searchInput").value.toLowerCase();

  const legislationItems = document.querySelectorAll('.legislation-item');
  legislationItems.forEach(item => {
    const title = item.querySelector('strong').innerText.toLowerCase();
    const category = item.querySelector('em:nth-child(2)').innerText.toLowerCase();
    const act = item.querySelector('em:nth-child(3)').innerText.toLowerCase();

    const shouldDisplay = (category.includes(categoryFilter) || categoryFilter === '') &&
                          (act.includes(actFilter) || actFilter === '') &&
                          (title.includes(searchInput) || searchInput === '');

    item.style.display = shouldDisplay ? 'block' : 'none';
  });
}
