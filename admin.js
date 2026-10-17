

const imageSlots = [
  { id: 'logo', title: 'Organisation logo', file: 'logo.svg', hint: 'Header and footer branding. A transparent PNG or SVG works best.', size: 'Transparent logo' },
  { id: 'hero', title: 'Homepage hero', file: 'hero.jpg', hint: 'The large performance image behind the main headline.', size: 'Wide landscape · 1920 × 1000+' },
  { id: 'band', title: 'Band programme', file: 'band.jpg', hint: 'Photo displayed on the Band programme card.', size: 'Landscape photo' },
  { id: 'acrobatics', title: 'Acrobatics programme', file: 'acrobatics.jpg', hint: 'Photo displayed on the Acrobatics programme card.', size: 'Landscape photo' },
  { id: 'dance', title: 'Dance programme', file: 'dance.jpg', hint: 'Photo displayed on the Dance programme card.', size: 'Landscape photo' },
  { id: 'scouting', title: 'Scouting programme', file: 'scouting.jpg', hint: 'Photo displayed on the Scouting programme card.', size: 'Landscape photo' },
  { id: 'our-story', title: 'Our story / About', file: 'our-story.jpg', hint: 'Wide team or community photo for the story section.', size: 'Wide landscape photo' },
  { id: 'gallery-band', title: 'Gallery — Band', file: 'gallery-band.jpg', hint: 'A photo in the homepage gallery strip.', size: 'Landscape photo' },
  { id: 'gallery-dance', title: 'Gallery — Dance', file: 'gallery-dance.jpg', hint: 'A photo in the homepage gallery strip.', size: 'Landscape photo' },
  { id: 'gallery-acrobatics', title: 'Gallery — Acrobatics', file: 'gallery-acrobatics.jpg', hint: 'A photo in the homepage gallery strip.', size: 'Landscape photo' },
  { id: 'gallery-scouts', title: 'Gallery — Scouts', file: 'gallery-scouts.jpg', hint: 'A photo in the homepage gallery strip.', size: 'Landscape photo' },
  { id: 'gallery-community', title: 'Gallery — Community', file: 'gallery-community.jpg', hint: 'A photo in the homepage gallery strip.', size: 'Landscape photo' },
  { id: 'donation-hands', title: 'Donation banner', file: 'donation-hands.jpg', hint: 'Background image behind the Support Our Mission banner.', size: 'Wide landscape photo' }
];

const storagePrefix = 'aeou-admin-image:';
const grid = document.getElementById('image-grid');
const template = document.getElementById('image-card-template');
const search = document.getElementById('search');

function getSavedImage(id) {
  try {
    return localStorage.getItem(storagePrefix + id);
  } catch (error) {
    return null;
  }
}

function saveImage(id, dataUrl) {
  try {
    localStorage.setItem(storagePrefix + id, dataUrl);
    return true;
  } catch (error) {
    alert('This image could not be saved in browser storage. Try a smaller image file.');
    return false;
  }
}

function updateCounts() {
  let count = 0;
  imageSlots.forEach((slot) => {
    if (getSavedImage(slot.id)) count += 1;
  });
  document.getElementById('slot-count').textContent = imageSlots.length;
  document.getElementById('selected-count').textContent = count;
}

function renderCards(filter = '') {
  if (!grid || !template) return;
  grid.innerHTML = '';

  const matchingSlots = imageSlots.filter((slot) =>
    `${slot.title} ${slot.file} ${slot.hint}`.toLowerCase().includes(filter.toLowerCase())
  );

  if (!matchingSlots.length) {
    grid.innerHTML = '<div class="no-results">No image areas match your search.</div>';
    return;
  }

  matchingSlots.forEach((slot) => {
    const fragment = template.content.cloneNode(true);
    const card = fragment.querySelector('.image-card');
    const preview = fragment.querySelector('.preview');
    const img = fragment.querySelector('img');
    const title = fragment.querySelector('h3');
    const filename = fragment.querySelector('.filename');
    const status = fragment.querySelector('.slot-status');
    const hint = fragment.querySelector('.hint');
    const input = fragment.querySelector('.file-input');
    const upload = fragment.querySelector('.upload-button');
    const remove = fragment.querySelector('.remove-button');
    const saved = getSavedImage(slot.id);

    title.textContent = slot.title;
    filename.textContent = 'Website filename: ' + slot.file + ' · ' + slot.size;
    hint.textContent = slot.hint;

    input.setAttribute('aria-label', 'Upload image for ' + slot.title);
    input.id = 'upload-' + slot.id;
    upload.setAttribute('for', input.id);

    function showImage(src, label) {
      img.src = src;
      img.alt = slot.title + ' preview';
      preview.classList.add('has-image');
      status.textContent = label || 'Selected';
      status.classList.add('ready');
      remove.disabled = false;
    }

    if (saved) {
      showImage(saved, 'Saved here');
      filename.textContent = 'Local preview saved in this browser';
    }

    input.addEventListener('change', () => {
      const file = input.files && input.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        alert('Please choose an image file.');
        input.value = '';
        return;
      }

      if (file.size > 4 * 1024 * 1024) {
        alert('Please choose an image smaller than 4 MB for this local preview board.');
        input.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (saveImage(slot.id, reader.result)) {
          showImage(reader.result, 'Saved here');
          filename.textContent = file.name + ' · Local preview';
          updateCounts();
        }
      };
      reader.onerror = () => {
        alert('The image could not be read. Please try another file.');
      };
      reader.readAsDataURL(file);
    });

    remove.addEventListener('click', () => {
      try {
        localStorage.removeItem(storagePrefix + slot.id);
      } catch (error) {}

      img.removeAttribute('src');
      preview.classList.remove('has-image');
      status.textContent = 'Empty';
      status.classList.remove('ready');
      filename.textContent = 'Website filename: ' + slot.file + ' · ' + slot.size;
      remove.disabled = true;
      input.value = '';
      updateCounts();
    });

    grid.appendChild(fragment);
  });
}

if (search) {
  search.addEventListener('input', () => {
    renderCards(search.value);
  });
}

const clearAllButton = document.getElementById('clear-all');
if (clearAllButton) {
  clearAllButton.addEventListener('click', () => {
    const confirmed = confirm(
      'Remove all images saved in this browser for this admin board? This will not delete files from your website.'
    );
    if (!confirmed) return;

    imageSlots.forEach((slot) => {
      try {
        localStorage.removeItem(storagePrefix + slot.id);
      } catch (error) {}
    });

    renderCards(search ? search.value : '');
    updateCounts();
  });
}

renderCards();
updateCounts();

document.addEventListener("DOMContentLoaded", () => {
  const teamGrid = document.getElementById("team-grid");
  const template = document.getElementById("team-card-template");

  // Example: 10 slots for team members
  const teamSlots = 10;

  // Load saved members
  const savedMembers = JSON.parse(localStorage.getItem("teamMembers")) || [];

  for (let i = 0; i < teamSlots; i++) {
    const card = template.content.cloneNode(true);
    const nameInput = card.querySelector(".member-name");
    const roleInput = card.querySelector(".member-role");
    const photoInput = card.querySelector(".member-photo");
    const imgPreview = card.querySelector("img");
    const saveButton = card.querySelector(".save-button");

    if (savedMembers[i]) {
      nameInput.value = savedMembers[i].name;
      roleInput.value = savedMembers[i].role;
      if (savedMembers[i].photo) {
        imgPreview.src = savedMembers[i].photo;
      }
    }

    saveButton.addEventListener("click", () => {
      const reader = new FileReader();
      reader.onload = () => {
        savedMembers[i] = {
          name: nameInput.value,
          role: roleInput.value,
          photo: reader.result
        };
        localStorage.setItem("teamMembers", JSON.stringify(savedMembers));
        alert("Team member saved!");
      };
      if (photoInput.files[0]) {
        reader.readAsDataURL(photoInput.files[0]);
      } else {
        savedMembers[i] = {
          name: nameInput.value,
          role: roleInput.value,
          photo: savedMembers[i]?.photo || ""
        };
        localStorage.setItem("teamMembers", JSON.stringify(savedMembers));
        alert("Team member saved!");
      }
    });

    teamGrid.appendChild(card);
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const loginScreen = document.getElementById("login-screen");
  const adminBoard = document.getElementById("admin-board");
  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("login-error");

  // Check if already logged in
  if (localStorage.getItem("isAdminLoggedIn") === "true") {
    loginScreen.style.display = "none";
    adminBoard.style.display = "block";
  }

  loginForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === "moses" && password === "kalleous2026") {
      localStorage.setItem("isAdminLoggedIn", "true");
      loginScreen.style.display = "none";
      adminBoard.style.display = "block";
    } else {
      loginError.style.display = "block";
    }
  });
});
document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("isAdminLoggedIn");
  location.reload();
});
