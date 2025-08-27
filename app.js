/**
 * KnowledgeBot MVP - Main Application Controller
 * Handles navigation, UI state management, and general functionality
 */

class KnowledgeBotApp {
    constructor() {
        this.currentTab = 'chat';
        this.init();
    }

    init() {
        this.bindEventListeners();
        this.showWelcomeMessage();
        this.initializeInterface();
    }

    bindEventListeners() {
        // Navigation tabs
        document.getElementById('chatTab').addEventListener('click', () => this.switchTab('chat'));
        document.getElementById('documentsTab').addEventListener('click', () => this.switchTab('documents'));
        document.getElementById('onboardingTab').addEventListener('click', () => this.switchTab('onboarding'));

        // Quick actions
        document.getElementById('newEmployeeBtn').addEventListener('click', () => this.startOnboarding());
        document.getElementById('uploadDocBtn').addEventListener('click', () => this.switchTab('documents'));

        // Settings and utilities
        document.getElementById('settingsBtn').addEventListener('click', () => this.openSettings());
        document.getElementById('clearChatBtn').addEventListener('click', () => this.clearChat());
        document.getElementById('exportChatBtn').addEventListener('click', () => this.exportChat());

        // Category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectCategory(e.target.closest('.category-btn')));
        });

        // Quick search
        document.getElementById('quickSearch').addEventListener('input', (e) => this.performQuickSearch(e.target.value));

        // Mobile navigation
        document.getElementById('mobileMenuBtn').addEventListener('click', () => this.toggleMobileMenu());
        document.getElementById('mobileChat').addEventListener('click', () => this.switchTab('chat'));
        document.getElementById('mobileDocuments').addEventListener('click', () => this.switchTab('documents'));  
        document.getElementById('mobileOnboarding').addEventListener('click', () => this.switchTab('onboarding'));
    }

    switchTab(tabName) {
        // Update active tab styling (desktop)
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
            tab.classList.add('text-gray-600');
            tab.classList.remove('text-brand-blue', 'border-brand-blue');
        });

        const activeTab = document.getElementById(tabName + 'Tab');
        if (activeTab) {
            activeTab.classList.add('active', 'text-brand-blue', 'border-b-2', 'border-brand-blue');
            activeTab.classList.remove('text-gray-600');
        }

        // Update mobile navigation styling
        document.querySelectorAll('.mobile-nav-tab').forEach(tab => {
            tab.classList.remove('active');
            const icon = tab.querySelector('i');
            if (icon) {
                icon.classList.remove('text-brand-blue');
                icon.classList.add('text-gray-600');
            }
        });

        const activeMobileTab = document.getElementById('mobile' + tabName.charAt(0).toUpperCase() + tabName.slice(1));
        if (activeMobileTab) {
            activeMobileTab.classList.add('active');
            const icon = activeMobileTab.querySelector('i');
            if (icon) {
                icon.classList.remove('text-gray-600');
                icon.classList.add('text-brand-blue');
            }
        }

        // Hide mobile menu after selection
        this.closeMobileMenu();

        // Hide all content panels
        document.querySelectorAll('.content-panel').forEach(panel => {
            panel.classList.add('hidden');
        });

        // Show selected panel
        document.getElementById(tabName + 'Interface').classList.remove('hidden');
        this.currentTab = tabName;

        // Analytics tracking (simulation)
        this.trackEvent('tab_switched', { tab: tabName });
    }

    selectCategory(categoryBtn) {
        // Update category selection
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        categoryBtn.classList.add('active');

        const category = categoryBtn.dataset.category;
        this.loadCategoryContent(category);
        
        // If on chat tab, suggest relevant questions
        if (this.currentTab === 'chat') {
            this.updateSuggestedQuestions(category);
        }
    }

    loadCategoryContent(category) {
        const categoryData = {
            hr: {
                name: 'HR & Policies',
                suggestions: [
                    'What are the vacation policies?',
                    'How do I request time off?',
                    'What benefits are available?',
                    'What is the dress code policy?'
                ]
            },
            finance: {
                name: 'Finance',
                suggestions: [
                    'How do I submit expense reports?',
                    'What is the reimbursement process?',
                    'When are salaries paid?',
                    'How do I access my payslips?'
                ]
            },
            operations: {
                name: 'Operations',
                suggestions: [
                    'What are the office hours?',
                    'How do I book meeting rooms?',
                    'What is the remote work policy?',
                    'How do I report facility issues?'
                ]
            },
            legal: {
                name: 'Legal & Compliance',
                suggestions: [
                    'What are the confidentiality policies?',
                    'How do I report compliance issues?',
                    'What are the data protection rules?',
                    'What is the code of conduct?'
                ]
            },
            tech: {
                name: 'IT & Tech',
                suggestions: [
                    'How do I reset my password?',
                    'How do I request IT support?',
                    'What software is available?',
                    'How do I access VPN?'
                ]
            }
        };

        const data = categoryData[category];
        if (data && this.currentTab === 'chat') {
            this.updateSuggestedQuestions(category);
        }
    }

    updateSuggestedQuestions(category) {
        const suggestions = {
            hr: [
                'What are the vacation policies?',
                'How do I request time off?',
                'What benefits are available?'
            ],
            finance: [
                'How do I submit expense reports?',
                'What is the reimbursement process?',
                'When are salaries paid?'
            ],
            operations: [
                'What are the office hours?',
                'How do I book meeting rooms?',
                'What is the remote work policy?'
            ],
            legal: [
                'What are the confidentiality policies?',
                'How do I report compliance issues?',
                'What are the data protection rules?'
            ],
            tech: [
                'How do I reset my password?',
                'How do I request IT support?',
                'What software is available?'
            ]
        };

        if (window.chatInterface) {
            window.chatInterface.updateSuggestedQuestions(suggestions[category] || []);
        }
    }

    performQuickSearch(query) {
        if (query.length < 2) return;

        // Simulate search results
        const mockResults = [
            { title: 'Employee Handbook', category: 'HR', relevance: 0.9 },
            { title: 'Vacation Policy', category: 'HR', relevance: 0.8 },
            { title: 'IT Support Guide', category: 'Tech', relevance: 0.7 },
            { title: 'Expense Reporting', category: 'Finance', relevance: 0.6 }
        ].filter(result => 
            result.title.toLowerCase().includes(query.toLowerCase()) ||
            result.category.toLowerCase().includes(query.toLowerCase())
        );

        this.displaySearchResults(mockResults);
    }

    displaySearchResults(results) {
        // This would typically show a dropdown with results
        // For now, we'll just log them
        console.log('Search results:', results);
    }

    startOnboarding() {
        this.switchTab('onboarding');
        this.showToast('Starting new employee onboarding process...', 'success');
    }

    clearChat() {
        if (confirm('Are you sure you want to clear the chat history?')) {
            if (window.chatInterface) {
                window.chatInterface.clearMessages();
            }
            this.showToast('Chat history cleared', 'success');
        }
    }

    exportChat() {
        if (window.chatInterface) {
            const messages = window.chatInterface.getMessages();
            const exportData = {
                timestamp: new Date().toISOString(),
                messages: messages,
                user: 'Demo User'
            };
            
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `chat-export-${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            this.showToast('Chat exported successfully', 'success');
        }
    }

    openSettings() {
        // Simulate settings modal
        this.showToast('Settings panel would open here in full implementation', 'warning');
    }

    showWelcomeMessage() {
        // This will be handled by the chat interface
        setTimeout(() => {
            if (window.chatInterface) {
                window.chatInterface.addBotMessage(
                    "Hello! I'm KnowledgeBot, your company knowledge assistant. I can help you find information about policies, procedures, and answer questions about our company. How can I help you today?"
                );
            }
        }, 1000);
    }

    initializeInterface() {
        // Initialize suggested questions for chat
        setTimeout(() => {
            if (window.chatInterface) {
                const defaultSuggestions = [
                    "What are the company's core values?",
                    "How do I request time off?",
                    "What benefits are available?",
                    "Who should I contact for IT support?"
                ];
                window.chatInterface.updateSuggestedQuestions(defaultSuggestions);
            }
        }, 1500);
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        const menuBtn = document.getElementById('mobileMenuBtn');
        const icon = menuBtn.querySelector('i');
        
        if (mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.remove('hidden');
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            mobileMenu.classList.add('hidden');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }

    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        const menuBtn = document.getElementById('mobileMenuBtn');
        const icon = menuBtn.querySelector('i');
        
        mobileMenu.classList.add('hidden');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }

    trackEvent(eventName, properties = {}) {
        // Simulate analytics tracking
        console.log(`Analytics: ${eventName}`, properties);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new KnowledgeBotApp();
});