import React, { useEffect, useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import Chatbot from './Chatbot'
import Calender from './Calender'
import './News.css'
import userImg from '../assets/images/user.jpg'
import noImg from '../assets/images/no-img.png'
import blogImg1 from '../assets/images/blog1.jpg'
import axios from 'axios'
import NewsModal from './NewsModal'
import Bookmarks from './Bookmarks'
import BlogsModal from './BlogsModal'
import WarningModal from './WarningModal'
import UserProfileModal from './UserProfileModal'

const categories = [
    'general', 
    'world', 
    'business', 
    'technology',
    'entertainment',
    'sports',
    'science',
    'health',
    'nation',
]

function News({onShowBlogs, blogs,onEditBlog, onDeleteBlog, user}) {
    const [headline, setHeadline] = useState(null)
    const [news, setNews] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('general')
    const [searchInput, setSearchInput] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [showModal, setShowModal] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [bookmarks, setBookmarks] = useState([])
    const [showBookmarksModal, setShowBookmarksModal ] = useState(false)
    const [selectedPost, setSelectedPost] = useState(null)
    const [showBlogModal, setShowBlogModal] = useState(false)
    const [showWarning, setShowWarning] = useState(false)
    const [showUserProfile, setShowUserProfile] = useState(false)
    const [userData, setUserData] = useState({
        name: user?.displayName || "User",
        email: user?.email || "",
        profilePic: user?.photoURL || userImg
    })
    const MAX_BOOKMARKS = 5;

    useEffect(() => {
        // Define the async function inside useEffect
        const fetchNews = async () => {
            const apikey = '224ee70d8fe0426cb82f92b9e8f5726b';
            //const category = 'general';
            const language = 'en';
            const country = 'in';
            let url = `https://gnews.io/api/v4/top-headlines?category=${selectedCategory}&lang=${language}&country=${country}&max=10&apikey=${apikey}`;
            
            if (searchQuery) {
                url = `https://gnews.io/api/v4/search?q=${searchQuery}&lang=${language}&country=${country}&max=10&apikey=${apikey}`;
            }

            try {
                const response = await axios.get(url);
                const fetchedNews = response.data.articles;

                fetchedNews.forEach((article) => {
                    if(!article.image) {
                        article.image = noImg;
                    }
                })
                
                setHeadline(fetchedNews[0]);
                setNews(fetchedNews.slice(1, 7));
                console.log(fetchedNews[0]);

                const savedBookmarks = JSON.parse(
                    localStorage.getItem("bookmarks")
                ) || [] 

                setBookmarks(savedBookmarks)
            } catch (error) {
                console.error("Error fetching news:", error);
            }
        };
        fetchNews()
    }, [selectedCategory, searchQuery]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    }

    const handleCategoryClick = (e, category) => {
        e.preventDefault()
        setSelectedCategory(category)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        setSearchQuery(searchInput)
        setSearchInput('') 
    }

    const handleArticleClick = (article) => {
        setSelectedArticle(article)
        setShowModal(true)
    }

    const handleBokmarkClicks = (article) => {
        const isBookmarked = bookmarks.some(bookmark => bookmark.title === article.title);
        
        if (isBookmarked) {
            // Remove bookmark
            setBookmarks(prevBookmarks => {
                const updatedBookmarks = prevBookmarks.filter(bookmark => bookmark.title !== article.title);
                localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
                return updatedBookmarks;
            });
        } else {
            // Check if we can add more bookmarks
            if (bookmarks.length >= MAX_BOOKMARKS) {
                setShowWarning(true);
                return;
            }
            
            // Add bookmark
            setBookmarks(prevBookmarks => {
                const updatedBookmarks = [...prevBookmarks, article];
                localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
                return updatedBookmarks;
            });
        }
    }

    const handleBlogClick = (blog) => {
        setSelectedPost(blog)
        setShowBlogModal(true)
    }

    const handleCloseBlogModal = () => {
        setShowBlogModal(false)
        setSelectedPost(null)
    }

    const handleUserProfileUpdate = (updatedData) => {
        setUserData(prevUser => ({
            ...prevUser,
            ...updatedData
        }));
        // Here you would typically make an API call to update the user data on the server
    }

  return (
    <div className='news'>
        <header className="news-header">
            <h1 className="logo">SimpleFeed.AI</h1>
            <div className="search-bar">
                <form onSubmit={handleSearch}>
                    <input 
                    type="text" 
                    placeholder='Search News...' 
                    value={searchInput}
                    onChange={(e)=>setSearchInput(e.target.value)}
                    />
                    <button type='submit'>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                </form>
            </div>
        </header>
        <div className="news-content">
            <div className="navbar">
                <div className="user" onClick={() => setShowUserProfile(true)}>
                    <img src={userData.profilePic} alt="User Image" />
                    <p>{userData.name}</p>
                </div>
                <nav className="categories">
                    <h1 className="nav-heading">Categories</h1>
                    <div className="nav-links">
                        {categories.map((category) => (
                            <a 
                            href="#" 
                            key = {category} 
                            className='nav-link'
                            onClick={(e) => handleCategoryClick(e, category)}
                            >
                                {category}
                            </a>
                        ))} 
                        <a href="#" className='nav-link' 
                        onClick={() => setShowBookmarksModal(true)}
                        >
                            Bookmarks <i className="fa-solid fa-bookmark"></i>
                        </a>
                        <a href="#" className='nav-link' onClick={handleLogout}>
                            Logout <i className="fa-solid fa-right-from-bracket"></i>
                        </a>
                    </div>
                </nav>
            </div> 
            <div className="news-section">
                {headline && (
                    <div className="headline" onClick={()=>handleArticleClick(headline)}>
                        <img src={headline.image || noImg} alt={headline.title} />
                        <h2 className="headline-title">
                            {headline.title}
                            <i className={`${bookmarks.some((bookmark) => bookmark.title === headline.title)
                            ? "fa-solid"
                            : "fa-regular"
                            } fa-bookmark bookmark`} onClick={(e) => {
                                e.stopPropagation()
                                handleBokmarkClicks(headline)
                            }
                            }></i>                        
                        </h2>
                    </div>
                )}
                <div className="news-grid"> 
                    {news.map((article, index) => (
                        <div key={index} className="news-grid-item" onClick={()=>handleArticleClick(article)}>
                            <img src={article.image || noImg} alt={article.title}/>
                            <h3>{article.title}</h3>
                            <i className={`${bookmarks.some((bookmark) => bookmark.title === article.title)
                            ? "fa-solid"
                            : "fa-regular"
                            } fa-bookmark bookmark`} onClick={(e) => {
                                e.stopPropagation()
                                handleBokmarkClicks(article)
                            }
                            }></i>
                        </div>
                    ))}
                </div>
            </div>
            <NewsModal 
            show = {showModal} 
            article = {selectedArticle}
            onClose = {() => setShowModal(false)}
            />
            <Bookmarks 
            show={showBookmarksModal} 
            bookmarks={bookmarks} 
            onClose={()=>{setShowBookmarksModal(false)}}
            onSelectArticle = {handleArticleClick}
            onDeleteBookmark={handleBokmarkClicks} 
            />
            <div className="my-blogs">
                <div className="my-blogs-header">
                    <h1 className="my-blogs-heading">My Blogs</h1>
                    <button className="create-blog-button" onClick={() => onEditBlog(null)}>
                        <i className="fa-solid fa-plus"></i> Create Blog
                    </button>
                </div>
                <div className="blog-posts">
                    {blogs.map((blog, index)=>(
                        <div className="blog-post" key={index} onClick={()=>handleBlogClick(blog)}>
                            <img src={blog.image || noImg} alt={blog.title} />
                            <h3>{blog.title}</h3>
                            <div className="post-buttons">
                                <button className="edit-post" onClick={()=> onEditBlog(blog)}>
                                    <i className="fa-solid fa-edit"></i>
                                </button>
                                <button className="delete-post" onClick={(e)=>{
                                    e.stopPropagation()
                                    onDeleteBlog(blog)
                                }}>
                                    <i className="fa-solid fa-circle-xmark"> </i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedPost && showBlogModal && (
                <BlogsModal show={showBlogModal} blog={selectedPost} onClose={handleCloseBlogModal}/>
            )}
            
            <WarningModal 
                show={showWarning}
                message="You can only bookmark up to 5 articles. Please remove some bookmarks to add new ones or buy a subscription."
                onClose={() => setShowWarning(false)}
            />

            <UserProfileModal
                show={showUserProfile}
                user={userData}
                onClose={() => setShowUserProfile(false)}
                onUpdate={handleUserProfileUpdate}
            />
            
            <div className="chatbot-calender">
            <Chatbot />
            <Calender />
            </div>
        </div>
        <footer className="news-footer">
            <p>
                <span>
                    Simplefeed.AI
                </span>
            </p>
            <p>
                Made with <i className='fa-solid fa-heart'></i> by Jyotiska Bharadwaj
            </p>
        </footer>
    </div>
  )
}

export default News
