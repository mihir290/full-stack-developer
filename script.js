// Local Storage se data retrieve karein ya initial standard fallback populate karein
let blogPosts = JSON.parse(localStorage.getItem('myBlogPosts')) || [
    {
        id: 1,
        title: "Getting Started with Web Development",
        category: "Coding",
        content: "Web development is an evolving landscape. By mastering HTML, CSS, and modern JavaScript architectures, you open up doors to building infinite applications scaled globally.",
        date: "Jul 01, 2026",
        comments: [
            { id: 11, text: "Great introductory read! Keep it up.", timestamp: "Just Now" }
        ]
    }
];

// Document Selectors Mapping
const blogForm = document.getElementById('blog-form');
const blogFeed = document.getElementById('blog-feed');

// App Initialization Event Listeners
document.addEventListener('DOMContentLoaded', renderBlogPosts);
blogForm.addEventListener('submit', handleAddPost);

// Blog Create functionality logic
function handleAddPost(e) {
    e.preventDefault();

    const title = document.getElementById('post-title').value.trim();
    const category = document.getElementById('post-category').value;
    const content = document.getElementById('post-content').value.trim();

    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = new Date().toLocaleDateString('en-US', options);

    const newPost = {
        id: Date.now(), // Generate unique numeric identification ID
        title: title,
        category: category,
        content: content,
        date: formattedDate,
        comments: [] // Initial empty comments bucket array
    };

    blogPosts.unshift(newPost); // Push to the top of list stack array
    saveStateToLocalStorage();
    renderBlogPosts();
    
    blogForm.reset(); // Clear text structures fields
}

// Comments append handling engine logic
function handleAddComment(postId) {
    const inputField = document.getElementById(`comment-input-${postId}`);
    const commentText = inputField.value.trim();

    if (commentText === '') {
        alert('Comment content cannot be blank!');
        return;
    }

    const targetPost = blogPosts.find(post => post.id === postId);
    if (targetPost) {
        targetPost.comments.push({
            id: Date.now(),
            text: commentText,
            timestamp: "Just Now"
        });
        
        saveStateToLocalStorage();
        renderBlogPosts();
    }
}

// Post deletion lifecycle handler mapping
function handleDeletePost(postId) {
    if (confirm("Are you sure you want to delete this blog post?")) {
        blogPosts = blogPosts.filter(post => post.id !== postId);
        saveStateToLocalStorage();
        renderBlogPosts();
    }
}

function saveStateToLocalStorage() {
    localStorage.setItem('myBlogPosts', JSON.stringify(blogPosts));
}

// UI dynamic interpolation pipeline layout system render engine 
function renderBlogPosts() {
    if (blogPosts.length === 0) {
        blogFeed.innerHTML = `<div class="no-posts"><i class="fa-solid fa-folder-open fa-2x"></i><p style="margin-top:10px;">No posts found. Publish your first article!</p></div>`;
        return;
    }

    blogFeed.innerHTML = blogPosts.map(post => {
        // Render sub-comments elements map mapping template
        const commentsHTML = post.comments.map(comm => `
            <div class="comment-item">
                <span class="comment-meta">${comm.timestamp}</span>
                <p class="comment-text">${escapeHTML(comm.text)}</p>
            </div>
        `).join('');

        return `
            <article class="blog-card">
                <button class="btn-delete" onclick="handleDeletePost(${post.id})">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
                <div class="post-meta">
                    <span class="category-badge">${post.category}</span>
                    <span><i class="fa-regular fa-calendar"></i> ${post.date}</span>
                </div>
                <h3 class="post-title-text">${escapeHTML(post.title)}</h3>
                <p class="post-body-text">${escapeHTML(post.content)}</p>

                <!-- Comments Interface Zone Module -->
                <div class="comments-section">
                    <h4><i class="fa-regular fa-comments"></i> Comments (${post.comments.length})</h4>
                    <div class="comments-list">
                        ${commentsHTML}
                    </div>
                    <div class="comment-form">
                        <input type="text" id="comment-input-${post.id}" class="comment-input" placeholder="Write a public comment..." maxlength="150">
                        <button class="btn-comment-submit" onclick="handleAddComment(${post.id})">Post</button>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

// Helper utility parser to secure inputs scripts injections
function escapeHTML(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}