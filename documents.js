/**
 * KnowledgeBot MVP - Documents Interface
 * Handles file upload simulation, document management, and processing status
 */

class DocumentsInterface {
    constructor() {
        this.documents = [];
        this.uploadQueue = [];
        this.init();
    }

    init() {
        this.bindEventListeners();
        this.loadMockDocuments();
    }

    bindEventListeners() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');

        // Drag and drop events
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        uploadArea.addEventListener('drop', (e) => this.handleDrop(e));

        // File input change
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('uploadArea').classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('uploadArea').classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('uploadArea').classList.remove('drag-over');

        const files = Array.from(e.dataTransfer.files);
        this.processFiles(files);
    }

    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.processFiles(files);
        e.target.value = ''; // Clear input for reuse
    }

    processFiles(files) {
        const validFiles = files.filter(file => this.validateFile(file));
        
        if (validFiles.length !== files.length) {
            const invalidCount = files.length - validFiles.length;
            window.app?.showToast(`${invalidCount} file(s) skipped - invalid format or size`, 'warning');
        }

        validFiles.forEach(file => this.uploadFile(file));
    }

    validateFile(file) {
        const validTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
            'text/plain',
            'text/csv',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel'
        ];

        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!validTypes.includes(file.type)) {
            window.app?.showToast(`Invalid file type: ${file.name}`, 'error');
            return false;
        }

        if (file.size > maxSize) {
            window.app?.showToast(`File too large: ${file.name} (Max 10MB)`, 'error');
            return false;
        }

        return true;
    }

    uploadFile(file) {
        const docId = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        const document = {
            id: docId,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date(),
            status: 'uploading',
            progress: 0,
            category: this.categorizeDocument(file.name),
            extractedText: '',
            chunks: [],
            metadata: {
                pages: null,
                wordCount: null,
                language: 'en'
            }
        };

        this.documents.push(document);
        this.renderDocument(document);
        this.simulateUploadProcess(docId);

        window.app?.showToast(`Uploading ${file.name}...`, 'success');
    }

    categorizeDocument(filename) {
        const name = filename.toLowerCase();
        
        if (name.includes('handbook') || name.includes('policy') || name.includes('hr')) {
            return 'HR & Policies';
        } else if (name.includes('finance') || name.includes('expense') || name.includes('budget')) {
            return 'Finance';
        } else if (name.includes('legal') || name.includes('contract') || name.includes('compliance')) {
            return 'Legal & Compliance';
        } else if (name.includes('manual') || name.includes('procedure') || name.includes('process')) {
            return 'Operations';
        } else if (name.includes('tech') || name.includes('it') || name.includes('software')) {
            return 'IT & Tech';
        }
        
        return 'General';
    }

    simulateUploadProcess(docId) {
        const document = this.documents.find(doc => doc.id === docId);
        if (!document) return;

        // Simulate upload progress
        const uploadInterval = setInterval(() => {
            document.progress += Math.random() * 20;
            if (document.progress >= 100) {
                document.progress = 100;
                document.status = 'processing';
                clearInterval(uploadInterval);
                this.simulateProcessing(docId);
            }
            this.updateDocumentDisplay(docId);
        }, 500);
    }

    simulateProcessing(docId) {
        const document = this.documents.find(doc => doc.id === docId);
        if (!document) return;

        // Simulate text extraction and processing
        setTimeout(() => {
            // Mock extracted content based on document type
            document.extractedText = this.generateMockContent(document);
            document.chunks = this.createMockChunks(document.extractedText);
            document.metadata = this.generateMockMetadata(document);
            document.status = 'completed';
            
            this.updateDocumentDisplay(docId);
            window.app?.showToast(`${document.name} processed successfully!`, 'success');
            
            // Update knowledge base statistics
            this.updateKnowledgeStats();
            
        }, 2000 + Math.random() * 3000); // Random processing time
    }

    generateMockContent(document) {
        const contentTemplates = {
            'HR & Policies': `Employee Handbook - ${document.name}
            
            Company Overview:
            Our organization is committed to creating an inclusive and supportive work environment. This handbook outlines our policies, procedures, and benefits.
            
            Work Schedule:
            Standard business hours are 9:00 AM to 5:00 PM, Monday through Friday. Flexible scheduling is available with manager approval.
            
            Time Off Policy:
            - Vacation: 20 days annually
            - Sick Leave: 10 days annually  
            - Personal Days: 3 days annually
            - Holidays: 12 company holidays
            
            Benefits Package:
            - Health insurance (medical, dental, vision)
            - 401(k) with company matching
            - Professional development budget
            - Flexible work arrangements`,
            
            'Finance': `Financial Procedures - ${document.name}
            
            Expense Reporting:
            All business expenses must be submitted within 30 days of incurrence using our Expensify platform.
            
            Approval Limits:
            - Under $100: Manager approval
            - $100-$1000: Director approval
            - Over $1000: VP approval required
            
            Reimbursement Schedule:
            Approved expenses are processed with the next bi-weekly payroll cycle.
            
            Travel Policy:
            Business travel must be pre-approved and booked through our corporate travel portal.`,
            
            'Legal & Compliance': `Legal Guidelines - ${document.name}
            
            Code of Conduct:
            All employees must adhere to the highest ethical standards and comply with all applicable laws and regulations.
            
            Confidentiality:
            Employees must protect confidential company information and client data at all times.
            
            Compliance Requirements:
            Regular training on data protection, anti-harassment, and industry-specific regulations is mandatory.`,
            
            'IT & Tech': `IT Support Manual - ${document.name}
            
            System Access:
            All employees receive standard software packages including productivity suites, communication tools, and security software.
            
            Password Requirements:
            - Minimum 12 characters
            - Must include uppercase, lowercase, numbers, and symbols
            - Changed every 90 days
            
            Support Channels:
            - Help Desk: ext. 4357
            - Email: help@company.com
            - Emergency: ext. 911`,
            
            'Operations': `Operations Manual - ${document.name}
            
            Daily Procedures:
            Standard operating procedures for common business processes and workflows.
            
            Quality Standards:
            All work must meet established quality benchmarks and customer satisfaction metrics.
            
            Emergency Procedures:
            Detailed protocols for handling various emergency situations and business continuity.`
        };

        return contentTemplates[document.category] || `Document Content - ${document.name}
        
        This document contains important company information and procedures. The content has been processed and indexed for search and retrieval through the knowledge base system.`;
    }

    createMockChunks(content) {
        // Simulate text chunking for vector storage
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const chunks = [];
        
        for (let i = 0; i < sentences.length; i += 3) {
            chunks.push({
                id: `chunk_${i}`,
                text: sentences.slice(i, i + 3).join('. ').trim(),
                embedding: new Array(384).fill(0).map(() => Math.random()), // Mock embedding
                metadata: {
                    startIndex: i,
                    endIndex: Math.min(i + 2, sentences.length - 1)
                }
            });
        }
        
        return chunks;
    }

    generateMockMetadata(document) {
        return {
            pages: Math.floor(Math.random() * 50) + 1,
            wordCount: Math.floor(Math.random() * 5000) + 500,
            language: 'en',
            processingTime: (Math.random() * 10 + 5).toFixed(2) + 's',
            chunkCount: document.chunks?.length || 0,
            lastModified: new Date().toISOString()
        };
    }

    renderDocument(document) {
        const documentList = window.document.getElementById('documentList');
        const docElement = window.document.createElement('div');
        docElement.className = 'document-item';
        docElement.id = `doc-${document.id}`;
        
        docElement.innerHTML = this.getDocumentHTML(document);
        documentList.appendChild(docElement);
    }

    updateDocumentDisplay(docId) {
        const document = this.documents.find(doc => doc.id === docId);
        const docElement = window.document.getElementById(`doc-${docId}`);
        
        if (document && docElement) {
            docElement.innerHTML = this.getDocumentHTML(document);
        }
    }

    getDocumentHTML(document) {
        const statusIcon = {
            uploading: 'fa-upload text-blue-500',
            processing: 'fa-cog fa-spin text-yellow-500',
            completed: 'fa-check-circle text-green-500',
            error: 'fa-exclamation-triangle text-red-500'
        };

        const statusText = {
            uploading: 'Uploading',
            processing: 'Processing',
            completed: 'Ready',
            error: 'Error'
        };

        return `
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <div class="flex items-center mb-2">
                        <i class="fas ${statusIcon[document.status]} mr-2"></i>
                        <h4 class="font-medium text-gray-900">${document.name}</h4>
                        <span class="document-status ${document.status} ml-2">${statusText[document.status]}</span>
                    </div>
                    
                    <div class="text-sm text-gray-600 mb-2">
                        <span class="mr-4">📁 ${document.category}</span>
                        <span class="mr-4">📊 ${this.formatFileSize(document.size)}</span>
                        <span>🕒 ${document.uploadedAt.toLocaleTimeString()}</span>
                    </div>
                    
                    ${document.status === 'uploading' ? `
                        <div class="progress-bar mt-2">
                            <div class="progress-fill" style="width: ${document.progress}%"></div>
                        </div>
                        <div class="text-xs text-gray-500 mt-1">${Math.round(document.progress)}% uploaded</div>
                    ` : ''}
                    
                    ${document.status === 'completed' && document.metadata ? `
                        <div class="text-sm text-gray-600 mt-2">
                            <span class="mr-4">📄 ${document.metadata.pages} pages</span>
                            <span class="mr-4">📝 ${document.metadata.wordCount} words</span>
                            <span>🧩 ${document.metadata.chunkCount} chunks</span>
                        </div>
                    ` : ''}
                    
                    ${document.status === 'processing' ? `
                        <div class="text-sm text-gray-600 mt-2">
                            Extracting text and creating searchable chunks...
                        </div>
                    ` : ''}
                </div>
                
                <div class="flex items-center space-x-2 ml-4">
                    ${document.status === 'completed' ? `
                        <button class="text-gray-400 hover:text-blue-600 p-1" onclick="documentsInterface.previewDocument('${document.id}')" title="Preview">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="text-gray-400 hover:text-green-600 p-1" onclick="documentsInterface.downloadDocument('${document.id}')" title="Download">
                            <i class="fas fa-download"></i>
                        </button>
                    ` : ''}
                    <button class="text-gray-400 hover:text-red-600 p-1" onclick="documentsInterface.deleteDocument('${document.id}')" title="Delete">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `;
    }

    previewDocument(docId) {
        const document = this.documents.find(doc => doc.id === docId);
        if (!document) return;

        // Create modal for document preview
        const modal = window.document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div class="flex items-center justify-between p-4 border-b">
                    <h3 class="text-lg font-semibold">${document.name}</h3>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="p-4 overflow-y-auto max-h-[70vh]">
                    <div class="prose max-w-none">
                        ${document.extractedText.replace(/\n/g, '<br>')}
                    </div>
                </div>
                <div class="p-4 border-t bg-gray-50 flex justify-between items-center">
                    <div class="text-sm text-gray-600">
                        ${document.metadata.wordCount} words • ${document.metadata.pages} pages
                    </div>
                    <button onclick="this.closest('.fixed').remove()" class="btn-secondary">
                        Close Preview
                    </button>
                </div>
            </div>
        `;
        
        window.document.body.appendChild(modal);
    }

    downloadDocument(docId) {
        const doc = this.documents.find(d => d.id === docId);
        if (!doc) return;

        // Simulate download
        const blob = new Blob([doc.extractedText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = window.document.createElement('a');
        a.href = url;
        a.download = `${doc.name}_extracted.txt`;
        a.click();
        URL.revokeObjectURL(url);
        
        window.app?.showToast(`Downloaded ${doc.name}`, 'success');
    }

    deleteDocument(docId) {
        if (confirm('Are you sure you want to delete this document?')) {
            this.documents = this.documents.filter(doc => doc.id !== docId);
            const docElement = window.document.getElementById(`doc-${docId}`);
            if (docElement) {
                docElement.remove();
            }
            this.updateKnowledgeStats();
            window.app?.showToast('Document deleted', 'success');
        }
    }

    updateKnowledgeStats() {
        // Update the sidebar counts
        const categories = {
            'hr': this.documents.filter(doc => doc.category === 'HR & Policies').length,
            'finance': this.documents.filter(doc => doc.category === 'Finance').length,
            'operations': this.documents.filter(doc => doc.category === 'Operations').length,
            'legal': this.documents.filter(doc => doc.category === 'Legal & Compliance').length,
            'tech': this.documents.filter(doc => doc.category === 'IT & Tech').length
        };

        for (const [category, count] of Object.entries(categories)) {
            const btn = document.querySelector(`[data-category="${category}"]`);
            if (btn) {
                const countSpan = btn.querySelector('.text-xs');
                if (countSpan) {
                    countSpan.textContent = count;
                }
            }
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    loadMockDocuments() {
        // Add some pre-existing documents for demonstration
        const mockDocs = [
            {
                id: 'demo_1',
                name: 'Employee_Handbook_2024.pdf',
                size: 2547820,
                type: 'application/pdf',
                uploadedAt: new Date(Date.now() - 86400000), // 1 day ago
                status: 'completed',
                category: 'HR & Policies',
                metadata: { pages: 45, wordCount: 12500, chunkCount: 25 }
            },
            {
                id: 'demo_2', 
                name: 'IT_Security_Guidelines.docx',
                size: 1245600,
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                uploadedAt: new Date(Date.now() - 172800000), // 2 days ago
                status: 'completed',
                category: 'IT & Tech',
                metadata: { pages: 18, wordCount: 7200, chunkCount: 15 }
            },
            {
                id: 'demo_3',
                name: 'Expense_Policy_2024.pdf',
                size: 856400,
                type: 'application/pdf',
                uploadedAt: new Date(Date.now() - 259200000), // 3 days ago
                status: 'completed',
                category: 'Finance',
                metadata: { pages: 12, wordCount: 4800, chunkCount: 10 }
            }
        ];

        // Add mock extracted content
        mockDocs.forEach(doc => {
            doc.extractedText = this.generateMockContent(doc);
            doc.chunks = this.createMockChunks(doc.extractedText);
            this.documents.push(doc);
            this.renderDocument(doc);
        });

        this.updateKnowledgeStats();
    }
}

// Initialize documents interface when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.documentsInterface = new DocumentsInterface();
});