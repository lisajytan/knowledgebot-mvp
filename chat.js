/**
 * KnowledgeBot MVP - Chat Interface
 * Handles chat functionality, message display, and mock AI responses
 */

class ChatInterface {
    constructor() {
        this.messages = [];
        this.isTyping = false;
        this.init();
    }

    init() {
        this.bindEventListeners();
        this.loadMockData();
    }

    bindEventListeners() {
        const chatInput = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendBtn');
        const voiceBtn = document.getElementById('voiceBtn');

        // Send message on Enter key or button click
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        sendBtn.addEventListener('click', () => this.sendMessage());
        voiceBtn.addEventListener('click', () => this.startVoiceInput());

        // Auto-resize chat input
        chatInput.addEventListener('input', (e) => {
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
        });
    }

    sendMessage() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();
        
        if (!message || this.isTyping) return;

        // Add user message
        this.addUserMessage(message);
        chatInput.value = '';
        chatInput.style.height = 'auto';

        // Show typing indicator and generate response
        this.showTypingIndicator();
        setTimeout(() => {
            this.generateMockResponse(message);
        }, 1000 + Math.random() * 2000); // Simulate variable response time
    }

    addUserMessage(message) {
        const messageObj = {
            id: Date.now(),
            type: 'user',
            content: message,
            timestamp: new Date()
        };
        
        this.messages.push(messageObj);
        this.renderMessage(messageObj);
        this.scrollToBottom();
    }

    addBotMessage(message, isHtml = false) {
        this.hideTypingIndicator();
        
        const messageObj = {
            id: Date.now(),
            type: 'bot',
            content: message,
            timestamp: new Date(),
            isHtml: isHtml
        };
        
        this.messages.push(messageObj);
        this.renderMessage(messageObj);
        this.scrollToBottom();
    }

    renderMessage(messageObj) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${messageObj.type}`;
        messageDiv.dataset.messageId = messageObj.id;

        const avatar = messageObj.type === 'user' ? 
            '<div class="message-avatar"><i class="fas fa-user"></i></div>' :
            '<div class="message-avatar"><i class="fas fa-robot"></i></div>';

        const content = messageObj.isHtml ? messageObj.content : this.escapeHtml(messageObj.content);
        
        messageDiv.innerHTML = `
            ${messageObj.type === 'bot' ? avatar : ''}
            <div class="message-content">
                ${content}
                <div class="message-timestamp">${this.formatTime(messageObj.timestamp)}</div>
            </div>
            ${messageObj.type === 'user' ? avatar : ''}
        `;

        chatMessages.appendChild(messageDiv);
    }

    showTypingIndicator() {
        if (this.isTyping) return;
        
        this.isTyping = true;
        const chatMessages = document.getElementById('chatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot';
        typingDiv.id = 'typingIndicator';
        
        typingDiv.innerHTML = `
            <div class="message-avatar"><i class="fas fa-robot"></i></div>
            <div class="typing-indicator">
                <span class="text-sm text-gray-500 mr-2">KnowledgeBot is typing</span>
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;

        chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        this.isTyping = false;
    }

    generateMockResponse(userMessage) {
        const response = this.getMockResponse(userMessage.toLowerCase());
        this.addBotMessage(response.content, response.isHtml);
        
        // Update suggested questions based on context
        if (response.suggestions) {
            this.updateSuggestedQuestions(response.suggestions);
        }
    }

    getMockResponse(message) {
        // Mock knowledge base responses
        const responses = {
            // Greetings
            hello: {
                content: "Hello! I'm here to help you with any company-related questions. You can ask me about policies, procedures, benefits, or anything else you'd like to know about our organization.",
                suggestions: ["What are the company values?", "How do I request time off?", "What benefits are available?"]
            },
            
            // HR & Policies
            vacation: {
                content: `Our vacation policy includes:

• **Annual Leave**: 20 days per year for full-time employees
• **Sick Leave**: 10 days per year
• **Personal Days**: 3 days per year
• **Holiday Schedule**: 12 company holidays annually

To request time off, please use our HR portal or speak with your manager at least 2 weeks in advance for vacation requests.`,
                suggestions: ["How do I access the HR portal?", "What happens to unused vacation days?", "Can I take unpaid leave?"]
            },
            
            benefits: {
                content: `We offer a comprehensive benefits package:

**Health & Wellness:**
• Health insurance (medical, dental, vision)
• Mental health support and counseling services
• Gym membership reimbursement

**Financial:**
• 401(k) with company matching up to 6%
• Life insurance coverage
• Flexible Spending Account (FSA)

**Work-Life Balance:**
• Flexible work hours
• Remote work options
• Professional development budget ($2,000/year)`,
                suggestions: ["How do I enroll in benefits?", "What is the 401k matching policy?", "Can I work remotely full-time?"]
            },
            
            // IT & Tech Support
            password: {
                content: `To reset your password:

1. **Self-Service Portal**: Visit portal.company.com/reset
2. **IT Helpdesk**: Call ext. 4357 or email help@company.com
3. **In Person**: Visit the IT department on Floor 3

**Security Requirements:**
• Minimum 12 characters
• Must include uppercase, lowercase, numbers, and symbols
• Cannot reuse last 5 passwords
• Expires every 90 days`,
                suggestions: ["How do I set up two-factor authentication?", "What software is available?", "How do I access VPN?"]
            },
            
            support: {
                content: `IT Support Options:

**Immediate Help:**
• IT Helpdesk: ext. 4357 (8 AM - 6 PM)
• Emergency Support: ext. 911 (after hours)
• Live Chat: Available on company intranet

**Common Issues:**
• Password resets
• Software installation requests
• Hardware troubleshooting
• Network connectivity issues

**Response Times:**
• Critical issues: 30 minutes
• Standard requests: 4 hours
• Software requests: 1-2 business days`,
                suggestions: ["How do I request new software?", "What is considered a critical issue?", "Can I install software myself?"]
            },
            
            // Finance
            expenses: {
                content: `Expense Reporting Process:

1. **Submit Receipts**: Use Expensify app or web portal
2. **Categories**: Meals, Travel, Office Supplies, Client Entertainment
3. **Approval**: Manager approval required for amounts >$100
4. **Reimbursement**: Processed with next payroll (bi-weekly)

**Limits:**
• Meals: $75/day domestic, $100/day international
• Hotel: Reasonable business rate
• Mileage: IRS standard rate (currently $0.65/mile)

**Required Documentation**: Original receipts for all expenses >$25`,
                suggestions: ["What expenses are reimbursable?", "How do I use Expensify?", "What if I lost a receipt?"]
            },
            
            // Company Culture
            values: {
                content: `Our Core Values:

**🎯 Excellence**: We strive for the highest quality in everything we do
**🤝 Integrity**: We act with honesty and transparency
**💡 Innovation**: We embrace creativity and continuous improvement
**🌟 Respect**: We value diversity and treat everyone with dignity
**⚡ Agility**: We adapt quickly to change and embrace challenges

These values guide our decision-making, shape our culture, and define how we work together to achieve our mission of delivering exceptional value to our clients.`,
                suggestions: ["What is our company mission?", "How are values reflected in reviews?", "What are our diversity initiatives?"]
            },
            
            // Onboarding
            onboarding: {
                content: `New Employee Onboarding Checklist:

**Week 1:**
✅ IT setup and system access
✅ Complete HR paperwork
✅ Attend orientation session
✅ Meet your team and manager
✅ Review job responsibilities

**Week 2:**
⏳ Shadow experienced team members
⏳ Begin initial training modules
⏳ Set up 30/60/90 day goals

**Resources:**
• Employee handbook (digital copy in portal)
• Training materials and videos
• Buddy system - assigned mentor
• Regular check-ins with HR and manager`,
                suggestions: ["Who is my assigned buddy?", "Where can I find training materials?", "When is my first review?"]
            }
        };

        // Keyword matching
        for (const [key, response] of Object.entries(responses)) {
            if (message.includes(key) || 
                message.includes(key + 's') || 
                message.includes(key.slice(0, -1))) {
                return response;
            }
        }

        // Default response for unmatched queries
        return {
            content: `I understand you're asking about "${message}". While I don't have specific information on that topic in my current knowledge base, I can help you with:

• HR policies and benefits
• IT support and troubleshooting
• Expense reporting and finance procedures
• Company culture and values
• New employee onboarding

Please try rephrasing your question or select from the suggested topics below. For complex queries, I can connect you with the appropriate department.`,
            suggestions: [
                "Contact HR department",
                "Contact IT support", 
                "View company directory",
                "Access employee handbook"
            ]
        };
    }

    updateSuggestedQuestions(questions) {
        const container = document.getElementById('suggestedQuestions');
        container.innerHTML = '';
        
        questions.forEach(question => {
            const button = document.createElement('button');
            button.className = 'suggested-question';
            button.textContent = question;
            button.addEventListener('click', () => {
                document.getElementById('chatInput').value = question;
                this.sendMessage();
            });
            container.appendChild(button);
        });
    }

    startVoiceInput() {
        // Simulate voice input
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                document.getElementById('voiceBtn').innerHTML = '<i class="fas fa-stop text-red-500"></i>';
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('chatInput').value = transcript;
            };

            recognition.onend = () => {
                document.getElementById('voiceBtn').innerHTML = '<i class="fas fa-microphone"></i>';
            };

            recognition.onerror = () => {
                window.app?.showToast('Voice input not supported or microphone access denied', 'error');
            };

            recognition.start();
        } else {
            window.app?.showToast('Voice input not supported in this browser', 'warning');
        }
    }

    clearMessages() {
        this.messages = [];
        document.getElementById('chatMessages').innerHTML = '';
        this.updateSuggestedQuestions([
            "What are the company's core values?",
            "How do I request time off?",
            "What benefits are available?",
            "Who should I contact for IT support?"
        ]);
    }

    getMessages() {
        return this.messages;
    }

    scrollToBottom() {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    formatTime(timestamp) {
        return timestamp.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    loadMockData() {
        // Add some initial conversation history for demonstration
        setTimeout(() => {
            this.addBotMessage("Welcome to KnowledgeBot! I'm your AI-powered company assistant, ready to help with any questions about policies, procedures, benefits, and more. What would you like to know?");
        }, 500);
    }
}

// Initialize chat interface when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatInterface = new ChatInterface();
});