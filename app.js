// Application data from the provided JSON
const appData = {
  user: {
    name: "John Smith",
    email: "john.smith@company.com",
    organization: "TechCorp Solutions",
    role: "Project Manager"
  },
  users: [
    {"id": 1, "name": "John Smith", "email": "john.smith@company.com", "role": "user", "department": "IT"},
    {"id": 2, "name": "Sarah Johnson", "email": "sarah.johnson@company.com", "role": "user", "department": "Sales"},
    {"id": 3, "name": "Mike Davis", "email": "mike.davis@company.com", "role": "admin", "department": "IT"},
    {"id": 4, "name": "Lisa Brown", "email": "lisa.brown@company.com", "role": "delivery_team", "department": "Operations"}
  ],
  sowTypes: [
    {"id": "migration", "name": "Migration OTI", "description": "Migration from existing systems to new platforms"},
    {"id": "greenfield", "name": "Greenfield OTI", "description": "New implementation from scratch"}
  ],
  cloudPlatforms: [
    {"id": "aws", "name": "AWS", "description": "Amazon Web Services"},
    {"id": "azure", "name": "Azure", "description": "Microsoft Azure"},
    {"id": "gcp", "name": "GCP", "description": "Google Cloud Platform"}
  ],
  downloadHistory: [
    {"id": 1, "userId": 1, "userName": "John Smith", "sowType": "Migration OTI", "cloudPlatform": "AWS", "downloadDate": "2025-01-28", "clientName": "Acme Corp"},
    {"id": 2, "userId": 2, "userName": "Sarah Johnson", "sowType": "Greenfield OTI", "cloudPlatform": "Azure", "downloadDate": "2025-01-27", "clientName": "TechStart Inc"},
    {"id": 3, "userId": 1, "userName": "John Smith", "sowType": "Migration OTI", "cloudPlatform": "GCP", "downloadDate": "2025-01-26", "clientName": "Global Systems"},
    {"id": 4, "userId": 4, "userName": "Lisa Brown", "sowType": "Greenfield OTI", "cloudPlatform": "AWS", "downloadDate": "2025-01-25", "clientName": "StartupXYZ"}
  ],
  uploadRequests: [
    {"id": 1, "userId": 1, "userName": "John Smith", "projectName": "Acme Migration", "endCustomer": "Acme Corp", "opportunityId": "OPP-2025-001", "boqLink": "https://sharepoint.com/boq1", "status": "Pending Review", "submittedDate": "2025-01-28", "assignedTo": "Lisa Brown", "documentName": "Acme_SOW_v1.docx"},
    {"id": 2, "userId": 2, "userName": "Sarah Johnson", "projectName": "TechStart Setup", "endCustomer": "TechStart Inc", "opportunityId": "OPP-2025-002", "boqLink": "https://sharepoint.com/boq2", "status": "Approved", "submittedDate": "2025-01-27", "assignedTo": "Lisa Brown", "documentName": "TechStart_SOW_v2.docx"},
    {"id": 3, "userId": 1, "userName": "John Smith", "projectName": "Global Migration", "endCustomer": "Global Systems", "opportunityId": "OPP-2025-003", "boqLink": "https://sharepoint.com/boq3", "status": "Under Review", "submittedDate": "2025-01-26", "assignedTo": "Mike Davis", "documentName": "Global_SOW_final.docx"}
  ],
  sowTemplates: [
    {"id": 1, "type": "migration", "cloud": "aws", "version": "v2.1", "lastUpdated": "2025-01-20", "filename": "AWS_Migration_SOW_Template_v2.1.docx"},
    {"id": 2, "type": "migration", "cloud": "azure", "version": "v2.0", "lastUpdated": "2025-01-18", "filename": "Azure_Migration_SOW_Template_v2.0.docx"},
    {"id": 3, "type": "migration", "cloud": "gcp", "version": "v1.9", "lastUpdated": "2025-01-15", "filename": "GCP_Migration_SOW_Template_v1.9.docx"},
    {"id": 4, "type": "greenfield", "cloud": "aws", "version": "v3.0", "lastUpdated": "2025-01-22", "filename": "AWS_Greenfield_SOW_Template_v3.0.docx"},
    {"id": 5, "type": "greenfield", "cloud": "azure", "version": "v2.8", "lastUpdated": "2025-01-19", "filename": "Azure_Greenfield_SOW_Template_v2.8.docx"},
    {"id": 6, "type": "greenfield", "cloud": "gcp", "version": "v2.5", "lastUpdated": "2025-01-16", "filename": "GCP_Greenfield_SOW_Template_v2.5.docx"}
  ],
  systemStats: {
    "totalDownloads": 45,
    "totalUploads": 12,
    "pendingRequests": 3,
    "approvedRequests": 8,
    "rejectedRequests": 1,
    "activeUsers": 15,
    "totalUsers": 23
  }
};

// Global state
let currentUser = appData.user;
let uploadedFile = null;
let currentRequest = null;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('SOW Template Management System initialized');
    initializeApp();
});

function initializeApp() {
    // Set up user info in dropdown and navbar
    setupUserInfo();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load initial data
    loadHistoriesData();
    loadAdminData();
}

function setupUserInfo() {
    // Update dropdown user info with explicit values to ensure correctness
    const dropdownUserName = document.getElementById('dropdownUserName');
    const dropdownUserEmail = document.getElementById('dropdownUserEmail');
    const dropdownUserOrg = document.getElementById('dropdownUserOrg');
    
    if (dropdownUserName) {
        dropdownUserName.textContent = appData.user.name;
    }
    if (dropdownUserEmail) {
        dropdownUserEmail.textContent = appData.user.email;
    }
    if (dropdownUserOrg) {
        dropdownUserOrg.textContent = appData.user.organization;
    }
    
    // Update navbar user info elements
    const userInfoElements = document.querySelectorAll('[id^="userInfo"]');
    userInfoElements.forEach(el => {
        if (appData.user.role === 'admin') {
            el.textContent = `${appData.user.name} (Admin)`;
        } else {
            el.textContent = appData.user.name;
        }
    });
}

function setupEventListeners() {
    // Person icon dropdown toggle
    const personIconBtn = document.getElementById('personIconBtn');
    const userDropdown = document.getElementById('userDropdown');
    
    if (personIconBtn && userDropdown) {
        personIconBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleUserDropdown();
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userDropdown.contains(e.target) && !personIconBtn.contains(e.target)) {
                closeUserDropdown();
            }
        });
        
        // Prevent dropdown from closing when clicking inside it
        userDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Navigation card clicks
    document.querySelectorAll('.nav-card').forEach(card => {
        card.addEventListener('click', function() {
            const screen = this.dataset.screen;
            if (screen) {
                showScreen(screen + 'Screen');
                if (screen === 'sowGenerator') {
                    resetGeneratorForm();
                } else if (screen === 'uploadSow') {
                    resetUploadForm();
                }
            }
        });
    });
    
    // File upload setup
    setupFileUpload();
    
    // Admin tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchAdminTab(this.dataset.tab);
        });
    });
    
    // Template file upload
    const templateFileInput = document.getElementById('templateFileInput');
    if (templateFileInput) {
        templateFileInput.addEventListener('change', handleTemplateUpload);
    }
}

function toggleUserDropdown() {
    const userDropdown = document.getElementById('userDropdown');
    if (userDropdown) {
        userDropdown.classList.toggle('hidden');
    }
}

function closeUserDropdown() {
    const userDropdown = document.getElementById('userDropdown');
    if (userDropdown && !userDropdown.classList.contains('hidden')) {
        userDropdown.classList.add('hidden');
    }
}

function showScreen(screenId) {
    // Close user dropdown when navigating
    closeUserDropdown();
    
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

// SOW Generator Functions
function proceedToSOWSelection() {
    const clientName = document.getElementById('clientName').value.trim();
    const endCustomerName = document.getElementById('endCustomerName').value.trim();
    
    if (!clientName || !endCustomerName) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    // Hide current step and show next
    document.getElementById('clientDetailsStep').classList.remove('active');
    document.getElementById('sowSelectionStep').classList.add('active');
}

function goBackToClientDetails() {
    document.getElementById('sowSelectionStep').classList.remove('active');
    document.getElementById('clientDetailsStep').classList.add('active');
}

function downloadSOW() {
    const sowType = document.getElementById('sowType').value;
    const cloudPlatform = document.getElementById('cloudPlatform').value;
    const clientName = document.getElementById('clientName').value;
    const endCustomerName = document.getElementById('endCustomerName').value;
    
    if (!sowType || !cloudPlatform) {
        showToast('Please select both SOW type and cloud platform', 'error');
        return;
    }
    
    // Find matching template
    const typeKey = sowType.toLowerCase().includes('migration') ? 'migration' : 'greenfield';
    const cloudKey = cloudPlatform.toLowerCase();
    
    const template = appData.sowTemplates.find(t => 
        t.type === typeKey && t.cloud === cloudKey
    );
    
    if (template) {
        // Add to download history
        const downloadRecord = {
            id: appData.downloadHistory.length + 1,
            userId: 1,
            userName: currentUser.name,
            sowType: sowType,
            cloudPlatform: cloudPlatform,
            downloadDate: new Date().toISOString().split('T')[0],
            clientName: clientName
        };
        
        appData.downloadHistory.unshift(downloadRecord);
        appData.systemStats.totalDownloads++;
        
        // Simulate download
        showToast(`SOW Template downloaded successfully for ${clientName}!`, 'success');
        
        // Reset form after short delay
        setTimeout(() => {
            resetGeneratorForm();
        }, 2000);
        
        // Update histories if on that screen
        loadHistoriesData();
    } else {
        showToast('Template not found for selected configuration', 'error');
    }
}

function resetGeneratorForm() {
    document.getElementById('clientDetailsForm').reset();
    document.getElementById('sowSelectionForm').reset();
    document.getElementById('sowSelectionStep').classList.remove('active');
    document.getElementById('clientDetailsStep').classList.add('active');
}

// Upload Functions
function setupFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    if (!uploadArea || !fileInput) return;
    
    // Click to upload
    uploadArea.addEventListener('click', () => {
        if (!uploadedFile) {
            fileInput.click();
        }
    });
    
    // File input change
    fileInput.addEventListener('change', handleFileSelection);
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    });
}

function handleFileSelection(e) {
    const file = e.target.files[0];
    if (file) {
        handleFileUpload(file);
    }
}

function handleFileUpload(file) {
    const validTypes = ['pdf', 'doc', 'docx'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!validTypes.includes(fileExtension)) {
        showToast('Please upload a valid document file (.pdf, .doc, .docx)', 'error');
        return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
        showToast('File size must be less than 10MB', 'error');
        return;
    }
    
    uploadedFile = file;
    
    // Show success state
    const uploadPlaceholder = document.querySelector('.upload-placeholder');
    const uploadSuccess = document.getElementById('uploadSuccess');
    const uploadedFileName = document.getElementById('uploadedFileName');
    
    if (uploadPlaceholder) uploadPlaceholder.style.display = 'none';
    if (uploadSuccess) uploadSuccess.style.display = 'block';
    if (uploadedFileName) uploadedFileName.textContent = file.name;
}

function proceedToProjectDetails() {
    if (!uploadedFile) {
        showToast('Please upload a file first', 'error');
        return;
    }
    
    document.getElementById('fileUploadStep').classList.remove('active');
    document.getElementById('projectDetailsStep').classList.add('active');
}

function goBackToFileUpload() {
    document.getElementById('projectDetailsStep').classList.remove('active');
    document.getElementById('fileUploadStep').classList.add('active');
}

function submitRequest() {
    if (!uploadedFile) {
        showToast('Please upload a file first', 'error');
        return;
    }
    
    const projectName = document.getElementById('projectName').value.trim();
    const endCustomer = document.getElementById('projectEndCustomer').value.trim();
    const opportunityId = document.getElementById('opportunityId').value.trim();
    const boqLink = document.getElementById('boqLink').value.trim();
    
    if (!projectName || !endCustomer || !opportunityId) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    // Create new request
    const newRequest = {
        id: appData.uploadRequests.length + 1,
        userId: 1,
        userName: currentUser.name,
        projectName: projectName,
        endCustomer: endCustomer,
        opportunityId: opportunityId,
        boqLink: boqLink || '',
        status: 'Pending Review',
        submittedDate: new Date().toISOString().split('T')[0],
        assignedTo: 'Delivery Team',
        documentName: uploadedFile.name
    };
    
    appData.uploadRequests.unshift(newRequest);
    appData.systemStats.totalUploads++;
    appData.systemStats.pendingRequests++;
    
    currentRequest = newRequest;
    
    // Show status step
    document.getElementById('projectDetailsStep').classList.remove('active');
    document.getElementById('statusStep').classList.add('active');
    
    // Update status table
    updateStatusTable();
    
    showToast('Request submitted successfully!', 'success');
}

function updateStatusTable() {
    const tbody = document.getElementById('statusTableBody');
    if (!tbody || !currentRequest) return;
    
    tbody.innerHTML = `
        <tr>
            <td>REQ-${String(currentRequest.id).padStart(3, '0')}</td>
            <td>${currentRequest.projectName}</td>
            <td><span class="status status--pending">${currentRequest.status}</span></td>
            <td>${currentRequest.submittedDate}</td>
            <td>${currentRequest.assignedTo}</td>
        </tr>
    `;
}

function resetUploadProcess() {
    uploadedFile = null;
    currentRequest = null;
    
    // Reset forms
    document.getElementById('projectDetailsForm').reset();
    const fileInput = document.getElementById('fileInput');
    if (fileInput) fileInput.value = '';
    
    // Reset UI
    const uploadPlaceholder = document.querySelector('.upload-placeholder');
    const uploadSuccess = document.getElementById('uploadSuccess');
    
    if (uploadPlaceholder) uploadPlaceholder.style.display = 'block';
    if (uploadSuccess) uploadSuccess.style.display = 'none';
    
    // Show first step
    document.getElementById('statusStep').classList.remove('active');
    document.getElementById('projectDetailsStep').classList.remove('active');
    document.getElementById('fileUploadStep').classList.add('active');
}

function resetUploadForm() {
    resetUploadProcess();
}

// Histories Functions
function loadHistoriesData() {
    // Update summary cards
    document.getElementById('totalDownloads').textContent = appData.systemStats.totalDownloads;
    document.getElementById('totalUploads').textContent = appData.systemStats.totalUploads;
    document.getElementById('pendingRequests').textContent = appData.systemStats.pendingRequests;
    document.getElementById('completedRequests').textContent = appData.systemStats.approvedRequests;
    
    // Load download history table
    const downloadTable = document.getElementById('downloadHistoryTable');
    if (downloadTable) {
        downloadTable.innerHTML = appData.downloadHistory.map(record => `
            <tr>
                <td>${record.userName}</td>
                <td>${record.sowType}</td>
                <td>${record.downloadDate}</td>
                <td>${record.cloudPlatform}</td>
            </tr>
        `).join('');
    }
    
    // Load upload history table
    const uploadTable = document.getElementById('uploadHistoryTable');
    if (uploadTable) {
        uploadTable.innerHTML = appData.uploadRequests.map(record => `
            <tr>
                <td>${record.userName}</td>
                <td>${record.submittedDate}</td>
                <td><span class="status status--${record.status.toLowerCase().replace(' ', '')}">${record.status}</span></td>
                <td>${record.documentName}</td>
            </tr>
        `).join('');
    }
}

// Admin Functions
function switchAdminTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update tab panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Load tab-specific data
    loadAdminTabData(tabName);
}

function loadAdminTabData(tabName) {
    switch(tabName) {
        case 'templates':
            loadTemplatesData();
            break;
        case 'requests':
            loadPendingRequestsData();
            break;
        case 'users':
            loadUsersData();
            break;
        case 'analytics':
            loadAnalyticsData();
            break;
    }
}

function loadAdminData() {
    loadTemplatesData();
    loadPendingRequestsData();
    loadUsersData();
    loadAnalyticsData();
}

function loadTemplatesData() {
    const templatesList = document.getElementById('templatesList');
    if (!templatesList) return;
    
    templatesList.innerHTML = appData.sowTemplates.map(template => `
        <div class="template-item">
            <div class="template-info">
                <div class="template-name">${template.filename}</div>
                <div class="template-meta">Version: ${template.version} • Updated: ${template.lastUpdated}</div>
                <div class="template-meta">Type: ${template.type} • Cloud: ${template.cloud.toUpperCase()}</div>
            </div>
            <div class="template-actions">
                <button class="btn btn--outline btn--sm" onclick="editTemplate(${template.id})">Edit</button>
                <button class="btn btn--outline btn--sm" onclick="downloadTemplate(${template.id})">Download</button>
            </div>
        </div>
    `).join('');
}

function loadPendingRequestsData() {
    const requestsList = document.getElementById('pendingRequestsList');
    if (!requestsList) return;
    
    const pendingRequests = appData.uploadRequests.filter(req => 
        req.status === 'Pending Review' || req.status === 'Under Review'
    );
    
    if (pendingRequests.length === 0) {
        requestsList.innerHTML = '<p class="text-center">No pending requests</p>';
        return;
    }
    
    requestsList.innerHTML = pendingRequests.map(request => `
        <div class="request-item">
            <div class="request-header">
                <div class="request-info">
                    <h5>${request.projectName}</h5>
                    <div class="request-meta">
                        Submitted by: ${request.userName}<br>
                        Date: ${request.submittedDate}<br>
                        Opportunity ID: ${request.opportunityId}
                    </div>
                </div>
                <span class="request-status">${request.status}</span>
            </div>
            <div class="request-body">
                <p><strong>End Customer:</strong> ${request.endCustomer}</p>
                <p><strong>Document:</strong> ${request.documentName}</p>
                ${request.boqLink ? `<p><strong>BOQ Link:</strong> <a href="${request.boqLink}" target="_blank">View BOQ</a></p>` : ''}
            </div>
            <div class="request-actions">
                <button class="btn btn--primary btn--sm" onclick="reviewRequest(${request.id})">Review</button>
            </div>
        </div>
    `).join('');
}

function loadUsersData() {
    const usersList = document.getElementById('userActivityList');
    if (!usersList) return;
    
    // Create activity data based on download and upload history
    const activities = [];
    
    appData.downloadHistory.forEach(download => {
        activities.push({
            user: download.userName,
            action: `Downloaded ${download.sowType} template`,
            date: download.downloadDate,
            details: `${download.cloudPlatform} platform for ${download.clientName}`
        });
    });
    
    appData.uploadRequests.forEach(upload => {
        activities.push({
            user: upload.userName,
            action: `Uploaded SOW document`,
            date: upload.submittedDate,
            details: `${upload.projectName} - ${upload.status}`
        });
    });
    
    // Sort by date (newest first)
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    usersList.innerHTML = activities.slice(0, 10).map(activity => `
        <div class="activity-item">
            <div class="activity-info">
                <div class="activity-user">${activity.user}</div>
                <div class="activity-details">${activity.action}</div>
                <div class="activity-details">${activity.details}</div>
            </div>
            <div class="activity-date">${activity.date}</div>
        </div>
    `).join('');
}

function loadAnalyticsData() {
    document.getElementById('analyticsDownloads').textContent = appData.systemStats.totalDownloads;
    document.getElementById('analyticsUploads').textContent = appData.systemStats.totalUploads;
    document.getElementById('analyticsUsers').textContent = appData.systemStats.totalUsers;
    document.getElementById('analyticsActive').textContent = appData.systemStats.activeUsers;
}

// Modal Functions
function reviewRequest(requestId) {
    const request = appData.uploadRequests.find(r => r.id === requestId);
    if (!request) return;
    
    const modal = document.getElementById('reviewModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    modalTitle.textContent = `Review: ${request.projectName}`;
    modalContent.innerHTML = `
        <div class="detail-row">
            <strong>Project Name:</strong> ${request.projectName}
        </div>
        <div class="detail-row">
            <strong>Submitted By:</strong> ${request.userName}
        </div>
        <div class="detail-row">
            <strong>End Customer:</strong> ${request.endCustomer}
        </div>
        <div class="detail-row">
            <strong>Opportunity ID:</strong> ${request.opportunityId}
        </div>
        <div class="detail-row">
            <strong>Submitted Date:</strong> ${request.submittedDate}
        </div>
        <div class="detail-row">
            <strong>Document:</strong> ${request.documentName}
        </div>
        ${request.boqLink ? `<div class="detail-row"><strong>BOQ Link:</strong> <a href="${request.boqLink}" target="_blank">View BOQ</a></div>` : ''}
    `;
    
    // Store current request for approval/rejection
    window.currentReviewRequest = request;
    
    modal.classList.remove('hidden');
}

function closeModal() {
    const modal = document.getElementById('reviewModal');
    modal.classList.add('hidden');
    
    // Clear form
    document.getElementById('reviewComment').value = '';
    document.getElementById('assignAgent').value = '';
    
    window.currentReviewRequest = null;
}

function approveRequest() {
    if (!window.currentReviewRequest) return;
    
    const comment = document.getElementById('reviewComment').value;
    const assignedAgent = document.getElementById('assignAgent').value;
    
    if (!assignedAgent) {
        showToast('Please assign an agent before approving', 'error');
        return;
    }
    
    // Update request status
    const request = window.currentReviewRequest;
    request.status = 'Approved';
    request.assignedTo = assignedAgent;
    
    // Update statistics
    appData.systemStats.pendingRequests--;
    appData.systemStats.approvedRequests++;
    
    showToast(`Request approved and assigned to ${assignedAgent}`, 'success');
    
    closeModal();
    loadPendingRequestsData();
    loadHistoriesData();
}

function rejectRequest() {
    if (!window.currentReviewRequest) return;
    
    const comment = document.getElementById('reviewComment').value;
    
    if (!comment.trim()) {
        showToast('Please provide a comment for rejection', 'error');
        return;
    }
    
    // Update request status
    const request = window.currentReviewRequest;
    request.status = 'Rejected';
    
    // Update statistics
    appData.systemStats.pendingRequests--;
    appData.systemStats.rejectedRequests++;
    
    showToast('Request rejected', 'info');
    
    closeModal();
    loadPendingRequestsData();
    loadHistoriesData();
}

// Template Management Functions
function handleTemplateUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const validTypes = ['doc', 'docx'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!validTypes.includes(fileExtension)) {
        showToast('Please upload a valid Word document (.doc, .docx)', 'error');
        return;
    }
    
    // Simulate template upload
    const newTemplate = {
        id: appData.sowTemplates.length + 1,
        type: 'migration', // Default, would be determined by user input in real app
        cloud: 'aws', // Default, would be determined by user input in real app
        version: 'v1.0',
        lastUpdated: new Date().toISOString().split('T')[0],
        filename: file.name
    };
    
    appData.sowTemplates.push(newTemplate);
    
    showToast('Template uploaded successfully!', 'success');
    loadTemplatesData();
    
    // Reset file input
    e.target.value = '';
}

function editTemplate(templateId) {
    showToast('Template editing functionality would be implemented here', 'info');
}

function downloadTemplate(templateId) {
    const template = appData.sowTemplates.find(t => t.id === templateId);
    if (template) {
        showToast(`Downloading ${template.filename}...`, 'info');
    }
}

// Utility Functions
function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <span>${getToastIcon(type)}</span>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 4000);
}

function getToastIcon(type) {
    const icons = {
        'success': '✅',
        'error': '❌',
        'info': 'ℹ️',
        'warning': '⚠️'
    };
    return icons[type] || 'ℹ️';
}

// Make functions globally available for onclick handlers
window.showScreen = showScreen;
window.proceedToSOWSelection = proceedToSOWSelection;
window.goBackToClientDetails = goBackToClientDetails;
window.downloadSOW = downloadSOW;
window.proceedToProjectDetails = proceedToProjectDetails;
window.goBackToFileUpload = goBackToFileUpload;
window.submitRequest = submitRequest;
window.resetUploadProcess = resetUploadProcess;
window.reviewRequest = reviewRequest;
window.closeModal = closeModal;
window.approveRequest = approveRequest;
window.rejectRequest = rejectRequest;
window.editTemplate = editTemplate;
window.downloadTemplate = downloadTemplate;