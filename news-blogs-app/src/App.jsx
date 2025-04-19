import React, { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import News from "./Components/News"
import Blogs from './Components/Blogs'
import Login from './Components/Auth/Login'
import Register from './Components/Auth/Register'

const App = () => {
  const [showNews, setShowNews] = useState(true)
  const [showBlogs, setShowBlogs] = useState(false)
  const [blogs, setBlogs] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [user, setUser] = useState(null)
  const [showLogin, setShowLogin] = useState(true)

  useEffect(() => {
    const savedBlogs = JSON.parse(localStorage.getItem('blogs')) || []
    setBlogs(savedBlogs)

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [])

  const handleCreateBlog = (newBlog, isEdit) => {
    console.log('Creating/Editing blog:', newBlog, 'isEdit:', isEdit)
    setBlogs((prevBlogs) => {
      let updatedBlogs;
      if (isEdit) {
        updatedBlogs = prevBlogs.map((blog) => 
          blog.id === newBlog.id ? newBlog : blog
        );
      } else {
        updatedBlogs = [...prevBlogs, newBlog];
      }
      console.log('Updated blogs array:', updatedBlogs)
      localStorage.setItem('blogs', JSON.stringify(updatedBlogs))
      return updatedBlogs
    })
    setIsEditing(false)
    setSelectedPost(null)
  }

  const handleEditBlogs = (blog) => {
    setSelectedPost(blog)
    setIsEditing(blog !== null)
    setShowNews(false)
    setShowBlogs(true)
  }
  const handleShowBlogs = () => {
    setShowNews(false)
    setShowBlogs(true)
  }
  const handleBackToNews = () => {
    setShowBlogs(false)
    setShowNews(true)
    setIsEditing(false)
    setSelectedPost(null)
  }

  const handleDeleteBlogs = (blogToDelete) => {
    setBlogs((prevBlogs) => {
      const updatedBlogs = prevBlogs.filter((blog) => blog !== blogToDelete)
      localStorage.setItem('blogs', JSON.stringify(updatedBlogs))
      return updatedBlogs 
    })
  }

  const handleLogin = () => {
    setShowLogin(false)
  }

  const handleRegister = () => {
    setShowLogin(true)
  }

  const handleSwitchToRegister = () => {
    setShowLogin(false)
  }

  const handleSwitchToLogin = () => {
    setShowLogin(true)
  }

  if (!user) {
    return showLogin ? (
      <Login onLogin={handleLogin} onSwitchToRegister={handleSwitchToRegister} />
    ) : (
      <Register onRegister={handleRegister} onSwitchToLogin={handleSwitchToLogin} />
    )
  }

  return (
    <div className='container'>
      <div className='news-blogs-app'>
        {showNews && <News onShowBlogs={handleShowBlogs} blogs = {blogs} onEditBlog={handleEditBlogs} onDeleteBlog={handleDeleteBlogs} user={user}/>}
        {showBlogs && <Blogs onBack={handleBackToNews} onCreateBlog={handleCreateBlog} editPost={selectedPost} isEditing={isEditing}/>}
      </div>
    </div>
  )
}

export default App
