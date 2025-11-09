// ===================================================================
// SPEAKOUT - COMPLETE JAVASCRIPT
// City Report System
// ===================================================================

// ===================================================================
// GLOBAL USER INFO UPDATE (Applied to all pages)
// ===================================================================

function updateUserInfoGlobal() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (!currentUser.fullName) return;
    
    // Update all user names
    const userNameElements = document.querySelectorAll('.user-details h3');
    userNameElements.forEach(el => {
        el.textContent = currentUser.fullName;
    });
    
    // Update all user locations
    const userLocationElements = document.querySelectorAll('.user-details p');
    userLocationElements.forEach(el => {
        if (currentUser.city) {
            el.textContent = currentUser.city.charAt(0).toUpperCase() + currentUser.city.slice(1) + ', Indonesia';
        }
    });
    
    // Update all user avatars with initials
    const userAvatars = document.querySelectorAll('.user-avatar');
    const initials = currentUser.fullName
        .split(' ')
        .map(name => name[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
    
    userAvatars.forEach(el => {
        el.textContent = initials;
    });
    
    console.log('User info updated globally:', currentUser.fullName);
}

// Show page / Navigate
function showPage(page) {
    console.log('Navigating to:', page);
    
    const pageMap = {
        'dashboard': '../view/dashboard.html',
        'reports': '../view/myreport.html',
        'createReport': '../view/createreport.html',
        'profile': '../view/profile.html',
        'login': '../index.html'
    };
    
    if (pageMap[page]) {
        window.location.href = pageMap[page];
    } else {
        alert(`Navigating to ${page}. In development mode.`);
    }
}

// Show notification
function showNotification() {
    alert('🔔 You have 3 new updates on your reports!');
    console.log('Notifications opened');
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        console.log('User logged out');
        // Clear any stored user data
        sessionStorage.clear();
        localStorage.removeItem('currentUser');
        
        // Redirect to login
        window.location.href = '../index.html';
    }
}

// ===================================================================
// REGISTER PAGE (regist.html)
// ===================================================================

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        if (toggle) toggle.textContent = '🙈';
    } else {
        input.type = 'password';
        if (toggle) toggle.textContent = '👁️';
    }
}

// Handle registration form submission
function handleRegister(event) {
    event.preventDefault();
    
    // Get form values
    const fullName = document.getElementById('fullName').value.trim();
    const nik = document.getElementById('nik').value.trim();
    const email = document.getElementById('email').value.trim();
    const city = document.getElementById('city').value;
    const password = document.getElementById('registerPassword').value;

    // Validation
    if (!fullName || !nik || !email || !city || !password) {
        alert('Please fill in all fields!');
        return;
    }

    // Validate NIK (must be 16 digits)
    if (nik.length !== 16 || isNaN(nik)) {
        alert('NIK must be exactly 16 digits!');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address!');
        return;
    }

    // Validate password (minimum 6 characters)
    if (password.length < 6) {
        alert('Password must be at least 6 characters long!');
        return;
    }

    // Create user data object
    const userData = {
        fullName,
        nik,
        email,
        city,
        password,
        registeredAt: new Date().toISOString(),
        reports: []
    };

    // Store in memory (in real app, send to backend API)
    console.log('User registered:', userData);
    
    // Store in localStorage for demo purposes
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already exists
    if (users.some(user => user.email === email)) {
        alert('Email already registered! Please use a different email.');
        return;
    }
    
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));

    // Show success message
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.classList.add('show');
    }

    // Reset form
    document.getElementById('registerForm').reset();

    // Redirect to login after 2 seconds
    setTimeout(() => {
        alert('Registration successful! Redirecting to login page...');
        window.location.href = '../index.html';
    }, 2000);
}

// Navigate to login page
function goToLogin(event) {
    event.preventDefault();
    window.location.href = '../index.html';
}

// ===================================================================
// LOGIN PAGE (index.html)
// ===================================================================

function handleLogin(event) {
    event.preventDefault();
    
    // Get email and password - support both with and without ID
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('loginEmail') || form.querySelector('input[type="email"]');
    const passwordInput = document.getElementById('loginPassword');
    
    if (!emailInput || !passwordInput) {
        alert('Form elements not found!');
        return;
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    if (!email || !password) {
        alert('Please enter both email and password!');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address!');
        return;
    }
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    console.log('Attempting login with:', email);
    console.log('Total users in database:', users.length);
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Store current user
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Success
        console.log('Login successful:', user.fullName);
        alert('Login successful! Welcome, ' + user.fullName);
        
        // Redirect to dashboard
        window.location.href = 'view/dashboard.html';
    } else {
        // Check if email exists
        const emailExists = users.find(u => u.email === email);
        if (emailExists) {
            alert('Invalid password! Please try again.');
        } else {
            alert('Email not registered! Please sign up first.');
        }
    }
}

// ===================================================================
// DASHBOARD PAGE (dashboard.html)
// ===================================================================

// Show report detail
function showReportDetail(reportId) {
    console.log('Opening report:', reportId);
    
    if (reportId) {
        window.location.href = `reportdetail.html?id=${reportId}`;
    } else {
        alert('Opening report detail. In development mode.');
    }
}

// Initialize dashboard
function initDashboard() {
    console.log('Dashboard initialized');
    
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (currentUser.fullName) {
        // Update greeting based on time
        const hour = new Date().getHours();
        const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
        
        const welcomeTitle = document.querySelector('.welcome-section h2');
        if (welcomeTitle) {
            const firstName = currentUser.fullName.split(' ')[0];
            welcomeTitle.textContent = `${greeting}, ${firstName}! 👋`;
        }
        
        // Update statistics
        const userReports = currentUser.reports || [];
        const totalReports = userReports.length;
        const inProcess = userReports.filter(r => r.status === 'inprocess').length;
        const finished = userReports.filter(r => r.status === 'finished').length;
        const rejected = userReports.filter(r => r.status === 'rejected').length;
        
        // Update stat cards
        const statCards = document.querySelectorAll('.stat-card');
        if (statCards.length >= 4) {
            statCards[0].querySelector('.stat-value').textContent = totalReports;
            statCards[1].querySelector('.stat-value').textContent = inProcess;
            statCards[2].querySelector('.stat-value').textContent = finished;
            statCards[3].querySelector('.stat-value').textContent = rejected;
        }
        
        // Update recent reports section
        const reportsGrid = document.querySelector('.reports-grid');
        if (reportsGrid) {
            // Show only last 4 reports
            const recentReports = userReports.slice(-4).reverse();
            
            if (recentReports.length > 0) {
                reportsGrid.innerHTML = '';
                recentReports.forEach(report => {
                    const reportCard = createReportCard(report);
                    reportsGrid.appendChild(reportCard);
                });
            } else {
                reportsGrid.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; background: white; border-radius: 18px;">
                        <div style="font-size: 60px; margin-bottom: 15px;">📝</div>
                        <h3 style="font-size: 20px; color: #2c3e50; margin-bottom: 8px;">No Reports Yet</h3>
                        <p style="font-size: 14px; color: #7f8c8d; margin-bottom: 20px;">Create your first report to get started!</p>
                        <button class="btn btn-primary" onclick="showPage('createReport')" style="max-width: 200px; margin: 0 auto;">
                            ➕ Create Report
                        </button>
                    </div>
                `;
            }
        }
    }
}

// ===================================================================
// MY REPORTS PAGE (myreport.html)
// ===================================================================

// Filter reports by status
function filterReports(status) {
    console.log('Filtering by:', status);
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    // Filter cards
    const cards = document.querySelectorAll('.report-card');
    cards.forEach(card => {
        if (status === 'all') {
            card.style.display = 'block';
        } else {
            const cardStatus = card.getAttribute('data-status');
            if (cardStatus === status) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

// Search reports
function searchReports(event) {
    const searchTerm = event.target.value.toLowerCase();
    console.log('Searching for:', searchTerm);
    
    const cards = document.querySelectorAll('.report-card');
    cards.forEach(card => {
        const title = card.querySelector('h4')?.textContent.toLowerCase() || '';
        const id = card.querySelector('.report-id')?.textContent.toLowerCase() || '';
        const description = card.querySelector('p')?.textContent.toLowerCase() || '';
        
        if (title.includes(searchTerm) || id.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Initialize reports page
function initReportsPage() {
    console.log('Reports page initialized');
    
    // Get current user and their reports
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userReports = currentUser.reports || [];
    
    console.log('User reports:', userReports);
    
    // Get reports grid container
    const reportsGrid = document.getElementById('reportsGrid');
    
    if (reportsGrid && userReports.length > 0) {
        // Clear existing dummy reports
        reportsGrid.innerHTML = '';
        
        // Render user's actual reports
        userReports.forEach(report => {
            const reportCard = createReportCard(report);
            reportsGrid.appendChild(reportCard);
        });
    } else if (reportsGrid && userReports.length === 0) {
        // Show empty state
        reportsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <div style="font-size: 80px; margin-bottom: 20px;">📋</div>
                <h3 style="font-size: 24px; color: #2c3e50; margin-bottom: 10px;">No Reports Yet</h3>
                <p style="font-size: 16px; color: #7f8c8d; margin-bottom: 30px;">You haven't created any reports yet. Start making a difference in your city!</p>
                <button class="btn btn-primary" onclick="showPage('createReport')" style="max-width: 250px;">
                    ➕ Create Your First Report
                </button>
            </div>
        `;
    }
    
    // Count reports by status
    const allReports = userReports.length;
    const inProcess = userReports.filter(r => r.status === 'inprocess').length;
    const finished = userReports.filter(r => r.status === 'finished').length;
    const rejected = userReports.filter(r => r.status === 'rejected').length;
    
    console.log('Report statistics:', {
        total: allReports,
        inProcess: inProcess,
        finished: finished,
        rejected: rejected
    });
}

// Create report card element
function createReportCard(report) {
    const card = document.createElement('div');
    card.className = 'report-card';
    card.setAttribute('data-status', report.status);
    card.onclick = () => showReportDetail(report.id);
    
    // Get status badge class
    let statusClass = 'status-inprocess';
    let statusText = 'In Process';
    
    if (report.status === 'finished') {
        statusClass = 'status-finished';
        statusText = 'Finished';
    } else if (report.status === 'rejected') {
        statusClass = 'status-rejected';
        statusText = 'Rejected';
    }
    
    // Format date
    const reportDate = formatDate(report.submittedAt || report.date);
    
    // Truncate description
    const description = report.description.length > 100 
        ? report.description.substring(0, 100) + '...' 
        : report.description;
    
    card.innerHTML = `
        <h4>${report.title}</h4>
        <div class="report-id">${report.id}</div>
        <p style="font-size: 14px; color: #7f8c8d; line-height: 1.6;">${description}</p>
        <div class="report-meta">
            <span class="report-date">${reportDate}</span>
            <span class="status-badge ${statusClass}">${statusText}</span>
        </div>
    `;
    
    return card;
}

// ===================================================================
// REPORT DETAIL PAGE (reportdetail.html)
// ===================================================================

// Delete report
function deleteReport() {
    const confirmed = confirm('Are you sure you want to delete this report? This action cannot be undone.');
    
    if (confirmed) {
        // Get report ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const reportId = urlParams.get('id');
        
        if (!reportId) {
            alert('Report ID not found!');
            return;
        }
        
        // Get current user and remove report
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Find user index
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        
        if (userIndex !== -1) {
            // Remove report from user's reports
            users[userIndex].reports = users[userIndex].reports.filter(r => r.id !== reportId);
            
            // Update localStorage
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
            
            console.log('Report deleted:', reportId);
            alert('Report deleted successfully!');
            
            // Redirect to reports page
            setTimeout(() => {
                window.location.href = 'myreport.html';
            }, 500);
        } else {
            alert('User not found!');
        }
    }
}

// Initialize report detail page
function initReportDetail() {
    console.log('======================================');
    console.log('REPORT DETAIL PAGE - DEBUG MODE');
    console.log('======================================');
    
    // Get report ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const reportId = urlParams.get('id');
    
    console.log('1. URL Parameters:', window.location.search);
    console.log('2. Report ID from URL:', reportId);
    
    if (!reportId) {
        console.error('❌ ERROR: No report ID in URL');
        alert('Error: Report ID not found in URL!');
        return;
    }
    
    // Get current user and their reports
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    console.log('3. Current User:', currentUser.fullName);
    
    const userReports = currentUser.reports || [];
    console.log('4. User Reports Count:', userReports.length);
    console.log('5. All Report IDs:', userReports.map(r => r.id));
    
    // Find the specific report
    const report = userReports.find(r => r.id === reportId);
    
    console.log('6. Found Report:', report ? '✅ YES' : '❌ NO');
    
    if (!report) {
        console.error('❌ ERROR: Report not found');
        console.log('Looking for ID:', reportId);
        console.log('Available IDs:', userReports.map(r => r.id).join(', '));
        alert('Report not found! The report may have been deleted or does not exist.');
        setTimeout(() => {
            window.location.href = 'myreport.html';
        }, 2000);
        return;
    }
    
    console.log('7. Report Data:', report);
    console.log('8. Calling populateReportDetail...');
    
    // Populate report detail
    populateReportDetail(report);
    
    console.log('9. ✅ Report Detail Initialized Successfully');
    console.log('======================================');
}

// Populate report detail with actual data
function populateReportDetail(report) {
    console.log('======================================');
    console.log('POPULATING REPORT DETAIL');
    console.log('======================================');
    console.log('Report Data:', report);
    
    // Update report title in header
    const reportHeader = document.getElementById('reportHeaderId');
    console.log('Element reportHeaderId:', reportHeader ? '✅ Found' : '❌ Not Found');
    if (reportHeader) {
        reportHeader.textContent = `Report #${report.id}`;
        console.log('✅ Updated header:', reportHeader.textContent);
    }
    
    // Update main title
    const mainTitle = document.getElementById('reportTitle');
    console.log('Element reportTitle:', mainTitle ? '✅ Found' : '❌ Not Found');
    if (mainTitle) {
        mainTitle.textContent = report.title;
        console.log('✅ Updated title:', mainTitle.textContent);
    }
    
    // Update status badge
    const statusBadge = document.getElementById('reportStatus');
    console.log('Element reportStatus:', statusBadge ? '✅ Found' : '❌ Not Found');
    if (statusBadge) {
        statusBadge.className = 'status-badge';
        
        if (report.status === 'inprocess') {
            statusBadge.classList.add('status-inprocess');
            statusBadge.textContent = 'In Process';
        } else if (report.status === 'finished') {
            statusBadge.classList.add('status-finished');
            statusBadge.textContent = 'Finished';
        } else if (report.status === 'rejected') {
            statusBadge.classList.add('status-rejected');
            statusBadge.textContent = 'Rejected';
        }
        console.log('✅ Updated status:', statusBadge.textContent);
    }
    
    // Update Report ID
    const reportIdEl = document.getElementById('reportId');
    console.log('Element reportId:', reportIdEl ? '✅ Found' : '❌ Not Found');
    if (reportIdEl) {
        reportIdEl.textContent = report.id;
        console.log('✅ Updated ID:', reportIdEl.textContent);
    }
    
    // Update Category
    const categoryEl = document.getElementById('reportCategory');
    console.log('Element reportCategory:', categoryEl ? '✅ Found' : '❌ Not Found');
    if (categoryEl) {
        const category = report.category.charAt(0).toUpperCase() + report.category.slice(1);
        categoryEl.textContent = category;
        console.log('✅ Updated category:', categoryEl.textContent);
    }
    
    // Update Location
    const locationEl = document.getElementById('reportLocation');
    console.log('Element reportLocation:', locationEl ? '✅ Found' : '❌ Not Found');
    if (locationEl) {
        locationEl.textContent = report.location;
        console.log('✅ Updated location:', locationEl.textContent);
    }
    
    // Update Date
    const dateEl = document.getElementById('reportDate');
    console.log('Element reportDate:', dateEl ? '✅ Found' : '❌ Not Found');
    if (dateEl) {
        const submitDate = new Date(report.submittedAt || report.date);
        const formattedDate = submitDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        dateEl.textContent = formattedDate;
        console.log('✅ Updated date:', dateEl.textContent);
    }
    
    // Update Description
    const descriptionEl = document.getElementById('reportDescription');
    console.log('Element reportDescription:', descriptionEl ? '✅ Found' : '❌ Not Found');
    if (descriptionEl) {
        descriptionEl.textContent = report.description;
        console.log('✅ Updated description (first 50 chars):', report.description.substring(0, 50) + '...');
    }
    
    // Update timeline
    console.log('Updating timeline...');
    updateTimeline(report);
    
    console.log('======================================');
    console.log('✅ POPULATION COMPLETE');
    console.log('======================================');
}

// Update status timeline
function updateTimeline(report) {
    const timeline = document.querySelector('.status-timeline');
    if (!timeline) return;
    
    timeline.innerHTML = '';
    
    const submitDate = new Date(report.submittedAt || report.date);
    const formattedDate = submitDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const formattedTime = submitDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Timeline based on status
    if (report.status === 'inprocess') {
        timeline.innerHTML = `
            <div class="timeline-item">
                <div class="timeline-dot status-inprocess"></div>
                <div class="timeline-content">
                    <h4>Report In Process</h4>
                    <p>Your report is being reviewed by our team</p>
                    <span class="timeline-date">${formattedDate} - ${formattedTime}</span>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-dot status-received"></div>
                <div class="timeline-content">
                    <h4>Report Received</h4>
                    <p>We have received your report</p>
                    <span class="timeline-date">${formattedDate} - ${formattedTime}</span>
                </div>
            </div>
        `;
    } else if (report.status === 'finished') {
        timeline.innerHTML = `
            <div class="timeline-item">
                <div class="timeline-dot status-finished"></div>
                <div class="timeline-content">
                    <h4>Report Finished</h4>
                    <p>The issue has been resolved. Thank you for your report!</p>
                    <span class="timeline-date">${formattedDate} - ${formattedTime}</span>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-dot status-inprocess"></div>
                <div class="timeline-content">
                    <h4>Report In Process</h4>
                    <p>Your report was being reviewed by our team</p>
                    <span class="timeline-date">${formattedDate} - ${formattedTime}</span>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-dot status-received"></div>
                <div class="timeline-content">
                    <h4>Report Received</h4>
                    <p>We received your report</p>
                    <span class="timeline-date">${formattedDate} - ${formattedTime}</span>
                </div>
            </div>
        `;
    } else if (report.status === 'rejected') {
        timeline.innerHTML = `
            <div class="timeline-item">
                <div class="timeline-dot status-rejected"></div>
                <div class="timeline-content">
                    <h4>Report Rejected</h4>
                    <p>Unfortunately, your report does not meet our criteria</p>
                    <span class="timeline-date">${formattedDate} - ${formattedTime}</span>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-dot status-received"></div>
                <div class="timeline-content">
                    <h4>Report Received</h4>
                    <p>We received your report</p>
                    <span class="timeline-date">${formattedDate} - ${formattedTime}</span>
                </div>
            </div>
        `;
    }
}

// ===================================================================
// CREATE REPORT PAGE (createreport.html)
// ===================================================================

// Handle file selection
function handleFileSelect(event) {
    const files = event.target.files;
    const fileList = document.getElementById('fileList');
    
    if (!fileList) return;
    
    fileList.innerHTML = '';

    if (files.length > 0) {
        fileList.innerHTML = `<div style="color: #27ae60; font-size: 14px; margin-top: 10px;">✓ ${files.length} file(s) selected:</div>`;
        
        for (let i = 0; i < files.length; i++) {
            const fileSize = (files[i].size / 1024 / 1024).toFixed(2);
            fileList.innerHTML += `<div style="color: #7f8c8d; font-size: 13px; margin-top: 5px;">📄 ${files[i].name} (${fileSize} MB)</div>`;
        }
    }
}

// Handle form submission
function handleSubmitReport(event) {
    event.preventDefault();

    // Get form values
    const title = document.getElementById('reportTitle').value.trim();
    const category = document.getElementById('reportCategory').value;
    const location = document.getElementById('reportLocation').value.trim();
    const description = document.getElementById('reportDescription').value.trim();
    const files = document.getElementById('fileInput').files;

    // Validation
    if (!title || !category || !location || !description) {
        alert('Please fill in all required fields!');
        return;
    }

    if (title.length < 10) {
        alert('Report title must be at least 10 characters!');
        return;
    }

    if (description.length < 20) {
        alert('Description must be at least 20 characters!');
        return;
    }

    // Generate report ID
    const reportId = 'P' + new Date().getFullYear() + 
                   String(new Date().getMonth() + 1).padStart(2, '0') + 
                   String(Math.floor(Math.random() * 10000)).padStart(4, '0');

    // Create report object
    const report = {
        id: reportId,
        title: title,
        category: category,
        location: location,
        description: description,
        filesCount: files.length,
        submittedAt: new Date().toISOString(),
        status: 'inprocess',
        date: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })
    };

    console.log('Report submitted:', report);

    // Store report (in real app, send to backend)
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.email) {
        // Add report to user's reports
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        
        if (userIndex !== -1) {
            if (!users[userIndex].reports) {
                users[userIndex].reports = [];
            }
            users[userIndex].reports.push(report);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
        }
    }

    // Show success message
    const successMessage = document.getElementById('successMessage');
    const newReportId = document.getElementById('newReportId');
    
    if (successMessage && newReportId) {
        newReportId.textContent = reportId;
        successMessage.classList.add('show');
    }

    // Reset form
    document.getElementById('createReportForm').reset();
    document.getElementById('fileList').innerHTML = '';

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Hide success message and redirect after 3 seconds
    setTimeout(() => {
        if (successMessage) {
            successMessage.classList.remove('show');
        }
        alert('Report submitted successfully! Redirecting to dashboard...');
        window.location.href = 'dashboard.html';
    }, 3000);
}

// Handle cancel
function handleCancel() {
    const confirmed = confirm('Are you sure you want to cancel? All unsaved data will be lost.');
    
    if (confirmed) {
        document.getElementById('createReportForm').reset();
        const fileList = document.getElementById('fileList');
        if (fileList) {
            fileList.innerHTML = '';
        }
        window.location.href = 'dashboard.html';
    }
}

// Initialize create report page with drag & drop
function initCreateReport() {
    console.log('Create report page initialized');

    const fileUpload = document.querySelector('.file-upload');
    
    if (fileUpload) {
        // Drag over
        fileUpload.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUpload.style.background = '#e8f4f8';
            fileUpload.style.borderColor = '#3498db';
        });

        // Drag leave
        fileUpload.addEventListener('dragleave', (e) => {
            e.preventDefault();
            fileUpload.style.background = '';
            fileUpload.style.borderColor = '#bdc3c7';
        });

        // Drop
        fileUpload.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUpload.style.background = '';
            fileUpload.style.borderColor = '#bdc3c7';
            
            const files = e.dataTransfer.files;
            const fileInput = document.getElementById('fileInput');
            
            if (fileInput) {
                fileInput.files = files;
                handleFileSelect({ target: { files: files } });
            }
        });
    }
}

// ===================================================================
// PROFILE PAGE (profile.html)
// ===================================================================

// Edit profile
function editProfile() {
    alert('Edit Profile feature. In a real app, this would open an edit form modal.');
    console.log('Opening edit profile...');
}

// Open setting
function openSetting(setting) {
    const settingNames = {
        notifications: 'Notification Settings',
        password: 'Change Password',
        theme: 'Display Mode',
        language: 'Language Settings'
    };
    
    console.log('Opening:', settingNames[setting]);
    alert(`Opening ${settingNames[setting]}. In a real app, this would open the ${setting} settings page.`);
}

// Open help
function openHelp(section) {
    const helpSections = {
        faq: 'Help Center (FAQs)',
        contact: 'Contact Us',
        privacy: 'Privacy Policy',
        about: 'About SpeakOut'
    };
    
    console.log('Opening:', helpSections[section]);
    alert(`Opening ${helpSections[section]}. In a real app, this would show the ${section} page.`);
}

// Initialize profile page
function initProfile() {
    console.log('Profile page initialized');
    
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (currentUser.fullName) {
        // Update profile info
        const profileName = document.querySelector('.profile-card h2');
        const profileEmails = document.querySelectorAll('.profile-card p');
        
        if (profileName) profileName.textContent = currentUser.fullName;
        if (profileEmails[0]) profileEmails[0].textContent = currentUser.email;
        if (profileEmails[1] && currentUser.city) {
            profileEmails[1].textContent = currentUser.city.charAt(0).toUpperCase() + currentUser.city.slice(1) + ', Indonesia';
        }
        
        // Update avatar initials
        const profileAvatar = document.querySelector('.profile-avatar-large');
        if (profileAvatar) {
            const initials = currentUser.fullName
                .split(' ')
                .map(name => name[0])
                .join('')
                .substring(0, 2)
                .toUpperCase();
            profileAvatar.textContent = initials;
        }
        
        // Update stats with REAL data
        const userReports = currentUser.reports || [];
        const totalReports = userReports.length;
        const finished = userReports.filter(r => r.status === 'finished').length;
        const inProcess = userReports.filter(r => r.status === 'inprocess').length;
        
        // Update stat values
        const statValues = document.querySelectorAll('.profile-stat-value');
        if (statValues.length >= 3) {
            statValues[0].textContent = totalReports;
            statValues[1].textContent = finished;
            statValues[2].textContent = inProcess;
        }
        
        console.log('User statistics:', {
            totalReports,
            finished,
            inProcess,
            rejected: totalReports - finished - inProcess
        });
    }
    
    // Add hover effects to menu cards
    document.querySelectorAll('.menu-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// ===================================================================
// PAGE INITIALIZATION
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('SpeakOut System Initialized');
    
    // Update user info on ALL pages first
    updateUserInfoGlobal();
    
    // Get current page
    const currentPage = window.location.pathname.split('/').pop();
    
    // Initialize based on current page
    switch(currentPage) {
        case 'regist.html':
            console.log('Registration page loaded');
            break;
            
        case 'dashboard.html':
            initDashboard();
            break;
            
        case 'myreport.html':
            initReportsPage();
            break;
            
        case 'reportdetail.html':
            initReportDetail();
            break;
            
        case 'createreport.html':
            initCreateReport();
            break;
            
        case 'profile.html':
            initProfile();
            break;
            
        default:
            console.log('Page loaded:', currentPage);
    }
});

// ===================================================================
// UTILITY FUNCTIONS
// ===================================================================

// Format date to readable format
function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    }
}

// Generate random report ID
function generateReportId() {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    return `P${year}${month}${random}`;
}

// Check if user is logged in
function isLoggedIn() {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser !== null;
}

// Protect page (redirect to login if not logged in)
function protectPage() {
    if (!isLoggedIn()) {
        alert('Please login first!');
        window.location.href = '../index.html';
    }
}

console.log('✅ SpeakOut JavaScript loaded successfully!');