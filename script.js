const sweet_alert = async (title, icon) => {
    Swal.fire({
        title: `${title}`,
        icon: `${icon}`,
        showClass: {
            popup: `
      animate__animated
      animate__fadeInDown
      animate__faster
    `,
        },
        hideClass: {
            popup: `
      animate__animated
      animate__fadeOutUp
      animate__faster
    `,
        },
    });
}

const post_textarea = document.getElementById("post_textarea");
let currentBackground = null;

function set_bg(event) {
    const imgElement = event.currentTarget;
    currentBackground = imgElement.id;
    post_textarea.style.backgroundImage = `url('../assets/images/${currentBackground}.jpeg')`;
}

function create_post() {
    const post_user_name = document.getElementById("username_input").value.trim();
    const post_content = post_textarea.value.trim();
    const post_id = Date.now();

    if (!post_content) {
        sweet_alert("Please write something before posting!", "warning");
        return;
    }

    // Get existing posts
    const posts = JSON.parse(localStorage.getItem("posts") || "[]");

    // Create new post object
    const newPost = {
        id: post_id,
        post_username: post_user_name || "Anonymous",
        post_contents: post_content,
        background: currentBackground,
        timestamp: new Date().toLocaleString(),
        likes: 0,
        comments: []
    };

    // Add to beginning of array (newest first)
    posts.unshift(newPost);

    // Save back to localStorage
    localStorage.setItem("posts", JSON.stringify(posts));

    // Clear form
    post_textarea.value = "";
    post_textarea.style.backgroundImage = '';
    currentBackground = null;
    document.getElementById("username_input").value = "";

    // Refresh posts display
    // displayPosts();

    sweet_alert("Post created successfully!", "success");
}

function display_posts(filterType = 'latest') {
    const post_sec = document.getElementById("post_sec");
    let posts = JSON.parse(localStorage.getItem("posts") || "[]");
    const filter_row = document.getElementById("filter_row");

    post_sec.innerHTML = '';
    post_sec.style.display = "flex";

    // Handle empty posts case
    if (posts.length === 0) {
        filter_row.style.display = "none";
        post_sec.innerHTML = `
        <div class="no_posts">
            No Posts Available
        </div>
        `;
        return;
    }

    // Apply filter
    posts = apply_filter(posts, filterType);

    posts.forEach(post => {
        let bgStyle = "";
        if (post.background) {
            bgStyle = `style="background-image:url('../assets/images/${post.background}.jpeg');"`;
        }

        // Check if post is liked for initial button state
        const likeIcon = post.liked ? 'fa-solid' : 'fa-regular';
        const likeText = post.liked ? 'Liked' : 'Like';

        // Update like text with proper grammar
        const likeTextDisplay = post.likes === 1 ? "person likes" : "people like";

        post_sec.innerHTML += `
        <div class="card post" id="post_${post.id}">
            <div class="card-body post_body">
                <h5 class="card-title post_title">
                    <img src="../assets/dummy_user_pic.png" alt="user_pic" width="40" height="40" />
                    ${post.post_username}
                </h5>
                <h6 class="card-subtitle mb-2 text-muted">
                    ${new Date(post.timestamp).toLocaleString()}
                </h6>
            </div>
            <p class="card-text post_text" id="post_text${post.id}" ${bgStyle}>${post.post_contents}</p>
            
            <div class="like_count" id="like_count_${post.id}">${post.likes} ${likeTextDisplay} this post</div>
            <div class="post_btns">
                <button id="like_btn_${post.id}" onclick="change_like_icon(${post.id})">
                    <i class="${likeIcon} fa-thumbs-up"></i>${likeText}
                </button>
            </div>
            <button class="del_btn" id="del_btn_${post.id}" onclick="del_btn(${post.id})">
                Delete Post
            </button>
        </div>
        `;
    });
}

function apply_filter(posts, filterType) {
    if (filterType === 'latest') {
        // Show newest first (default - already sorted by timestamp in creation)
        return posts;
    }
    else if (filterType === 'oldest') {
        // Show oldest first
        return posts.reverse();
    }
    else if (filterType === 'most_liked') {
        // Sort by most likes (descending)
        return posts.sort((a, b) => b.likes - a.likes);
    }
    else {
        return posts;
    }
}

function filter_posts(event) {
    const filter_id = event.currentTarget.id;
    display_posts(filter_id);
}

if (window.location.pathname.endsWith("/posts/posts.html")) {
    display_posts()
}

function change_like_icon(post_id) {
    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    const postIndex = posts.findIndex(post => post.id === post_id);
    const like_btn = document.getElementById(`like_btn_${post_id}`);
    const like_count = document.getElementById(`like_count_${post_id}`);
    const post = posts[postIndex];

    if (!post.liked) {
        // Like the post
        post.liked = true;
        post.likes++;
        like_btn.innerHTML = `<i class="fa-solid fa-thumbs-up"></i>Liked`;
    } else {
        // Unlike the post
        post.liked = false;
        post.likes--;
        like_btn.innerHTML = `<i class="fa-regular fa-thumbs-up"></i>Like`;
    }

    // Update like count text with proper grammar
    const likeTextDisplay = post.likes === 1 ? "person likes" : "people like";
    like_count.innerText = `${post.likes} ${likeTextDisplay} this post`;

    // Save to localStorage
    localStorage.setItem("posts", JSON.stringify(posts));
}

function del_btn(post_id) {
    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    const postIndex = posts.findIndex(post => post.id === post_id);
    posts.splice(postIndex, 1);
    localStorage.setItem("posts", JSON.stringify(posts));
    window.location.reload();
}

function search() {
    let posts = JSON.parse(localStorage.getItem("posts") || "[]");
    const post_sec = document.getElementById("post_sec");
    const search_bar = document.getElementById("search_bar");
    const search_bar_value = search_bar.value.trim();

    if (search_bar_value.length < 3) {
        sweet_alert("Add More Characters!", "error");
        return;
    }
    searchbar_valueLength = search_bar_value.length;
    // console.log(search_bar)
    // console.log(search_bar_value)

    posts.forEach(post => {
        let content = post.post_contents;
        content = content.slice(0, searchbar_valueLength);
        if (content == search_bar_value) {
            post_sec.innerHTML = '';
            post_sec.style.display = "flex";

            let bgStyle = "";
            if (post.background) {
                bgStyle = `style="background-image:url('../assets/images/${post.background}.jpeg');"`;
            }

            // Check if post is liked for initial button state
            const likeIcon = post.liked ? 'fa-solid' : 'fa-regular';
            const likeText = post.liked ? 'Liked' : 'Like';

            // Update like text with proper grammar
            const likeTextDisplay = post.likes === 1 ? "person likes" : "people like";

            post_sec.innerHTML += `
        <div class="card post" id="post_${post.id}">
            <div class="card-body post_body">
                <h5 class="card-title post_title">
                    <img src="../assets/dummy_user_pic.png" alt="user_pic" width="40" height="40" />
                    ${post.post_username}
                </h5>
                <h6 class="card-subtitle mb-2 text-muted">
                    ${new Date(post.timestamp).toLocaleString()}
                </h6>
            </div>
            <p class="card-text post_text" id="post_text${post.id}" ${bgStyle}>${post.post_contents}</p>
            
            <div class="like_count" id="like_count_${post.id}">${post.likes} ${likeTextDisplay} this post</div>
            <div class="post_btns">
                <button id="like_btn_${post.id}" onclick="change_like_icon(${post.id})">
                    <i class="${likeIcon} fa-thumbs-up"></i>${likeText}
                </button>
            </div>
            <button class="del_btn" id="del_btn_${post.id}" onclick="del_btn(${post.id})">
                Delete Post
            </button>
        </div>
        `;
        }
    })

}