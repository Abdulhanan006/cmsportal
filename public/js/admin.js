const aboutForm = document.getElementById('aboutForm');
const messageBox = document.getElementById('aboutMessage');
const logoutButton = document.getElementById('logoutButton');
const versionList = document.getElementById('versionList');
const versionCount = document.getElementById('versionCount');
const loadingOverlay = document.getElementById('loadingOverlay');
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

const token = localStorage.getItem('cmsAdminToken');

if (!token) {
  window.location.href = '/login';
}

const showLoading = (active) => {
  loadingOverlay.classList.toggle('hidden', !active);
};

const fetchAbout = async () => {
  showLoading(true);
  try {
    const response = await fetch('/api/about');
    const result = await response.json();
    showLoading(false);

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Unable to load about content.');
    }

    const about = result.data;

    document.getElementById('companyName').value = about.company_name;
    document.getElementById('headline').value = about.headline;
    document.getElementById('descriptionEditor').innerHTML = about.description;
    document.getElementById('mission').value = about.mission;
    document.getElementById('vision').value = about.vision;
    document.getElementById('imageUrl').value = about.image_url;
  } catch (error) {
    showNotification(error.message, 'error');
    showLoading(false);
  }
};

const fetchVersions = async () => {
  try {
    const response = await fetch('/api/about/versions', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Unable to load versions.');
    }

    const versions = result.data;
    versionCount.textContent = versions.length.toString();
    versionList.innerHTML = versions.length
      ? versions.map((version) => {
          const when = new Date(version.updated_at).toLocaleString();
          return `<li class="version-item"><strong>${when}</strong><span>${Object.keys(version.changes).length} field update(s) by ${version.editor}</span></li>`;
        }).join('')
      : '<li class="version-item">No updates have been recorded yet.</li>';
  } catch (error) {
    versionList.innerHTML = `<li class="version-item">${error.message}</li>`;
  }
};

const showNotification = (text, type = 'success') => {
  messageBox.textContent = text;
  messageBox.className = `form-message ${type}`;
};

aboutForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  showNotification('Updating content…', 'success');
  showLoading(true);

  const formData = new FormData();
  formData.append('company_name', document.getElementById('companyName').value.trim());
  formData.append('headline', document.getElementById('headline').value.trim());
  formData.append('description', document.getElementById('descriptionEditor').innerHTML.trim());
  formData.append('mission', document.getElementById('mission').value.trim());
  formData.append('vision', document.getElementById('vision').value.trim());
  formData.append('image_url', document.getElementById('imageUrl').value.trim());

  const imageFile = document.getElementById('imageFile').files[0];
  if (imageFile) {
    formData.append('image', imageFile);
  }

  try {
    const response = await fetch('/api/about', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    const result = await response.json();
    showLoading(false);

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Update failed.');
    }

    showNotification(result.message || 'About page saved successfully.', 'success');
    document.getElementById('imageFile').value = '';
    fetchVersions();
  } catch (error) {
    showNotification(error.message, 'error');
    showLoading(false);
  }
});

logoutButton.addEventListener('click', () => {
  localStorage.removeItem('cmsAdminToken');
  window.location.href = '/login';
});

const loadTheme = () => {
  const saved = localStorage.getItem('colorTheme');
  if (saved === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.textContent = 'Light';
  }
};

const toggleTheme = () => {
  body.classList.toggle('dark-mode');
  const active = body.classList.contains('dark-mode');
  themeToggle.textContent = active ? 'Light' : 'Dark';
  localStorage.setItem('colorTheme', active ? 'dark' : 'light');
};

themeToggle.addEventListener('click', toggleTheme);
loadTheme();
fetchAbout();
fetchVersions();
