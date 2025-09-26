// News Platform JavaScript

// Initialize NewsAPI
const newsAPI = new NewsAPI();

// Set current date
function setCurrentDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const dateString = now.toLocaleDateString('en-US', options);
    document.getElementById('currentDate').textContent = dateString;
}

// Load and display real-time news
async function loadRealTimeNews() {
    try {
        console.log('Loading real-time news...');
        
        // Show loading indicators
        showLoadingIndicators();
        
        // Fetch all news sections
        const [topStories, nyNews, usNews, globalNews, opinion, arts, fashion, events] = await Promise.allSettled([
            newsAPI.fetchTopStories(),
            newsAPI.fetchNYNews(),
            newsAPI.fetchUSNews(),
            newsAPI.fetchGlobalNews(),
            newsAPI.fetchOpinion(),
            newsAPI.fetchArtsCulture(),
            newsAPI.fetchFashionTrends(),
            newsAPI.fetchNYEvents()
        ]);
        
        // Debug: Log results
        console.log('API Results:', {
            topStories: topStories.status,
            nyNews: nyNews.status,
            usNews: usNews.status,
            globalNews: globalNews.status,
            opinion: opinion.status,
            arts: arts.status,
            fashion: fashion.status,
            events: events.status
        });
        
        // Update each section with real data
        if (topStories.status === 'fulfilled' && topStories.value && topStories.value.length > 0) {
            console.log('Top stories loaded:', topStories.value.length, 'articles');
            console.log('Top stories URLs:', topStories.value.map(a => a.url));
            updateTopStories(topStories.value);
        } else {
            console.warn('Top stories failed or empty:', topStories.reason || 'No articles returned');
            updateTopStories([]);
        }
        
        if (nyNews.status === 'fulfilled' && nyNews.value && nyNews.value.length > 0) {
            console.log('NY news loaded:', nyNews.value.length, 'articles');
            updateNYNews(nyNews.value);
        } else {
            console.warn('NY news failed or empty:', nyNews.reason || 'No articles returned');
            updateNYNews([]);
        }
        
        if (usNews.status === 'fulfilled' && usNews.value && usNews.value.length > 0) {
            console.log('US news loaded:', usNews.value.length, 'articles');
            updateUSNews(usNews.value);
        } else {
            console.warn('US news failed or empty:', usNews.reason || 'No articles returned');
            updateUSNews([]);
        }
        
        if (globalNews.status === 'fulfilled' && globalNews.value && globalNews.value.length > 0) {
            console.log('Global news loaded:', globalNews.value.length, 'articles');
            updateGlobalNews(globalNews.value);
        } else {
            console.warn('Global news failed or empty:', globalNews.reason || 'No articles returned');
            updateGlobalNews([]);
        }
        
        if (opinion.status === 'fulfilled' && opinion.value && opinion.value.length > 0) {
            console.log('Opinion loaded:', opinion.value.length, 'articles');
            updateOpinion(opinion.value);
        } else {
            console.warn('Opinion failed or empty:', opinion.reason || 'No articles returned');
            updateOpinion([]);
        }
        
        if (arts.status === 'fulfilled' && arts.value && arts.value.length > 0) {
            console.log('Arts & culture loaded:', arts.value.length, 'articles');
            updateArtsCulture(arts.value);
        } else {
            console.warn('Arts & culture failed or empty:', arts.reason || 'No articles returned');
            updateArtsCulture([]);
        }
        
        if (fashion.status === 'fulfilled' && fashion.value && fashion.value.length > 0) {
            console.log('Fashion loaded:', fashion.value.length, 'articles');
            updateFashionTrends(fashion.value);
        } else {
            console.warn('Fashion failed or empty:', fashion.reason || 'No articles returned');
            updateFashionTrends([]);
        }
        
        if (events.status === 'fulfilled' && events.value && events.value.length > 0) {
            console.log('Events loaded:', events.value.length, 'articles');
            updateNYEvents(events.value);
        } else {
            console.warn('Events failed or empty:', events.reason || 'No articles returned');
            updateNYEvents([]);
        }
        
        // Hide loading indicators
        hideLoadingIndicators();
        
        // Dispatch update event
        window.dispatchEvent(new CustomEvent('newsUpdated'));
        
        // Force update all links after a short delay
        setTimeout(() => {
            updateAllLinks();
        }, 1000);
        
        console.log('Real-time news loaded successfully');
        
    } catch (error) {
        console.error('Error loading real-time news:', error);
        hideLoadingIndicators();
    }
}

// Show loading indicators
function showLoadingIndicators() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-indicator';
        loadingDiv.innerHTML = '<div class="spinner"></div><p>Loading latest news...</p>';
        loadingDiv.style.cssText = `
            text-align: center;
            padding: 2rem;
            color: #666;
        `;
        section.appendChild(loadingDiv);
    });
}

// Hide loading indicators
function hideLoadingIndicators() {
    const loadingIndicators = document.querySelectorAll('.loading-indicator');
    loadingIndicators.forEach(indicator => indicator.remove());
}

// Update top stories section
function updateTopStories(articles) {
    const featuredStory = document.querySelector('.featured-story');
    const storyList = document.querySelector('.story-list');
    
    console.log('Updating top stories with:', articles);
    
    if (articles && articles.length > 0) {
        // Update featured story
        const featured = articles[0];
        if (featured) {
            console.log('Featured article URL:', featured.url);
            const image = featuredStory.querySelector('.story-image img');
            const headline = featuredStory.querySelector('.story-headline');
            const summary = featuredStory.querySelector('.story-summary');
            const readMore = featuredStory.querySelector('.read-more');
            
            if (image) {
                image.src = featured.image || 'https://via.placeholder.com/600x400/1a1a1a/ffffff?text=Breaking+News';
                image.style.cursor = 'pointer';
                image.onclick = () => window.open(featured.url, '_blank', 'noopener,noreferrer');
            }
            if (headline) {
                headline.textContent = featured.headline;
                headline.style.cursor = 'pointer';
                headline.onclick = () => window.open(featured.url, '_blank', 'noopener,noreferrer');
            }
            if (summary) summary.textContent = featured.summary;
            if (readMore) {
                readMore.href = featured.url;
                readMore.target = '_blank';
                readMore.rel = 'noopener noreferrer';
                console.log('Updated featured story link to:', readMore.href);
            }
        }
        
        // Update story list
        const storyItems = storyList.querySelectorAll('.story-item');
        articles.slice(1, 4).forEach((article, index) => {
            if (storyItems[index]) {
                const title = storyItems[index].querySelector('.story-title');
                const excerpt = storyItems[index].querySelector('.story-excerpt');
                const time = storyItems[index].querySelector('.story-time');
                
                if (title) title.textContent = article.headline;
                if (excerpt) excerpt.textContent = article.summary;
                if (time) time.textContent = article.time;
            }
        });
    }
}

// Update NY news section
function updateNYNews(articles) {
    const newsCards = document.querySelectorAll('#ny-news .news-card');
    
    articles.slice(0, 3).forEach((article, index) => {
        if (newsCards[index]) {
            const image = newsCards[index].querySelector('.news-image img');
            const headline = newsCards[index].querySelector('.news-headline');
            const summary = newsCards[index].querySelector('.news-summary');
            const source = newsCards[index].querySelector('.news-source');
            const time = newsCards[index].querySelector('.news-time');
            const readMore = newsCards[index].querySelector('.read-more');
            
            if (image) image.src = article.image || 'https://via.placeholder.com/300x200/2c2c2c/ffffff?text=NYC+News';
            if (headline) headline.textContent = article.headline;
            if (summary) summary.textContent = article.summary;
            if (source) source.textContent = article.source;
            if (time) time.textContent = article.time;
            if (readMore) {
                readMore.href = article.url;
                readMore.target = '_blank';
                readMore.rel = 'noopener noreferrer';
            }
        }
    });
}

// Update US news section
function updateUSNews(articles) {
    const mainStory = document.querySelector('#us-news .main-story');
    const sidebarStories = document.querySelectorAll('#us-news .sidebar-story');
    
    if (articles && articles.length > 0) {
        // Update main story
        const featured = articles[0];
        if (mainStory && featured) {
            const image = mainStory.querySelector('.story-image img');
            const headline = mainStory.querySelector('.story-headline');
            const summary = mainStory.querySelector('.story-summary');
            const readMore = mainStory.querySelector('.read-more');
            
            if (image) image.src = featured.image || 'https://via.placeholder.com/500x300/1a1a1a/ffffff?text=US+Politics';
            if (headline) headline.textContent = featured.headline;
            if (summary) summary.textContent = featured.summary;
            if (readMore) {
                readMore.href = featured.url;
                readMore.target = '_blank';
                readMore.rel = 'noopener noreferrer';
            }
        }
        
        // Update sidebar stories
        articles.slice(1, 4).forEach((article, index) => {
            if (sidebarStories[index]) {
                const title = sidebarStories[index].querySelector('.story-title');
                const excerpt = sidebarStories[index].querySelector('.story-excerpt');
                const time = sidebarStories[index].querySelector('.story-time');
                
                if (title) title.textContent = article.headline;
                if (excerpt) excerpt.textContent = article.summary;
                if (time) time.textContent = article.time;
            }
        });
    }
}

// Update global news section
function updateGlobalNews(articles) {
    const globalCards = document.querySelectorAll('#global-news .global-card');
    
    articles.slice(0, 4).forEach((article, index) => {
        if (globalCards[index]) {
            const region = globalCards[index].querySelector('.region');
            const headline = globalCards[index].querySelector('.card-headline');
            const summary = globalCards[index].querySelector('.card-summary');
            const time = globalCards[index].querySelector('.time');
            const readMore = globalCards[index].querySelector('.read-more');
            
            if (region) region.textContent = article.region;
            if (headline) headline.textContent = article.headline;
            if (summary) summary.textContent = article.summary;
            if (time) time.textContent = article.time;
            if (readMore) {
                readMore.href = article.url;
                readMore.target = '_blank';
                readMore.rel = 'noopener noreferrer';
            }
        }
    });
}

// Update opinion section
function updateOpinion(articles) {
    const opinionFeatured = document.querySelector('#opinion .opinion-featured');
    const opinionList = document.querySelectorAll('#opinion .opinion-item');
    
    if (articles && articles.length > 0) {
        // Update featured opinion
        const featured = articles[0];
        if (opinionFeatured && featured) {
            const image = opinionFeatured.querySelector('.opinion-image img');
            const author = opinionFeatured.querySelector('.opinion-author');
            const headline = opinionFeatured.querySelector('.opinion-headline');
            const summary = opinionFeatured.querySelector('.opinion-summary');
            const readMore = opinionFeatured.querySelector('.read-more');
            
            if (image) image.src = featured.image || 'https://via.placeholder.com/400x250/2c2c2c/ffffff?text=Opinion';
            if (author) author.textContent = `By ${featured.author}`;
            if (headline) headline.textContent = featured.headline;
            if (summary) summary.textContent = featured.summary;
            if (readMore) {
                readMore.href = featured.url;
                readMore.target = '_blank';
                readMore.rel = 'noopener noreferrer';
            }
        }
        
        // Update opinion list
        articles.slice(1, 4).forEach((article, index) => {
            if (opinionList[index]) {
                const title = opinionList[index].querySelector('.opinion-title');
                const author = opinionList[index].querySelector('.opinion-author');
                const excerpt = opinionList[index].querySelector('.opinion-excerpt');
                const time = opinionList[index].querySelector('.opinion-time');
                
                if (title) title.textContent = article.headline;
                if (author) author.textContent = `By ${article.author}`;
                if (excerpt) excerpt.textContent = article.summary;
                if (time) time.textContent = article.time;
            }
        });
    }
}

// Update arts & culture section
function updateArtsCulture(articles) {
    const artsFeatured = document.querySelector('#arts .arts-featured');
    const artsList = document.querySelectorAll('#arts .arts-item');
    
    if (articles && articles.length > 0) {
        // Update featured arts
        const featured = articles[0];
        if (artsFeatured && featured) {
            const image = artsFeatured.querySelector('.arts-image img');
            const category = artsFeatured.querySelector('.arts-category');
            const headline = artsFeatured.querySelector('.arts-headline');
            const summary = artsFeatured.querySelector('.arts-summary');
            const readMore = artsFeatured.querySelector('.read-more');
            
            if (image) image.src = featured.image || 'https://via.placeholder.com/500x300/2c2c2c/ffffff?text=NYC+Arts';
            if (category) category.textContent = featured.category;
            if (headline) headline.textContent = featured.headline;
            if (summary) summary.textContent = featured.summary;
            if (readMore) {
                readMore.href = featured.url;
                readMore.target = '_blank';
                readMore.rel = 'noopener noreferrer';
            }
        }
        
        // Update arts list
        articles.slice(1, 4).forEach((article, index) => {
            if (artsList[index]) {
                const title = artsList[index].querySelector('.arts-title');
                const excerpt = artsList[index].querySelector('.arts-excerpt');
                const time = artsList[index].querySelector('.arts-time');
                
                if (title) title.textContent = article.headline;
                if (excerpt) excerpt.textContent = article.summary;
                if (time) time.textContent = article.time;
            }
        });
    }
}

// Update fashion & trends section
function updateFashionTrends(articles) {
    const fashionCards = document.querySelectorAll('#fashion .fashion-card');
    
    articles.slice(0, 3).forEach((article, index) => {
        if (fashionCards[index]) {
            const image = fashionCards[index].querySelector('.fashion-image img');
            const headline = fashionCards[index].querySelector('.fashion-headline');
            const summary = fashionCards[index].querySelector('.fashion-summary');
            const category = fashionCards[index].querySelector('.fashion-category');
            const time = fashionCards[index].querySelector('.fashion-time');
            const readMore = fashionCards[index].querySelector('.read-more');
            
            if (image) image.src = article.image || 'https://via.placeholder.com/300x400/2c2c2c/ffffff?text=Fashion';
            if (headline) headline.textContent = article.headline;
            if (summary) summary.textContent = article.summary;
            if (category) category.textContent = article.category;
            if (time) time.textContent = article.time;
            if (readMore) {
                readMore.href = article.url;
                readMore.target = '_blank';
                readMore.rel = 'noopener noreferrer';
            }
        }
    });
}

// Update NY events section
function updateNYEvents(articles) {
    const eventsFeatured = document.querySelector('#events .events-featured');
    const eventsList = document.querySelectorAll('#events .event-item');
    
    if (articles && articles.length > 0) {
        // Update featured event
        const featured = articles[0];
        if (eventsFeatured && featured) {
            const image = eventsFeatured.querySelector('.event-image img');
            const date = eventsFeatured.querySelector('.event-date');
            const location = eventsFeatured.querySelector('.event-location');
            const headline = eventsFeatured.querySelector('.event-headline');
            const summary = eventsFeatured.querySelector('.event-summary');
            const readMore = eventsFeatured.querySelector('.read-more');
            
            if (image) image.src = featured.image || 'https://via.placeholder.com/400x250/2c2c2c/ffffff?text=NYC+Events';
            if (date) date.textContent = featured.date;
            if (location) location.textContent = featured.location;
            if (headline) headline.textContent = featured.headline;
            if (summary) summary.textContent = featured.summary;
            if (readMore) {
                readMore.href = featured.url;
                readMore.target = '_blank';
                readMore.rel = 'noopener noreferrer';
            }
        }
        
        // Update events list
        articles.slice(1, 4).forEach((article, index) => {
            if (eventsList[index]) {
                const day = eventsList[index].querySelector('.day');
                const month = eventsList[index].querySelector('.month');
                const title = eventsList[index].querySelector('.event-title');
                const location = eventsList[index].querySelector('.event-location');
                const time = eventsList[index].querySelector('.event-time');
                
                if (day) day.textContent = article.date.split(' ')[1];
                if (month) month.textContent = article.date.split(' ')[0].substring(0, 3).toUpperCase();
                if (title) title.textContent = article.headline;
                if (location) location.textContent = article.location;
                if (time) time.textContent = article.time;
            }
        });
    }
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add loading animation for images
function initImageLoading() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.addEventListener('error', function() {
            this.style.opacity = '0.5';
            this.alt = 'Image not available';
        });
    });
}

// Add hover effects to cards
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.news-card, .global-card, .fashion-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Add click tracking for read more links
function initReadMoreTracking() {
    const readMoreLinks = document.querySelectorAll('.read-more');
    
    readMoreLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Don't prevent default - let the link work normally
            // Add visual feedback
            this.style.color = '#666';
            this.style.transform = 'translateX(4px)';
            
            setTimeout(() => {
                this.style.color = '#1a1a1a';
                this.style.transform = 'translateX(0)';
            }, 200);
            
            // Track the click
            console.log('Article clicked:', this.previousElementSibling?.textContent || 'Unknown article');
        });
    });
}

// Force update all links to ensure they're clickable
function updateAllLinks() {
    console.log('Force updating all links...');
    
    // Update all read-more links
    const readMoreLinks = document.querySelectorAll('.read-more');
    readMoreLinks.forEach(link => {
        if (link.href === '#' || link.href === window.location.href + '#') {
            console.log('Found placeholder link:', link);
            // Try to find a parent article with data
            const articleCard = link.closest('.news-card, .global-card, .fashion-card, .featured-story');
            if (articleCard) {
                // Look for any data attributes or try to extract from text
                const headline = articleCard.querySelector('h3, h4');
                if (headline) {
                    console.log('Found headline:', headline.textContent);
                }
            }
        }
    });
    
    // Re-initialize clickable cards
    makeCardsClickable();
}

// Make article cards clickable
function makeCardsClickable() {
    // Make news cards clickable
    const newsCards = document.querySelectorAll('.news-card, .global-card, .fashion-card');
    newsCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on a link
            if (e.target.tagName === 'A') return;
            
            const readMoreLink = this.querySelector('.read-more');
            if (readMoreLink && readMoreLink.href) {
                window.open(readMoreLink.href, '_blank', 'noopener,noreferrer');
            }
        });
    });
    
    // Make story items clickable
    const storyItems = document.querySelectorAll('.story-item, .sidebar-story, .opinion-item, .arts-item');
    storyItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function(e) {
            // Don't trigger if clicking on a link
            if (e.target.tagName === 'A') return;
            
            const readMoreLink = this.querySelector('.read-more');
            if (readMoreLink && readMoreLink.href) {
                window.open(readMoreLink.href, '_blank', 'noopener,noreferrer');
            }
        });
    });
}

// Add search functionality (basic implementation)
function initSearch() {
    // Create search input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search news...';
    searchInput.className = 'search-input';
    searchInput.style.cssText = `
        padding: 0.5rem 1rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin-left: 2rem;
        font-size: 0.9rem;
        width: 200px;
    `;
    
    // Add search input to header
    const headerContainer = document.querySelector('.header-container');
    headerContainer.appendChild(searchInput);
    
    // Add search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const sections = document.querySelectorAll('.section');
        
        sections.forEach(section => {
            const headlines = section.querySelectorAll('h3, h4');
            let hasMatch = false;
            
            headlines.forEach(headline => {
                if (headline.textContent.toLowerCase().includes(searchTerm)) {
                    hasMatch = true;
                    headline.style.backgroundColor = '#ffffcc';
                } else {
                    headline.style.backgroundColor = 'transparent';
                }
            });
            
            section.style.display = searchTerm === '' || hasMatch ? 'block' : 'none';
        });
    });
}

// Add keyboard navigation
function initKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    document.querySelector('#top-stories').scrollIntoView({ behavior: 'smooth' });
                    break;
                case '2':
                    e.preventDefault();
                    document.querySelector('#ny-news').scrollIntoView({ behavior: 'smooth' });
                    break;
                case '3':
                    e.preventDefault();
                    document.querySelector('#us-news').scrollIntoView({ behavior: 'smooth' });
                    break;
                case '4':
                    e.preventDefault();
                    document.querySelector('#global-news').scrollIntoView({ behavior: 'smooth' });
                    break;
            }
        }
    });
}

// Add section highlighting on scroll
function initScrollHighlighting() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav a');
    
    function updateActiveSection() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.style.color = link.getAttribute('href') === `#${current}` ? '#666' : '#1a1a1a';
        });
    }
    
    window.addEventListener('scroll', updateActiveSection);
    updateActiveSection(); // Initial call
}

// Add reading time estimation
function addReadingTime() {
    const articles = document.querySelectorAll('.story-content, .news-content, .opinion-content, .arts-content');
    
    articles.forEach(article => {
        const text = article.textContent;
        const wordCount = text.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words per minute
        
        const readingTimeElement = document.createElement('span');
        readingTimeElement.className = 'reading-time';
        readingTimeElement.textContent = `${readingTime} min read`;
        readingTimeElement.style.cssText = `
            font-size: 0.8rem;
            color: #999;
            font-style: italic;
        `;
        
        const readMoreLink = article.querySelector('.read-more');
        if (readMoreLink) {
            readMoreLink.parentNode.insertBefore(readingTimeElement, readMoreLink);
        }
    });
}

// Add dark mode toggle
function initDarkMode() {
    const darkModeToggle = document.createElement('button');
    darkModeToggle.textContent = '🌙';
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.style.cssText = `
        background: none;
        border: 1px solid #ddd;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        font-size: 1.2rem;
        margin-left: 1rem;
        transition: all 0.3s ease;
    `;
    
    const headerContainer = document.querySelector('.header-container');
    headerContainer.appendChild(darkModeToggle);
    
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        this.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
        
        // Save preference
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });
    
    // Load saved preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
    }
}

// Add CSS for dark mode
function addDarkModeStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .dark-mode {
            background-color: #1a1a1a !important;
            color: #ffffff !important;
        }
        
        .dark-mode .header {
            background-color: #1a1a1a !important;
            border-bottom-color: #333 !important;
        }
        
        .dark-mode .nav a {
            color: #ffffff !important;
        }
        
        .dark-mode .nav a:hover {
            color: #ccc !important;
        }
        
        .dark-mode .section-title {
            color: #ffffff !important;
            border-bottom-color: #333 !important;
        }
        
        .dark-mode h1, .dark-mode h2, .dark-mode h3, .dark-mode h4 {
            color: #ffffff !important;
        }
        
        .dark-mode .news-card, .dark-mode .global-card, .dark-mode .fashion-card {
            background-color: #2a2a2a !important;
            border-color: #333 !important;
        }
        
        .dark-mode .story-summary, .dark-mode .news-summary, .dark-mode .opinion-summary, .dark-mode .arts-summary {
            color: #ccc !important;
        }
        
        .dark-mode .read-more {
            color: #ffffff !important;
        }
        
        .dark-mode .read-more:hover {
            color: #ccc !important;
        }
        
        .dark-mode .footer {
            background-color: #0a0a0a !important;
        }
    `;
    document.head.appendChild(style);
}

// Add performance monitoring
function initPerformanceMonitoring() {
    // Monitor page load time
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    });
    
    // Monitor scroll performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            // Throttle scroll events for better performance
        }, 16); // ~60fps
    });
}

// Add automatic refresh functionality
function initAutoRefresh() {
    // Refresh every 6 hours
    setInterval(async () => {
        console.log('Auto-refreshing news content...');
        await loadRealTimeNews();
    }, 6 * 60 * 60 * 1000);
    
    // Add manual refresh button
    const refreshButton = document.createElement('button');
    refreshButton.textContent = '🔄';
    refreshButton.className = 'refresh-button';
    refreshButton.title = 'Refresh News';
    refreshButton.style.cssText = `
        background: none;
        border: 1px solid #ddd;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        font-size: 1.2rem;
        margin-left: 1rem;
        transition: all 0.3s ease;
    `;
    
    refreshButton.addEventListener('click', async () => {
        refreshButton.style.transform = 'rotate(360deg)';
        refreshButton.textContent = '⏳';
        
        try {
            // Clear cache and force refresh
            newsAPI.clearCache();
            await loadRealTimeNews();
            
            setTimeout(() => {
                refreshButton.style.transform = 'rotate(0deg)';
                refreshButton.textContent = '🔄';
            }, 1000);
        } catch (error) {
            console.error('Refresh error:', error);
            refreshButton.style.transform = 'rotate(0deg)';
            refreshButton.textContent = '🔄';
        }
    });
    
    const headerContainer = document.querySelector('.header-container');
    headerContainer.appendChild(refreshButton);
}

// Add last update indicator
function addLastUpdateIndicator() {
    const lastUpdate = document.createElement('div');
    lastUpdate.className = 'last-update';
    lastUpdate.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-size: 0.8rem;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(lastUpdate);
    
    // Show update indicator
    function showUpdateIndicator() {
        const now = new Date();
        lastUpdate.textContent = `Last updated: ${now.toLocaleTimeString()}`;
        lastUpdate.style.opacity = '1';
        
        setTimeout(() => {
            lastUpdate.style.opacity = '0';
        }, 3000);
    }
    
    // Listen for news updates
    window.addEventListener('newsUpdated', showUpdateIndicator);
}

// Add loading spinner CSS
function addLoadingSpinnerCSS() {
    const style = document.createElement('style');
    style.textContent = `
        .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #1a1a1a;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .refresh-button:hover {
            background-color: #f0f0f0;
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);
}

// Initialize all functionality
function init() {
    setCurrentDate();
    initSmoothScrolling();
    initImageLoading();
    initCardHoverEffects();
    initReadMoreTracking();
    initSearch();
    initKeyboardNavigation();
    initScrollHighlighting();
    addReadingTime();
    initDarkMode();
    addDarkModeStyles();
    initPerformanceMonitoring();
    initAutoRefresh();
    addLastUpdateIndicator();
    addLoadingSpinnerCSS();
    makeCardsClickable();
    
    // Load real-time news on startup
    setTimeout(() => {
        loadRealTimeNews();
    }, 1000);
    
    console.log('Daily News Platform initialized successfully');
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Add service worker for offline functionality (basic implementation)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}
