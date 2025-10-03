// Firebase Admin Panel JavaScript
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, push, set, onValue, remove, update } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5ypjJ7FfbrWhANRzxImp9g-1C25ii0JY",
  authDomain: "maje-3dfdf.firebaseapp.com",
  databaseURL: "https://maje-3dfdf-default-rtdb.firebaseio.com",
  projectId: "maje-3dfdf",
  storageBucket: "maje-3dfdf.firebasestorage.app",
  messagingSenderId: "209651607167",
  appId: "1:209651607167:web:6391de52ee9543d38cc14a",
  measurementId: "G-M93JRCSB5C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

class FirebaseAdminPanel {
    constructor() {
        this.projects = [];
        this.categories = [];
        this.init();
    }

    async init() {
        // Check authentication
        if (sessionStorage.getItem('adminLoggedIn') !== 'true') {
            window.location.href = '../index.html';
            return;
        }

        // Load data from Firebase
        await this.loadCategories();
        await this.loadProjects();
        this.updateStats();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Project form submission
        document.getElementById('projectForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProject();
        });

        // Category form submission
        document.getElementById('categoryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCategory();
        });

        // Image upload handling
        document.getElementById('projectImages').addEventListener('change', (e) => {
            this.handleImageUpload(e);
        });

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    }

    // Firebase Data Loading
    async loadCategories() {
        try {
            const categoriesRef = ref(database, 'categories');
            const snapshot = await new Promise((resolve, reject) => {
                onValue(categoriesRef, (snapshot) => {
                    resolve(snapshot);
                }, { onlyOnce: true });
            });
            
            if (snapshot.exists()) {
                this.categories = Object.values(snapshot.val());
            } else {
                // Create default categories if none exist
                await this.createDefaultCategories();
            }
        } catch (error) {
            console.error('Error loading categories:', error);
            this.categories = [];
        }
    }

    async loadProjects() {
        try {
            const projectsRef = ref(database, 'projects');
            const snapshot = await new Promise((resolve, reject) => {
                onValue(projectsRef, (snapshot) => {
                    resolve(snapshot);
                }, { onlyOnce: true });
            });
            
            if (snapshot.exists()) {
                this.projects = Object.values(snapshot.val());
            } else {
                this.projects = [];
            }
        } catch (error) {
            console.error('Error loading projects:', error);
            this.projects = [];
        }
    }

    async createDefaultCategories() {
        const defaultCategories = [
            { id: Date.now(), name: 'Web Development', description: 'Web applications and websites' },
            { id: Date.now() + 1, name: 'Mobile Apps', description: 'Mobile applications for iOS and Android' },
            { id: Date.now() + 2, name: 'AI Solutions', description: 'Artificial Intelligence and Machine Learning projects' },
            { id: Date.now() + 3, name: 'E-commerce', description: 'Online shopping and e-commerce platforms' },
            { id: Date.now() + 4, name: 'Branding', description: 'Brand identity and design projects' }
        ];

        for (const category of defaultCategories) {
            await this.saveCategoryToFirebase(category);
        }
    }

    // Project Management
    openAddProjectModal() {
        document.getElementById('projectModalTitle').textContent = 'Add New Project';
        document.getElementById('projectForm').reset();
        document.getElementById('projectId').value = '';
        document.getElementById('projectImages').value = '';
        document.getElementById('imagePreview').innerHTML = '';
        this.loadCategoryOptions();
        document.getElementById('projectModal').style.display = 'block';
    }

    openEditProjectModal(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        document.getElementById('projectModalTitle').textContent = 'Edit Project';
        document.getElementById('projectId').value = project.id;
        document.getElementById('projectTitle').value = project.title;
        document.getElementById('projectDescription').value = project.description;
        document.getElementById('projectCategory').value = project.category;
        document.getElementById('projectTechnologies').value = project.technologies ? project.technologies.join(', ') : '';
        document.getElementById('projectUrl').value = project.url || '';
        
        // Display existing images
        if (project.images && project.images.length > 0) {
            const preview = document.getElementById('imagePreview');
            preview.innerHTML = project.images.map((img, index) => `
                <div class="image-preview-item">
                    <img src="${img}" alt="Project image ${index + 1}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;">
                    <button type="button" onclick="removeImage(${index})" class="remove-image-btn">×</button>
                </div>
            `).join('');
        }
        
        this.loadCategoryOptions();
        document.getElementById('projectModal').style.display = 'block';
    }

    closeProjectModal() {
        document.getElementById('projectModal').style.display = 'none';
    }

    async handleImageUpload(event) {
        const files = event.target.files;
        const preview = document.getElementById('imagePreview');
        
        for (let file of files) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageDiv = document.createElement('div');
                    imageDiv.className = 'image-preview-item';
                    imageDiv.innerHTML = `
                        <img src="${e.target.result}" alt="Preview" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;">
                        <button type="button" onclick="removePreviewImage(this)" class="remove-image-btn">×</button>
                    `;
                    preview.appendChild(imageDiv);
                };
                reader.readAsDataURL(file);
            }
        }
    }

    async saveProject() {
        const projectId = document.getElementById('projectId').value;
        const title = document.getElementById('projectTitle').value;
        const description = document.getElementById('projectDescription').value;
        const category = document.getElementById('projectCategory').value;
        const technologies = document.getElementById('projectTechnologies').value;
        const url = document.getElementById('projectUrl').value;
        const imageFiles = document.getElementById('projectImages').files;

        if (!title || !description || !category) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            // Upload images to Firebase Storage
            const imageUrls = [];
            for (let file of imageFiles) {
                if (file.type.startsWith('image/')) {
                    const imageRef = storageRef(storage, `projects/${Date.now()}_${file.name}`);
                    const snapshot = await uploadBytes(imageRef, file);
                    const downloadURL = await getDownloadURL(snapshot.ref);
                    imageUrls.push(downloadURL);
                }
            }

            // Get existing images from preview
            const existingImages = Array.from(document.querySelectorAll('#imagePreview img')).map(img => img.src);

            const projectData = {
                id: projectId || Date.now(),
                title,
                description,
                category,
                images: [...existingImages, ...imageUrls],
                technologies: technologies.split(',').map(tech => tech.trim()).filter(tech => tech),
                url,
                createdAt: projectId ? this.projects.find(p => p.id == projectId)?.createdAt : new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            await this.saveProjectToFirebase(projectData);
            this.closeProjectModal();
            this.updateStats();
            this.loadProjectsList();
            alert('Project saved successfully!');
        } catch (error) {
            console.error('Error saving project:', error);
            alert('Error saving project. Please try again.');
        }
    }

    async saveProjectToFirebase(projectData) {
        const projectsRef = ref(database, 'projects');
        const newProjectRef = push(projectsRef);
        await set(newProjectRef, projectData);
        
        // Update local array
        if (projectData.id) {
            const index = this.projects.findIndex(p => p.id == projectData.id);
            if (index !== -1) {
                this.projects[index] = projectData;
            } else {
                this.projects.push(projectData);
            }
        } else {
            this.projects.push(projectData);
        }
    }

    async deleteProject(projectId) {
        if (confirm('Are you sure you want to delete this project?')) {
            try {
                const project = this.projects.find(p => p.id === projectId);
                if (project && project.images) {
                    // Delete images from storage
                    for (let imageUrl of project.images) {
                        try {
                            const imageRef = storageRef(storage, imageUrl);
                            await deleteObject(imageRef);
                        } catch (error) {
                            console.log('Image not found in storage:', error);
                        }
                    }
                }

                // Remove from database
                const projectsRef = ref(database, 'projects');
                const snapshot = await new Promise((resolve) => {
                    onValue(projectsRef, resolve, { onlyOnce: true });
                });
                
                if (snapshot.exists()) {
                    const projects = snapshot.val();
                    for (let key in projects) {
                        if (projects[key].id === projectId) {
                            await remove(ref(database, `projects/${key}`));
                            break;
                        }
                    }
                }

                this.projects = this.projects.filter(p => p.id !== projectId);
                this.loadProjectsList();
                this.updateStats();
                alert('Project deleted successfully!');
            } catch (error) {
                console.error('Error deleting project:', error);
                alert('Error deleting project. Please try again.');
            }
        }
    }

    viewAllProjects() {
        document.getElementById('projectsSection').style.display = 'block';
        document.getElementById('categoriesSection').style.display = 'none';
        this.loadProjectsList();
    }

    hideProjectsSection() {
        document.getElementById('projectsSection').style.display = 'none';
    }

    loadProjectsList() {
        const projectsList = document.getElementById('projectsList');
        
        if (this.projects.length === 0) {
            projectsList.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No projects found. Add your first project!</p>';
            return;
        }

        projectsList.innerHTML = this.projects.map(project => `
            <div class="project-item">
                <div class="project-header">
                    <div class="project-title">${project.title}</div>
                    <div class="project-category">${project.category}</div>
                </div>
                <p style="color: #666; margin-bottom: 0.5rem;">${project.description}</p>
                ${project.technologies && project.technologies.length > 0 ? 
                    `<p style="font-size: 0.9rem; color: #888;">Technologies: ${project.technologies.join(', ')}</p>` : ''
                }
                ${project.url ? `<p style="font-size: 0.9rem;"><a href="${project.url}" target="_blank" style="color: #667eea;">View Project</a></p>` : ''}
                ${project.images && project.images.length > 0 ? 
                    `<p style="font-size: 0.9rem; color: #888;">Images: ${project.images.length}</p>` : ''
                }
                <div class="project-actions">
                    <button class="btn btn-small" onclick="firebaseAdmin.openEditProjectModal(${project.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-small" onclick="firebaseAdmin.deleteProject(${project.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Category Management
    openAddCategoryModal() {
        document.getElementById('categoryModalTitle').textContent = 'Add New Category';
        document.getElementById('categoryForm').reset();
        document.getElementById('categoryId').value = '';
        document.getElementById('categoryModal').style.display = 'block';
    }

    openEditCategoryModal(categoryId) {
        const category = this.categories.find(c => c.id === categoryId);
        if (!category) return;

        document.getElementById('categoryModalTitle').textContent = 'Edit Category';
        document.getElementById('categoryId').value = category.id;
        document.getElementById('categoryName').value = category.name;
        document.getElementById('categoryDescription').value = category.description || '';
        document.getElementById('categoryModal').style.display = 'block';
    }

    closeCategoryModal() {
        document.getElementById('categoryModal').style.display = 'none';
    }

    async saveCategory() {
        const categoryId = document.getElementById('categoryId').value;
        const name = document.getElementById('categoryName').value;
        const description = document.getElementById('categoryDescription').value;

        if (!name) {
            alert('Please enter a category name');
            return;
        }

        try {
            const categoryData = {
                id: categoryId || Date.now(),
                name,
                description,
                createdAt: categoryId ? this.categories.find(c => c.id == categoryId)?.createdAt : new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            await this.saveCategoryToFirebase(categoryData);
            this.closeCategoryModal();
            this.updateStats();
            this.loadCategoriesList();
            alert('Category saved successfully!');
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Error saving category. Please try again.');
        }
    }

    async saveCategoryToFirebase(categoryData) {
        const categoriesRef = ref(database, 'categories');
        const newCategoryRef = push(categoriesRef);
        await set(newCategoryRef, categoryData);
        
        // Update local array
        if (categoryData.id) {
            const index = this.categories.findIndex(c => c.id == categoryData.id);
            if (index !== -1) {
                this.categories[index] = categoryData;
            } else {
                this.categories.push(categoryData);
            }
        } else {
            this.categories.push(categoryData);
        }
    }

    async deleteCategory(categoryId) {
        // Check if category is being used by any project
        const isUsed = this.projects.some(p => p.category === this.categories.find(c => c.id === categoryId)?.name);
        
        if (isUsed) {
            alert('Cannot delete category. It is being used by one or more projects.');
            return;
        }

        if (confirm('Are you sure you want to delete this category?')) {
            try {
                // Remove from database
                const categoriesRef = ref(database, 'categories');
                const snapshot = await new Promise((resolve) => {
                    onValue(categoriesRef, resolve, { onlyOnce: true });
                });
                
                if (snapshot.exists()) {
                    const categories = snapshot.val();
                    for (let key in categories) {
                        if (categories[key].id === categoryId) {
                            await remove(ref(database, `categories/${key}`));
                            break;
                        }
                    }
                }

                this.categories = this.categories.filter(c => c.id !== categoryId);
                this.loadCategoriesList();
                this.updateStats();
                alert('Category deleted successfully!');
            } catch (error) {
                console.error('Error deleting category:', error);
                alert('Error deleting category. Please try again.');
            }
        }
    }

    viewAllCategories() {
        document.getElementById('categoriesSection').style.display = 'block';
        document.getElementById('projectsSection').style.display = 'none';
        this.loadCategoriesList();
    }

    hideCategoriesSection() {
        document.getElementById('categoriesSection').style.display = 'none';
    }

    loadCategoriesList() {
        const categoriesList = document.getElementById('categoriesList');
        
        categoriesList.innerHTML = this.categories.map(category => `
            <div class="category-item">
                <div>
                    <div style="font-weight: 600; margin-bottom: 0.5rem;">${category.name}</div>
                    <div style="color: #666; font-size: 0.9rem;">${category.description || 'No description'}</div>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-small" onclick="firebaseAdmin.openEditCategoryModal(${category.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-small" onclick="firebaseAdmin.deleteCategory(${category.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadCategoryOptions() {
        const categorySelect = document.getElementById('projectCategory');
        categorySelect.innerHTML = '<option value="">Select Category</option>' +
            this.categories.map(category => 
                `<option value="${category.name}">${category.name}</option>`
            ).join('');
    }

    updateStats() {
        document.getElementById('totalProjects').textContent = this.projects.length;
        document.getElementById('totalCategories').textContent = this.categories.length;
        
        // Recent projects (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentProjects = this.projects.filter(p => 
            new Date(p.createdAt) > thirtyDaysAgo
        ).length;
        document.getElementById('recentProjects').textContent = recentProjects;
    }

    // Logout
    logout() {
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminId');
        window.location.href = '../index.html';
    }
}

// Global functions for HTML onclick events
function openAddProjectModal() {
    firebaseAdmin.openAddProjectModal();
}

function openAddCategoryModal() {
    firebaseAdmin.openAddCategoryModal();
}

function viewAllProjects() {
    firebaseAdmin.viewAllProjects();
}

function hideProjectsSection() {
    firebaseAdmin.hideProjectsSection();
}

function viewAllCategories() {
    firebaseAdmin.viewAllCategories();
}

function hideCategoriesSection() {
    firebaseAdmin.hideCategoriesSection();
}

function closeProjectModal() {
    firebaseAdmin.closeProjectModal();
}

function closeCategoryModal() {
    firebaseAdmin.closeCategoryModal();
}

function removePreviewImage(button) {
    button.parentElement.remove();
}

function removeImage(index) {
    // This would handle removing existing images
    console.log('Remove image at index:', index);
}

function logout() {
    firebaseAdmin.logout();
}

// Initialize Firebase admin panel when page loads
let firebaseAdmin;
document.addEventListener('DOMContentLoaded', function() {
    firebaseAdmin = new FirebaseAdminPanel();
});

