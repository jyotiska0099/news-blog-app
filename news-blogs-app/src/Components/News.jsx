import React, { useEffect } from 'react'
import Chatbot from './Chatbot'
import Calender from './Calender'
import './News.css'
import userImg from '../assets/images/user.jpg'
import noImg from '../assets/images/no-img.png'
import blogImg1 from '../assets/images/blog1.jpg'
import { useState } from 'react' 
import axios from 'axios'
import NewsModal from './NewsModal'
import Bookmarks from './Bookmarks'
import BlogsModal from './BlogsModal'

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

function News({onShowBlogs, blogs,onEditBlog, onDeleteBlog}) {
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
        setBookmarks((prevBookmarks) => {
            const updatedBookmarks = prevBookmarks.find(
                (bookmark) => bookmark.title === article.title
            )?prevBookmarks.filter((bookmark) => bookmark.title != article.title)
            : [...prevBookmarks, article]
            localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks))
            return updatedBookmarks
        })
    }

    const handleBlogClick = (blog) => {
        setSelectedPost(blog)
        setShowBlogModal(true)
    }

    const handleCloseBlogModal = () => {
        setShowBlogModal(false)
        setSelectedPost(null)
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
                <div className="user" onClick={onShowBlogs}>
                    <img src={userImg} alt="User Image" />
                    <p>Jane's Blog</p>
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
                <h1 className="my-blogs-heading">My Blogs</h1>
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
