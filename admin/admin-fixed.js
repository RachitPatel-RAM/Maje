// Fixed Admin Panel JavaScript with Firebase Integration
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
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const storage = firebase.storage();

class FixedAdminPanel {
    constructor() {
        this.projects = [];
        this.categories = [];
        this.init();
    }

    async init() {
        // Check authentication
        if (sessionStorage.getItem('adminLoggedIn') !== 'true') {
            window.location.href = 'index.html';
            return;
        }

        console.log('Admin panel initializing...');
        
        // Load data from Firebase
        await this.loadCategories();
        await this.loadProjects();
        this.updateStats();
        this.setupEventListeners();
        
        console.log('Admin panel initialized successfully');
    }

    setupEventListeners() {
        // Project form submission
        const projectForm = document.getElementById('projectForm');
        if (projectForm) {
            projectForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProject();
            });
        }

        // Category form submission
        const categoryForm = document.getElementById('categoryForm');
        if (categoryForm) {
            categoryForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveCategory();
            });
        }

        // Image upload handling
        const projectImages = document.getElementById('projectImages');
        if (projectImages) {
            projectImages.addEventListener('change', (e) => {
                this.handleImageUpload(e);
            });
        }

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
            const categoriesRef = database.ref('categories');
            const snapshot = await categoriesRef.once('value');
            
            if (snapshot.exists()) {
                this.categories = Object.values(snapshot.val());
            } else {
                // Create default categories if none exist
                await this.createDefaultCategories();
            }
            console.log('Categories loaded:', this.categories.length);
        } catch (error) {
            console.error('Error loading categories:', error);
            this.categories = [];
        }
    }

    async loadProjects() {
        try {
            const projectsRef = database.ref('projects');
            const snapshot = await projectsRef.once('value');
            
            if (snapshot.exists()) {
                const projectsData = snapshot.val();
                this.projects = Object.keys(projectsData).map(key => ({
                    ...projectsData[key],
                    firebaseKey: key
                }));
            } else {
                this.projects = [];
            }
            console.log('Projects loaded:', this.projects.length);
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
        console.log('Opening Add Project Modal...');
        try {
            document.getElementById('projectModalTitle').textContent = 'Add New Project';
            document.getElementById('projectForm').reset();
            document.getElementById('projectId').value = '';
            document.getElementById('projectImages').value = '';
            document.getElementById('imagePreview').innerHTML = '';
            this.loadCategoryOptions();
            document.getElementById('projectModal').style.display = 'block';
            console.log('Modal opened successfully');
        } catch (error) {
            console.error('Error opening modal:', error);
        }
    }

    viewProject(projectId) {
        console.log('Viewing project with ID:', projectId);
        const project = this.projects.find(p => p.id === projectId);
        if (!project) {
            alert('Project not found!');
            return;
        }

        // Create a detailed view modal or redirect to project URL
        if (project.url) {
            window.open(project.url, '_blank');
        } else {
            // Show project details in an alert or modal
            let details = `Project: ${project.title}\n`;
            details += `Category: ${project.category}\n`;
            details += `Description: ${project.description}\n`;
            if (project.technologies && project.technologies.length > 0) {
                details += `Technologies: ${project.technologies.join(', ')}\n`;
            }
            if (project.images && project.images.length > 0) {
                details += `Images: ${project.images.length} uploaded\n`;
            }
            details += `Created: ${new Date(project.createdAt).toLocaleDateString()}`;
            alert(details);
        }
    }

    openEditProjectModal(projectId) {
        console.log('Opening edit modal for project ID:', projectId);
        const project = this.projects.find(p => p.id == projectId);
        if (!project) {
            console.error('Project not found with ID:', projectId);
            alert('Project not found!');
            return;
        }

        console.log('Found project:', project);
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

    handleImageUpload(event) {
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

        // Show processing animation
        const saveButton = document.querySelector('#projectForm button[type="submit"]');
        const originalText = saveButton.innerHTML;
        saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        saveButton.disabled = true;

        try {
            // Upload images to Cloudinary
            const imageUrls = [];
            for (let file of imageFiles) {
                if (file.type.startsWith('image/')) {
                    const cloudinaryUrl = await this.uploadImageToCloudinary(file);
                    if (cloudinaryUrl) {
                        imageUrls.push(cloudinaryUrl);
                    }
                }
            }

            // Get existing images from preview
            const existingImages = Array.from(document.querySelectorAll('#imagePreview img')).map(img => img.src);

            const projectData = {
                id: projectId || Date.now().toString(),
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
            
            // Reset button
            saveButton.innerHTML = originalText;
            saveButton.disabled = false;
            
            this.closeProjectModal();
            this.updateStats();
            this.loadProjectsList();
            alert('Project saved successfully!');
        } catch (error) {
            console.error('Error saving project:', error);
            // Reset button
            saveButton.innerHTML = originalText;
            saveButton.disabled = false;
            alert('Error saving project. Please try again.');
        }
    }

    // Upload image to Cloudinary
    async uploadImageToCloudinary(imageFile) {
        try {
            const formData = new FormData();
            formData.append('file', imageFile);
            formData.append('upload_preset', 'majetechnologies');
            formData.append('cloud_name', 'dpv1ulroy');

            const response = await fetch('https://api.cloudinary.com/v1_1/dpv1ulroy/image/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (data.secure_url) {
                console.log('Image uploaded to Cloudinary:', data.secure_url);
                return data.secure_url;
            } else {
                throw new Error('Failed to upload image to Cloudinary');
            }
        } catch (error) {
            console.error('Error uploading image to Cloudinary:', error);
            return null;
        }
    }

    async saveProjectToFirebase(projectData) {
        console.log('Saving project to Firebase:', projectData);
        const projectsRef = database.ref('projects');
        
        // Check if this is an update to an existing project
        const existingProjectIndex = this.projects.findIndex(p => p.id == projectData.id);
        
        if (existingProjectIndex !== -1) {
            // Update existing project
            const existingProject = this.projects[existingProjectIndex];
            const projectRef = database.ref(`projects/${existingProject.firebaseKey || projectData.id}`);
            await projectRef.update(projectData);
            
            // Update local array
            this.projects[existingProjectIndex] = { ...projectData, firebaseKey: existingProject.firebaseKey || projectData.id };
        } else {
            // Create new project
            const newProjectRef = projectsRef.push();
            await newProjectRef.set(projectData);
            
            // Add to local array with Firebase key
            this.projects.push({ ...projectData, firebaseKey: newProjectRef.key });
        }
    }

    async deleteProject(projectId) {
        console.log('Deleting project with ID:', projectId);
        if (confirm('Are you sure you want to delete this project?')) {
            try {
                const project = this.projects.find(p => p.id == projectId);
                console.log('Found project to delete:', project);
                
                if (project && project.images) {
                    // Delete images from storage
                    for (let imageUrl of project.images) {
                        try {
                            const imageRef = storage.refFromURL(imageUrl);
                            await imageRef.delete();
                        } catch (error) {
                            console.log('Image not found in storage:', error);
                        }
                    }
                }

                // Remove from database
                const projectsRef = database.ref('projects');
                const snapshot = await projectsRef.once('value');
                
                if (snapshot.exists()) {
                    const projects = snapshot.val();
                    for (let key in projects) {
                        if (projects[key].id == projectId) {
                            await database.ref(`projects/${key}`).remove();
                            console.log('Project removed from Firebase');
                            break;
                        }
                    }
                }

                this.projects = this.projects.filter(p => p.id != projectId);
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
                ${project.images && project.images.length > 0 ? 
                    `<p style="font-size: 0.9rem; color: #888;">Images: ${project.images.length}</p>` : ''
                }
                <div class="project-actions">
                    <button class="btn btn-info btn-small" onclick="viewProject('${project.id}')">
                        <i class="fas fa-eye"></i> View Project
                    </button>
                    <button class="btn btn-small" onclick="openEditProjectModal('${project.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-small" onclick="deleteProject('${project.id}')">
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
        console.log('Opening edit modal for category ID:', categoryId);
        const category = this.categories.find(c => c.id == categoryId);
        if (!category) {
            console.error('Category not found with ID:', categoryId);
            alert('Category not found!');
            return;
        }

        console.log('Found category:', category);
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
        const categoriesRef = database.ref('categories');
        const newCategoryRef = categoriesRef.push();
        await newCategoryRef.set(categoryData);
        
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
        console.log('Deleting category with ID:', categoryId);
        
        // Check if category is being used by any project
        const category = this.categories.find(c => c.id == categoryId);
        const isUsed = this.projects.some(p => p.category === category?.name);
        
        if (isUsed) {
            alert('Cannot delete category. It is being used by one or more projects.');
            return;
        }

        if (confirm('Are you sure you want to delete this category?')) {
            try {
                // Remove from database
                const categoriesRef = database.ref('categories');
                const snapshot = await categoriesRef.once('value');
                
                if (snapshot.exists()) {
                    const categories = snapshot.val();
                    for (let key in categories) {
                        if (categories[key].id == categoryId) {
                            await database.ref(`categories/${key}`).remove();
                            console.log('Category removed from Firebase');
                            break;
                        }
                    }
                }

                this.categories = this.categories.filter(c => c.id != categoryId);
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
                    <button class="btn btn-small" onclick="openEditCategoryModal('${category.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-small" onclick="deleteCategory('${category.id}')">
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
        window.location.href = 'index.html';
    }
}

// Global functions for HTML onclick events
function openAddProjectModal() {
    console.log('Global openAddProjectModal called');
    if (fixedAdmin) {
        fixedAdmin.openAddProjectModal();
    } else {
        console.error('fixedAdmin not initialized');
    }
}

function openEditProjectModal(projectId) {
    console.log('Global openEditProjectModal called with ID:', projectId);
    if (fixedAdmin) {
        fixedAdmin.openEditProjectModal(projectId);
    } else {
        console.error('fixedAdmin not initialized');
    }
}

function deleteProject(projectId) {
    console.log('Global deleteProject called with ID:', projectId);
    if (fixedAdmin) {
        fixedAdmin.deleteProject(projectId);
    } else {
        console.error('fixedAdmin not initialized');
    }
}

function viewProject(projectId) {
    console.log('Global viewProject called with ID:', projectId);
    if (fixedAdmin) {
        fixedAdmin.viewProject(projectId);
    } else {
        console.error('fixedAdmin not initialized');
    }
}

function openAddCategoryModal() {
    fixedAdmin.openAddCategoryModal();
}

function openEditCategoryModal(categoryId) {
    console.log('Global openEditCategoryModal called with ID:', categoryId);
    if (fixedAdmin) {
        fixedAdmin.openEditCategoryModal(categoryId);
    } else {
        console.error('fixedAdmin not initialized');
    }
}

function deleteCategory(categoryId) {
    console.log('Global deleteCategory called with ID:', categoryId);
    if (fixedAdmin) {
        fixedAdmin.deleteCategory(categoryId);
    } else {
        console.error('fixedAdmin not initialized');
    }
}

function viewAllProjects() {
    fixedAdmin.viewAllProjects();
}

function hideProjectsSection() {
    fixedAdmin.hideProjectsSection();
}

function viewAllCategories() {
    fixedAdmin.viewAllCategories();
}

function hideCategoriesSection() {
    fixedAdmin.hideCategoriesSection();
}

function closeProjectModal() {
    fixedAdmin.closeProjectModal();
}

function closeCategoryModal() {
    fixedAdmin.closeCategoryModal();
}

function removePreviewImage(button) {
    button.parentElement.remove();
}

function removeImage(index) {
    console.log('Remove image at index:', index);
    const preview = document.getElementById('imagePreview');
    const imageItems = preview.querySelectorAll('.image-preview-item');
    if (imageItems[index]) {
        imageItems[index].remove();
    }
}

// Initialize fixed admin panel when page loads
let fixedAdmin;

function logout() {
    if (fixedAdmin) {
        fixedAdmin.logout();
    } else {
        // Fallback logout
        sessionStorage.removeItem('adminLoggedIn');
        window.location.href = 'index.html';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing admin panel...');
    fixedAdmin = new FixedAdminPanel();
});
