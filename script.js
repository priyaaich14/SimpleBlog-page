
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('blogForm')
    const blogsDiv = document.getElementById('blogs')
    const addBlogButton = document.getElementById('addBlogButton')

    addBlogButton.addEventListener('click', () => {
        form.style.display = form.style.display === 'none' ? 'block' : 'none'
    })

    const fetchBlogs = () => {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', 'http://localhost:5000/api/blogs', true)
        xhr.onload = function () {
            if (this.status === 200) {
                const blogs = JSON.parse(this.responseText)
                blogsDiv.innerHTML = ''
                blogs.forEach(blog => {
                    const blogDiv = document.createElement('div')
                    blogDiv.classList.add('blog-post')
                    blogDiv.innerHTML = `
                        <h2>${blog.title}</h2>
                        <p>${blog.content}</p>
                    `
                    blogsDiv.appendChild(blogDiv)
                })
            }
        }
        xhr.send()
    }

    const createBlog = (event) => {
        event.preventDefault()
        const title = document.getElementById('title').value
        const content = document.getElementById('content').value

        const xhr = new XMLHttpRequest()
        xhr.open('POST', 'http://localhost:5000/api/blogs', true)
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
        xhr.onload = function () {
            if (this.status === 201) {
                fetchBlogs()
                form.reset()
                form.style.display = 'none'
            } else {
                console.error('Error creating blog:', this.responseText)
            }
        }
        xhr.send(JSON.stringify({ title, content }))
    }

    form.onsubmit = createBlog
    fetchBlogs()
})
