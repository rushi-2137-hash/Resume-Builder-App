const STORAGE_KEY = 'resumes_collection';
const ACTIVE_ID_KEY = 'active_resume_id';

const StorageManager = {
  getAllResumes: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  getActiveId: () => {
    return localStorage.getItem(ACTIVE_ID_KEY);
  },

  setActiveId: (id) => {
    localStorage.setItem(ACTIVE_ID_KEY, id);
  },

  getResume: (id) => {
    const resumes = StorageManager.getAllResumes();
    return resumes.find(r => r.id === id) || null;
  },

  saveResume: (id, data) => {
    let resumes = StorageManager.getAllResumes();
    let index = resumes.findIndex(r => r.id === id);
    
    if (index !== -1) {
      resumes[index] = { ...resumes[index], ...data, updatedAt: new Date().toISOString() };
    } else {
      resumes.push({ id, ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
  },

  deleteResume: (id) => {
    let resumes = StorageManager.getAllResumes();
    resumes = resumes.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
    if (StorageManager.getActiveId() === id) {
      localStorage.removeItem(ACTIVE_ID_KEY);
    }
  },

  initAutoSave: (containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    let activeId = StorageManager.getActiveId();
    if (!activeId) {
      activeId = 'resume_' + Date.now();
      StorageManager.setActiveId(activeId);
    }

    const currentResume = StorageManager.getResume(activeId) || {};
    
    const inputs = container.querySelectorAll('input:not(.dynamic-input), textarea:not(.dynamic-input)');
    inputs.forEach(input => {
      if (input.id && currentResume[input.id] !== undefined) {
        input.value = currentResume[input.id];
      }

      input.addEventListener('input', (e) => {
        if (!e.target.id) return;
        StorageManager.saveResume(activeId, { [e.target.id]: e.target.value });
      });
    });
  }
};
