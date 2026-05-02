const themeToggle = document.getElementById('themeToggle');
const body = document.body;

const fetchAboutData = async () => {
  try {
    const response = await fetch('/api/about');
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Unable to load about content.');
    }

    const about = result.data;
    document.getElementById('companyHeadline').textContent = about.headline;
    document.getElementById('aboutDescription').innerHTML = about.description;
    document.getElementById('companyName').textContent = about.company_name;
    document.getElementById('missionText').textContent = about.mission;
    document.getElementById('visionText').textContent = about.vision;
    document.getElementById('companyImage').src = about.image_url || '/images/about-placeholder.svg';
    document.getElementById('companyImage').alt = `${about.company_name} illustration`;
  } catch (error) {
    document.getElementById('aboutDescription').textContent = error.message;
  }
};

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
fetchAboutData();
