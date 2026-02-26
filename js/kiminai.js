        // === AUTHENTICATION CHECK ===
        (function() {
            if (localStorage.getItem('kimini_auth') !== 'true') {
                alert('Tafadhali ingia kwanza!');
                window.location.href = 'login.html';
                return;
            }
        })();

        // === API CONFIGURATION ===
        const API_KEY = "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";
        const API_URL = "https://openrouter.ai/api/v1/chat/completions";

        // === DOM ELEMENTS ===
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        const messagesContainer = document.getElementById('messagesContainer');
        const logoutBtn = document.getElementById('logoutBtn');
        const menuBtn = document.getElementById('menuBtn');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        const newChatBtn = document.getElementById('newChatBtn');
        const conversationList = document.getElementById('conversationList');
        const userInfoContainer = document.getElementById('userInfoContainer');
        const quickButtons = document.querySelectorAll('.quick-btn');



        // === CONVERSATION HISTORY ===
        let currentConversationId = 'default';
        let conversationHistory = JSON.parse(localStorage.getItem('kimini_conversation')) || [];
        let allConversations = JSON.parse(localStorage.getItem('kimini_all_conversations')) || [];

        // === INITIALIZATION ===
        document.addEventListener('DOMContentLoaded', function() {
            initializeUserInfo();
            loadConversationHistory();
            loadAllConversations();
            
            // Focus on input
            setTimeout(() => {
                messageInput.focus();
            }, 500);
        });

        // === USER INFO ===
        function initializeUserInfo() {
            const user = localStorage.getItem('kimini_user') || 'Mtumiaji';
            const userInfoHTML = `
                <div class="user-info">
                    <div class="user-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="user-details">
                        <h4>${user}</h4>
                        <p><i class="fas fa-shield-alt"></i> Premium User</p>
                    </div>
                </div>
            `;
            userInfoContainer.innerHTML = userInfoHTML;
        }

        // === LOAD CONVERSATIONS ===
function loadAllConversations() {
    const conversations = JSON.parse(localStorage.getItem('kimini_all_conversations')) || [];
    conversationList.innerHTML = '';
    
    if (conversations.length === 0) {
        conversationList.innerHTML = '<div class="conversation-item">Hakuna mazungumzo ya zamani</div>';
        deleteAllBtn.style.display = 'none';
        return;
    }
    
    deleteAllBtn.style.display = 'block';
    
    conversations.forEach((conv, index) => {
        const item = document.createElement('div');
        item.className = 'conversation-item';
        if (index === conversations.length - 1) {
            item.classList.add('active');
        }
        
        const date = new Date(conv.timestamp || Date.now());
        const timeString = date.toLocaleTimeString('sw-KE', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        item.innerHTML = `
            <i class="fas fa-comment"></i>
            <div class="conversation-item-content">
                <div class="conversation-info">
                    <div style="font-weight: 500;">${conv.preview || 'Mazungumzo'}</div>
                    <div style="font-size: 0.75rem; opacity: 0.7;">${timeString}</div>
                </div>
                <button class="delete-btn" data-id="${conv.id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
        
        // Load conversation when clicked
        item.addEventListener('click', (e) => {
            // Only load if not clicking delete button
            if (!e.target.closest('.delete-btn')) {
                loadConversation(conv.id);
            }
        });
        
        // Add delete button event listener
        const deleteBtn = item.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showDeleteModal('single', conv.id, conv.preview);
        });
        
        conversationList.appendChild(item);
    });
}

        // === LOAD CONVERSATION ===
        function loadConversationHistory() {
            // Clear current messages except welcome
            const messages = messagesContainer.querySelectorAll('.message:not(.welcome-message)');
            messages.forEach(msg => msg.remove());
            
            // Add saved conversation
            conversationHistory.forEach(msg => {
                if (msg.role !== 'system') {
                    addMessageToUI(msg.role, msg.content);
                }
            });
        }

        function loadConversation(conversationId) {
            const conversation = allConversations.find(c => c.id === conversationId);
            if (conversation) {
                currentConversationId = conversationId;
                conversationHistory = conversation.messages;
                localStorage.setItem('kimini_conversation', JSON.stringify(conversationHistory));
                loadConversationHistory();
                
                // Update active state
                document.querySelectorAll('.conversation-item').forEach(item => {
                    item.classList.remove('active');
                });
                event.target.closest('.conversation-item').classList.add('active');
            }
        }

        // === AUTO-RESIZE TEXTAREA ===
        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 150) + 'px';
        });

        // === SEND MESSAGE ON ENTER ===
        messageInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // === SEND BUTTON CLICK ===
        sendButton.addEventListener('click', sendMessage);

        // === QUICK ACTION BUTTONS ===
        quickButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const suggestion = this.getAttribute('data-suggestion');
                let question = '';
                
                switch(suggestion) {
                    case 'Pendekeza mada':
                        question = "Nipendekeze mada 5 za kuvutia za kujadili leo.";
                        break;
                    case 'Andika code':
                        question = "Nisaidie kuandika code za HTML na CSS ya ukurasa wa kuvutia.";
                        break;
                    case 'Eleza dhana':
                        question = "Nieleze kwa urahisi dhana za 'Artificial Intelligence'.";
                        break;
                }
                
                messageInput.value = question;
                messageInput.style.height = 'auto';
                messageInput.style.height = Math.min(messageInput.scrollHeight, 150) + 'px';
                messageInput.focus();
            });
        });

        // === LOGOUT FUNCTIONALITY ===
        logoutBtn.addEventListener('click', function() {
            if (confirm('Unahitaji kutoka?')) {
                localStorage.removeItem('kimini_auth');
                localStorage.removeItem('kimini_user');
                localStorage.removeItem('kimini_conversation');
                window.location.href = 'index.html';
            }
        });

        // === MOBILE MENU TOGGLE ===
        function toggleSidebar() {
            sidebar.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
                if (conversationHistory.length > 0) {
        
            // Save current conversation
            const timestamp = new Date().toISOString();
            const conversationData = {
                id: Date.now(),
                timestamp: timestamp,
                preview: conversationHistory[conversationHistory.length - 1]?.content?.substring(0, 50) + '...' || 'Mazungumzo mapya',
                messages: [...conversationHistory]
            };
            
            let allConversations = JSON.parse(localStorage.getItem('kimini_all_conversations')) || [];
            allConversations.push(conversationData);
            localStorage.setItem('kimini_all_conversations', JSON.stringify(allConversations));
            
            // Clear current conversation
            conversationHistory = [];
            currentConversationId = 'default';
            localStorage.setItem('kimini_conversation', JSON.stringify(conversationHistory));
            
            // Reload conversations list
            loadAllConversations();
            loadConversationHistory();
            
            // Focus on input
            messageInput.focus();
            
            // Show confirmation
            showNotification('Mazungumzo mapya yamefunguliwa!', 'success');
            
            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                toggleSidebar();
            }
    
    } else {
        showNotification('Tayari una mazungumzo mapya!');
    }
        }

        menuBtn.addEventListener('click', toggleSidebar);
        sidebarOverlay.addEventListener('click', toggleSidebar);

        // === NEW CHAT FUNCTIONALITY ===
        newChatBtn.addEventListener('click', createNewChat);

          function createNewChat() {
    if (conversationHistory.length > 0) {
        
            // Save current conversation
            const timestamp = new Date().toISOString();
            const conversationData = {
                id: Date.now(),
                timestamp: timestamp,
                preview: conversationHistory[conversationHistory.length - 1]?.content?.substring(0, 50) + '...' || 'Mazungumzo mapya',
                messages: [...conversationHistory]
            };
            
            let allConversations = JSON.parse(localStorage.getItem('kimini_all_conversations')) || [];
            allConversations.push(conversationData);
            localStorage.setItem('kimini_all_conversations', JSON.stringify(allConversations));
            
            // Clear current conversation
            conversationHistory = [];
            currentConversationId = 'default';
            localStorage.setItem('kimini_conversation', JSON.stringify(conversationHistory));
            
            // Reload conversations list
            loadAllConversations();
            loadConversationHistory();
            
            // Focus on input
            messageInput.focus();
            
            // Show confirmation
            showNotification('Mazungumzo mapya yamefunguliwa!', 'success');
            
            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                toggleSidebar();
            }
    
    } else {
        showNotification('Tayari una mazungumzo mapya!');
    }
}
            
        // === SEND MESSAGE FUNCTION ===
    async function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        // Clear input
        messageInput.value = '';
        messageInput.style.height = 'auto';
        messageInput.focus();

        // Add user message to UI
        addMessageToUI('user', message);
        
        // Add to history
        conversationHistory.push({ role: 'user', content: message });
        
        // Save to localStorage
        localStorage.setItem('kimini_conversation', JSON.stringify(conversationHistory));

        // Show typing indicator
        const typingId = showTypingIndicator();

        try {
            // Prepare messages for API - including system message
            const messagesForAPI = [
                {
                role: 'system',
                content: 'You are Kimini AI, a helpful AI assistant created by kimin hub. ' +
                        'You can speak Swahili and English. Always be helpful, tech problem solver, . ' +
                        'Kimin hub is company create by salmin mohamed and he is developer of kimin AI. ' +
                        'he also developer of different AI, software and program '
                },
                ...conversationHistory.slice(-10) // Send last 10 messages for context
            ];

            console.log('Sending request to API...');

            // API call with simpler format
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": window.location.origin,
                    "X-Title": "Kimini AI Chat"
                },
                body: JSON.stringify({
                    "model": "qwen/qwen3-max-thinking",
                    "messages": messagesForAPI,
                    "temperature": 0.7,
                    "max_tokens": 1000,
                    "stream": false
                })
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error:', errorText);
                throw new Error(`API request failed: ${response.status}`);
            }

            const result = await response.json();
            console.log('API Response:', result);

            if (!result.choices || !result.choices[0]) {
                throw new Error('Invalid API response format');
            }

            const assistantResponse = result.choices[0].message.content;
            
            // Add to conversation history
            conversationHistory.push({
                role: 'assistant',
                content: assistantResponse
            });

            // Save updated conversation
            localStorage.setItem('kimini_conversation', JSON.stringify(conversationHistory));

            // Show response with streaming effect
            simulateStreamResponse(assistantResponse, typingId);

        } catch (error) {
            console.error('Full error:', error);
            
            // Remove typing indicator
            removeTypingIndicator(typingId);
            
            // Show specific error messages
            let errorMessage = 'Samahani, kuna hitilafu. Tafadhali jaribu tena.';
            
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                errorMessage = 'Hitilafu ya mtandao. Tafadhali angalia muunganisho wako wa internet na ujaribu tena.';
            } else if (error.message.includes('401') || error.message.includes('403')) {
                errorMessage = 'Hitilafu ya uthibitisho. API key inaweza kuwa batili au imeshaisha.';
            } else if (error.message.includes('429')) {
                errorMessage = 'Umezidi kiasi cha maombi. Tafadhali subiri kidogo kabla ya kujaribu tena.';
            }
            
            addMessageToUI('assistant', errorMessage);
            
            // Also add to history
            conversationHistory.push({
                role: 'assistant',
                content: errorMessage
            });
            localStorage.setItem('kimini_conversation', JSON.stringify(conversationHistory));
        }
    }

        // === ADD MESSAGE TO UI ===
        function addMessageToUI(role, content) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${role}`;
            
            const avatarDiv = document.createElement('div');
            avatarDiv.className = 'avatar';
            avatarDiv.innerHTML = role === 'user' ? 
                '<img src="user.png" alt="">' : 
                '<img src="kimin ai.png" alt="">';
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            
            // Format content with markdown
            const formattedContent = formatMessage(content);
            
            contentDiv.innerHTML = formattedContent;
            
            messageDiv.appendChild(avatarDiv);
            messageDiv.appendChild(contentDiv);
            
            messagesContainer.appendChild(messageDiv);
            
            // Scroll to bottom
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 100);
        }

        // === FORMAT MESSAGE WITH MARKDOWN ===
        function formatMessage(content) {
            let formatted = content
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/\n/g, '<br>')
                .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/`([^`]+)`/g, '<code>$1</code>')
                .replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>');
            
            // Format lists
            formatted = formatted.replace(/^\s*[\-*]\s+(.+)$/gm, '• $1<br>');
            
            return `<p>${formatted}</p>`;
        }

        // === TYPING INDICATOR ===
        function showTypingIndicator() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message assistant';
            typingDiv.id = 'typing-indicator';
            
            const avatarDiv = document.createElement('div');
            avatarDiv.className = 'avatar';
            avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            contentDiv.innerHTML = `
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            `;
            
            typingDiv.appendChild(avatarDiv);
            typingDiv.appendChild(contentDiv);
            messagesContainer.appendChild(typingDiv);
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            return typingDiv.id;
        }

        function removeTypingIndicator(id) {
            const typingElement = document.getElementById(id);
            if (typingElement) {
                typingElement.remove();
            }
        }

    function simulateStreamResponse(content, typingId) {
        removeTypingIndicator(typingId);
        
        // Create message container
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message assistant';
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar';
        avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        messagesContainer.appendChild(messageDiv);
        
        // For smooth streaming, show text gradually
        let displayedText = '';
        let index = 0;
        const textLength = content.length;
        
        function streamNextChunk() {
            if (index < textLength) {
                // Add next 3-5 characters
                const chunkSize = Math.floor(Math.random() * 3) + 3;
                displayedText += content.substring(index, Math.min(index + chunkSize, textLength));
                index += chunkSize;
                
                // Format the displayed text
                const formattedText = displayedText
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/\n/g, '<br>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>');
                
                contentDiv.innerHTML = `<p>${formattedText}</p>`;
                
                // Scroll to bottom
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                
                // Schedule next chunk
                const delay = Math.floor(Math.random() * 30) + 20; // 20-50ms
                setTimeout(streamNextChunk, delay);
            }
        }
        
        // Start streaming
        streamNextChunk();
    }

    // New Chat functionality
function createNewChat() {
    if (conversationHistory.length > 0) {
        if (confirm('Unataka kuanza mazungumzo mapya? Mazungumzo ya sasa yatahifadhiwa.')) {
            // Save current conversation
            const timestamp = new Date().toISOString();
            const conversationData = {
                id: Date.now(),
                timestamp: timestamp,
                preview: conversationHistory[conversationHistory.length - 1]?.content?.substring(0, 50) + '...' || 'Mazungumzo mapya',
                messages: [...conversationHistory]
            };
            
            let allConversations = JSON.parse(localStorage.getItem('kimini_all_conversations')) || [];
            allConversations.push(conversationData);
            localStorage.setItem('kimini_all_conversations', JSON.stringify(allConversations));
            
            // Clear current conversation
            conversationHistory = [];
            currentConversationId = 'default';
            localStorage.setItem('kimini_conversation', JSON.stringify(conversationHistory));
            
            // Reload conversations list
            loadAllConversations();
            loadConversationHistory();
            
            // Focus on input
            messageInput.focus();
            
            // Show confirmation
            showNotification('Mazungumzo mapya yamefunguliwa!', 'success');
            
            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                toggleSidebar();
            }
        }
    } else {
        showNotification('Tayari una mazungumzo mapya!');
    }
}

    // Add New Chat button to sidebar
    document.addEventListener('DOMContentLoaded', function() {
        const newChatBtn = document.createElement('button');
        newChatBtn.innerHTML = '<i class="fas fa-plus"></i> Mazungumzo Mapya';
        newChatBtn.style.cssText = `
            margin: 15px 20px;
            padding: 12px;
            background: #10a37f;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            justify-content: center;
            width: calc(100% - 40px);
            font-size: 0.9rem;
        `;
        newChatBtn.addEventListener('click', createNewChat);
        
        sidebar.insertBefore(newChatBtn, logoutBtn);
        
        // Add user info
        const user = localStorage.getItem('kimini_user');
        if (user) {
            const userInfo = document.createElement('div');
            userInfo.style.cssText = `
                padding: 15px 20px;
                border-top: 1px solid #4d4d4f;
                font-size: 0.85rem;
                color: #9ca3af;
            `;
            userInfo.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-user-circle" style="font-size: 1.2rem;"></i>
                    <div>
                        <div style="color: #ececf1;">${user}</div>
                        <div style="font-size: 0.75rem;">Premium User</div>
                    </div>
                </div>
            `;
            sidebar.insertBefore(userInfo, newChatBtn);
        }
    });



// === DELETE FUNCTIONS ===
function showDeleteModal(type, id = null, preview = null) {
    deleteType = type;
    conversationToDelete = id;
    
    if (type === 'single') {
        deleteModalText.textContent = `Unahitaji kufuta mazungumzo "${preview || 'haya'}"? Kitendo hiki hakiwezi kutenduliwa.`;
    } else {
        deleteModalText.textContent = 'Unahitaji kufuta mazungumzo yote? Kitendo hiki hakiwezi kutenduliwa.';
    }
    
    deleteModal.classList.add('active');
}

function hideDeleteModal() {
    deleteModal.classList.remove('active');
    deleteType = '';
    conversationToDelete = null;
}

function deleteConversation(conversationId) {
    let conversations = JSON.parse(localStorage.getItem('kimini_all_conversations')) || [];
    
    // Remove the conversation
    conversations = conversations.filter(conv => conv.id !== conversationId);
    
    // Save back to localStorage
    localStorage.setItem('kimini_all_conversations', JSON.stringify(conversations));
    
    // Reload the list
    loadAllConversations();
    
    // Show success notification
    showNotification('Mazungumzo yamefutwa!', 'success');
}

function deleteAllConversations() {
    // Clear all conversations
    localStorage.removeItem('kimini_all_conversations');
    
    // Reload the list
    loadAllConversations();
    
    // Hide delete all button
    deleteAllBtn.style.display = 'none';
    
    // Show success notification
    showNotification('Mazungumzo yote yamefutwa!', 'success');
}

// === EVENT LISTENERS FOR DELETE ===
deleteAllBtn.addEventListener('click', () => {
    const conversations = JSON.parse(localStorage.getItem('kimini_all_conversations')) || [];
    if (conversations.length > 0) {
        showDeleteModal('all');
    }
});

cancelDeleteBtn.addEventListener('click', hideDeleteModal);

confirmDeleteBtn.addEventListener('click', () => {
    if (deleteType === 'single' && conversationToDelete) {
        deleteConversation(conversationToDelete);
    } else if (deleteType === 'all') {
        deleteAllConversations();
    }
    hideDeleteModal();
});

// Close modal when clicking outside
deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
        hideDeleteModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && deleteModal.classList.contains('active')) {
        hideDeleteModal();
    }
});