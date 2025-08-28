/**
 * KnowledgeBot MVP - Onboarding Interface
 * Handles new employee onboarding workflow, checklists, and FAQ
 */
const document = window.document;

class OnboardingInterface {
    constructor() {
        this.onboardingData = {};
        this.currentStep = 0;
        this.init();
    }

    init() {
        this.bindEventListeners();
        this.loadOnboardingContent();
    }

    bindEventListeners() {
        // Checklist interactions will be handled by rendered elements
    }

    loadOnboardingContent() {
        this.populateFAQ();
        this.initializeChecklist();
        this.createOnboardingTimeline();
    }

    populateFAQ() {
        const faqContainer = document.getElementById('onboardingFAQ');
        const faqs = [
            {
                question: "When do I start work?",
                answer: "Your first day is confirmed in your offer letter. Please arrive at 9:00 AM at the main reception desk."
            },
            {
                question: "What should I bring on my first day?",
                answer: "Please bring a government-issued photo ID, completed I-9 documentation, and any signed paperwork from HR."
            },
            {
                question: "How do I access company systems?",
                answer: "IT will set up your accounts on your first day. You'll receive login credentials and a temporary password to change."
            },
            {
                question: "Who is my manager?",
                answer: "Your direct manager information is in your welcome email. You'll meet them during your first-day orientation."
            },
            {
                question: "What's the dress code?",
                answer: "We have a business casual dress code. Refer to the employee handbook for detailed guidelines."
            },
            {
                question: "How do I request time off?",
                answer: "Use the HR portal to submit time-off requests. Vacation requires 2 weeks advance notice when possible."
            },
            {
                question: "Where can I find company policies?",
                answer: "All policies are available in the employee handbook, accessible through our company portal."
            },
            {
                question: "How do I join the health insurance plan?",
                answer: "HR will guide you through benefit enrollment during your first week. You have 30 days to make elections."
            }
        ];

        faqs.forEach((faq, index) => {
            const faqElement = document.createElement('div');
            faqElement.className = 'border border-gray-200 rounded-lg mb-3';
            faqElement.innerHTML = `
                <button class="faq-question w-full text-left p-3 hover:bg-gray-50 flex items-center justify-between" 
                        onclick="onboardingInterface.toggleFAQ(${index})">
                    <span class="font-medium">${faq.question}</span>
                    <i class="fas fa-chevron-down transition-transform" id="faq-icon-${index}"></i>
                </button>
                <div class="faq-answer hidden p-3 pt-0 text-gray-600" id="faq-answer-${index}">
                    ${faq.answer}
                </div>
            `;
            faqContainer.appendChild(faqElement);
        });
    }

    toggleFAQ(index) {
        const answer = document.getElementById(`faq-answer-${index}`);
        const icon = document.getElementById(`faq-icon-${index}`);
        
        if (answer.classList.contains('hidden')) {
            answer.classList.remove('hidden');
            icon.style.transform = 'rotate(180deg)';
        } else {
            answer.classList.add('hidden');
            icon.style.transform = 'rotate(0deg)';
        }
    }

    initializeChecklist() {
        // Enhanced checklist with more detailed items
        const checklistContainer = document.querySelector('.bg-blue-50');
        const detailedChecklist = [
            {
                id: 'welcome',
                title: 'Welcome & Company Overview',
                completed: true,
                items: [
                    'Company mission and values presentation',
                    'Organizational chart review',
                    'Office tour and facilities introduction',
                    'Meet key team members'
                ]
            },
            {
                id: 'hr-setup',
                title: 'HR Policies & Benefits',
                completed: false,
                items: [
                    'Complete I-9 verification',
                    'Review and sign employee handbook',
                    'Benefits enrollment session',
                    'Set up direct deposit',
                    'Emergency contact information'
                ]
            },
            {
                id: 'it-setup',
                title: 'IT Setup & Security',
                completed: false,
                items: [
                    'Receive laptop and equipment',
                    'Set up email and system accounts',
                    'Install required software',
                    'Security training completion',
                    'VPN and access configuration'
                ]
            },
            {
                id: 'role-training',
                title: 'Role-Specific Training',
                completed: false,
                items: [
                    'Job responsibilities overview',
                    'Department processes training',
                    'Tools and systems training',
                    'Shadow experienced team members',
                    'First project assignment'
                ]
            },
            {
                id: 'integration',
                title: 'Team Integration',
                completed: false,
                items: [
                    'Meet with assigned buddy/mentor',
                    'Attend team meetings',
                    'Social integration activities',
                    '30-day check-in scheduling'
                ]
            }
        ];

        // Replace the simple checklist with the detailed version
        const newChecklistHTML = `
            <div class="bg-blue-50 rounded-lg p-4 mb-6">
                <h3 class="font-medium text-blue-900 mb-4">New Employee Onboarding Progress</h3>
                <div id="detailedChecklist" class="space-y-4">
                    ${detailedChecklist.map(section => this.renderChecklistSection(section)).join('')}
                </div>
                
                <div class="mt-4 pt-4 border-t border-blue-200">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-blue-900">Overall Progress</span>
                        <span class="text-sm text-blue-700" id="progressText">1 of 5 completed</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill bg-blue-500" style="width: 20%" id="progressBar"></div>
                    </div>
                </div>
            </div>
        `;

        checklistContainer.outerHTML = newChecklistHTML;
    }

    renderChecklistSection(section) {
        const completedItems = section.completed ? section.items.length : 0;
        
        return `
            <div class="border border-blue-200 rounded-lg p-3 bg-white">
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center">
                        <input type="checkbox" ${section.completed ? 'checked' : ''} 
                               class="mr-3 text-blue-600 rounded focus:ring-blue-500" 
                               id="section-${section.id}"
                               onchange="onboardingInterface.toggleSection('${section.id}')">
                        <span class="font-medium text-gray-900">${section.title}</span>
                    </div>
                    <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        ${completedItems}/${section.items.length}
                    </span>
                </div>
                
                <div class="ml-6 space-y-1" id="items-${section.id}">
                    ${section.items.map((item, index) => `
                        <div class="flex items-center text-sm">
                            <input type="checkbox" ${section.completed ? 'checked' : ''} 
                                   class="mr-2 text-blue-600 rounded focus:ring-blue-500 text-xs" 
                                   id="item-${section.id}-${index}"
                                   onchange="onboardingInterface.updateSectionProgress('${section.id}')">
                            <span class="text-gray-700">${item}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    toggleSection(sectionId) {
        const sectionCheckbox = document.getElementById(`section-${sectionId}`);
        const isChecked = sectionCheckbox.checked;
        
        // Update all items in the section
        const itemsContainer = document.getElementById(`items-${sectionId}`);
        const itemCheckboxes = itemsContainer.querySelectorAll('input[type="checkbox"]');
        
        itemCheckboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
        });
        
        this.updateOverallProgress();
        
        if (isChecked) {
            window.app?.showToast(`Completed: ${sectionCheckbox.nextElementSibling.textContent}`, 'success');
        }
    }

    updateSectionProgress(sectionId) {
        const itemsContainer = document.getElementById(`items-${sectionId}`);
        const itemCheckboxes = itemsContainer.querySelectorAll('input[type="checkbox"]');
        const sectionCheckbox = document.getElementById(`section-${sectionId}`);
        
        const totalItems = itemCheckboxes.length;
        const completedItems = Array.from(itemCheckboxes).filter(cb => cb.checked).length;
        
        // Update section checkbox state
        if (completedItems === totalItems) {
            sectionCheckbox.checked = true;
            sectionCheckbox.indeterminate = false;
        } else if (completedItems > 0) {
            sectionCheckbox.checked = false;
            sectionCheckbox.indeterminate = true;
        } else {
            sectionCheckbox.checked = false;
            sectionCheckbox.indeterminate = false;
        }
        
        // Update section counter
        const counter = sectionCheckbox.parentElement.parentElement.querySelector('.text-xs');
        counter.textContent = `${completedItems}/${totalItems}`;
        
        this.updateOverallProgress();
    }

    updateOverallProgress() {
        const sectionCheckboxes = document.querySelectorAll('[id^="section-"]');
        const totalSections = sectionCheckboxes.length;
        const completedSections = Array.from(sectionCheckboxes).filter(cb => cb.checked).length;
        
        const progressPercent = Math.round((completedSections / totalSections) * 100);
        
        document.getElementById('progressText').textContent = `${completedSections} of ${totalSections} completed`;
        document.getElementById('progressBar').style.width = `${progressPercent}%`;
        
        // Show completion message
        if (completedSections === totalSections) {
            this.showCompletionCelebration();
        }
    }

    showCompletionCelebration() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-lg max-w-md w-full p-6 text-center">
                <div class="text-6xl mb-4">🎉</div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Congratulations!</h3>
                <p class="text-gray-600 mb-4">You've completed your onboarding checklist! Welcome to the team!</p>
                <div class="space-y-2 text-sm text-gray-500 mb-4">
                    <p>✅ All setup tasks completed</p>
                    <p>✅ Ready to start contributing</p>
                    <p>✅ Feedback survey will be sent soon</p>
                </div>
                <button onclick="this.closest('.fixed').remove()" class="btn-primary w-full">
                    Great! Let's get started
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Confetti effect (simple)
        setTimeout(() => {
            for (let i = 0; i < 50; i++) {
                this.createConfetti();
            }
        }, 200);
    }

    createConfetti() {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: hsl(${Math.random() * 360}, 70%, 60%);
            left: ${Math.random() * 100}vw;
            top: -10px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: confetti-fall 3s linear forwards;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }

    createOnboardingTimeline() {
        // Add a timeline section after the FAQ
        const onboardingInterface = document.getElementById('onboardingInterface');
        const timelineSection = document.createElement('div');
        timelineSection.className = 'bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6';
        
        timelineSection.innerHTML = `
            <h3 class="text-lg font-medium text-gray-900 mb-6">Your First 90 Days</h3>
            
            <div class="space-y-6">
                <div class="flex">
                    <div class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                        <i class="fas fa-check text-green-600 text-sm"></i>
                    </div>
                    <div class="flex-1">
                        <h4 class="font-medium text-gray-900">Week 1: Getting Started</h4>
                        <p class="text-gray-600 text-sm mt-1">Complete onboarding checklist, meet your team, and get familiar with our tools and processes.</p>
                    </div>
                </div>
                
                <div class="flex">
                    <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <span class="text-blue-600 text-sm font-medium">30</span>
                    </div>
                    <div class="flex-1">
                        <h4 class="font-medium text-gray-900">30-Day Review</h4>
                        <p class="text-gray-600 text-sm mt-1">Check-in with your manager, review initial goals, and provide feedback on your onboarding experience.</p>
                    </div>
                </div>
                
                <div class="flex">
                    <div class="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                        <span class="text-yellow-600 text-sm font-medium">60</span>
                    </div>
                    <div class="flex-1">
                        <h4 class="font-medium text-gray-900">60-Day Milestone</h4>
                        <p class="text-gray-600 text-sm mt-1">Performance review, goal adjustments, and planning for your continued development.</p>
                    </div>
                </div>
                
                <div class="flex">
                    <div class="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                        <span class="text-purple-600 text-sm font-medium">90</span>
                    </div>
                    <div class="flex-1">
                        <h4 class="font-medium text-gray-900">90-Day Success Review</h4>
                        <p class="text-gray-600 text-sm mt-1">Comprehensive review, celebrate achievements, and set long-term career development goals.</p>
                    </div>
                </div>
            </div>
            
            <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                <div class="flex items-center">
                    <i class="fas fa-lightbulb text-blue-600 mr-2"></i>
                    <span class="font-medium text-blue-900">Pro Tip:</span>
                </div>
                <p class="text-blue-800 text-sm mt-1">Don't hesitate to ask questions! Your assigned buddy and team members are here to help you succeed.</p>
            </div>
        `;
        
        onboardingInterface.appendChild(timelineSection);
    }

    // Helper method to start a quick onboarding chat
    startOnboardingChat() {
        if (window.app) {
            window.app.switchTab('chat');
            setTimeout(() => {
                if (window.chatInterface) {
                    window.chatInterface.updateSuggestedQuestions([
                        "What should I do on my first day?",
                        "How do I set up my benefits?",
                        "Who is my assigned buddy?",
                        "Where can I find the employee handbook?"
                    ]);
                    
                    window.chatInterface.addBotMessage(
                        "Hi! I see you're going through onboarding. I'm here to help answer any questions you might have about your first days at the company. What would you like to know?"
                    );
                }
            }, 500);
        }
    }
}

// Add CSS for confetti animation
const style = document.createElement('style');
style.textContent = `
    @keyframes confetti-fall {
        0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize onboarding interface when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.onboardingInterface = new OnboardingInterface();
});
