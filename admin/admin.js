// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.projects = JSON.parse(localStorage.getItem('adminProjects')) || [];
        this.categories = JSON.parse(localStorage.getItem('adminCategories')) || [
            { id: 1, name: 'Web Development', description: 'Web applications and websites' },
            { id: 2, name: 'Mobile Apps', description: 'Mobile applications for iOS and Android' },
            { id: 3, name: 'AI Solutions', description: 'Artificial Intelligence and Machine Learning projects' },
            { id: 4, name: 'E-commerce', description: 'Online shopping and e-commerce platforms' },
            { id: 5, name: 'Branding', description: 'Brand identity and design projects' }
        ];
        this.init();
    }

    init() {
        // Check authentication
        if (sessionStorage.getItem('adminLoggedIn') !== 'true') {
            window.location.href = 'index.html';
            return;
        }

        // Load initial data
        this.loadCategories();
        this.updateStats();
        this.setupEventListeners();
        
        // Save default categories if not exists
        if (!localStorage.getItem('adminCategories')) {
            this.saveCategories();
        }
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

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    }

    // Project Management
    openAddProjectModal() {
        document.getElementById('projectModalTitle').textContent = 'Add New Project';
        document.getElementById('projectForm').reset();
        document.getElementById('projectId').value = '';
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
        document.getElementById('projectImage').value = project.image || '';
        document.getElementById('projectTechnologies').value = project.technologies || '';
        document.getElementById('projectUrl').value = project.url || '';
        
        this.loadCategoryOptions();
        document.getElementById('projectModal').style.display = 'block';
    }

    closeProjectModal() {
        document.getElementById('projectModal').style.display = 'none';
    }

    saveProject() {
        const projectId = document.getElementById('projectId').value;
        const title = document.getElementById('projectTitle').value;
        const description = document.getElementById('projectDescription').value;
        const category = document.getElementById('projectCategory').value;
        const image = document.getElementById('projectImage').value;
        const technologies = document.getElementById('projectTechnologies').value;
        const url = document.getElementById('projectUrl').value;

        const projectData = {
            id: projectId || Date.now(),
            title,
            description,
            category,
            image: image || 'images/web-project.svg',
            technologies: technologies.split(',').map(tech => tech.trim()).filter(tech => tech),
            url,
            createdAt: projectId ? this.projects.find(p => p.id == projectId)?.createdAt : new Date().toISOString()
        };

        if (projectId) {
            // Update existing project
            const index = this.projects.findIndex(p => p.id == projectId);
            if (index !== -1) {
                this.projects[index] = projectData;
            }
        } else {
            // Add new project
            this.projects.push(projectData);
        }

        this.saveProjects();
        this.updateMainWebsite();
        this.closeProjectModal();
        this.updateStats();
        
        if (document.getElementById('projectsSection').style.display !== 'none') {
            this.loadProjectsList();
        }

        alert('Project saved successfully!');
    }

    deleteProject(projectId) {
        if (confirm('Are you sure you want to delete this project?')) {
            this.projects = this.projects.filter(p => p.id !== projectId);
            this.saveProjects();
            this.updateMainWebsite();
            this.loadProjectsList();
            this.updateStats();
            alert('Project deleted successfully!');
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
                <div class="project-actions">
                    <button class="btn btn-small" onclick="adminPanel.openEditProjectModal(${project.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-small" onclick="adminPanel.deleteProject(${project.id})">
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

    saveCategory() {
        const categoryId = document.getElementById('categoryId').value;
        const name = document.getElementById('categoryName').value;
        const description = document.getElementById('categoryDescription').value;

        const categoryData = {
            id: categoryId || Date.now(),
            name,
            description
        };

        if (categoryId) {
            // Update existing category
            const index = this.categories.findIndex(c => c.id == categoryId);
            if (index !== -1) {
                this.categories[index] = categoryData;
            }
        } else {
            // Add new category
            this.categories.push(categoryData);
        }

        this.saveCategories();
        this.closeCategoryModal();
        this.updateStats();
        
        if (document.getElementById('categoriesSection').style.display !== 'none') {
            this.loadCategoriesList();
        }

        alert('Category saved successfully!');
    }

    deleteCategory(categoryId) {
        // Check if category is being used by any project
        const isUsed = this.projects.some(p => p.category === this.categories.find(c => c.id === categoryId)?.name);
        
        if (isUsed) {
            alert('Cannot delete category. It is being used by one or more projects.');
            return;
        }

        if (confirm('Are you sure you want to delete this category?')) {
            this.categories = this.categories.filter(c => c.id !== categoryId);
            this.saveCategories();
            this.loadCategoriesList();
            this.updateStats();
            alert('Category deleted successfully!');
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
                    <button class="btn btn-small" onclick="adminPanel.openEditCategoryModal(${category.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-small" onclick="adminPanel.deleteCategory(${category.id})">
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

    loadCategories() {
        const saved = localStorage.getItem('adminCategories');
        if (saved) {
            this.categories = JSON.parse(saved);
        }
    }

    // Data Management
    saveProjects() {
        localStorage.setItem('adminProjects', JSON.stringify(this.projects));
    }

    saveCategories() {
        localStorage.setItem('adminCategories', JSON.stringify(this.categories));
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

    // Update main website with new projects
    updateMainWebsite() {
        // This would typically sync with the main website's project data
        // For now, we'll store it in localStorage for the main site to read
        const websiteProjects = this.projects.map(project => ({
            title: project.title,
            description: project.description,
            category: project.category,
            image: project.image,
            technologies: project.technologies,
            url: project.url
        }));
        
        localStorage.setItem('websiteProjects', JSON.stringify(websiteProjects));
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
    adminPanel.openAddProjectModal();
}

function openAddCategoryModal() {
    adminPanel.openAddCategoryModal();
}

function viewAllProjects() {
    adminPanel.viewAllProjects();
}

function hideProjectsSection() {
    adminPanel.hideProjectsSection();
}

function viewAllCategories() {
    adminPanel.viewAllCategories();
}

function hideCategoriesSection() {
    adminPanel.hideCategoriesSection();
}

function closeProjectModal() {
    adminPanel.closeProjectModal();
}

function closeCategoryModal() {
    adminPanel.closeCategoryModal();
}

function logout() {
    adminPanel.logout();
}

// Initialize admin panel when page loads
let adminPanel;
document.addEventListener('DOMContentLoaded', function() {
    adminPanel = new AdminPanel();
});