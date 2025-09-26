// Configuration file for Daily News Platform
// Replace the placeholder values with your actual API keys

const CONFIG = {
    // API Keys - Get these from the respective services
    apiKeys: {
        // NewsAPI - Free tier: 1000 requests/day
        // Get your key at: https://newsapi.org/
        newsapi: '6ce6ad8f6dc149748aa5d88eaa26632e',
        
        // Guardian API - Free tier: 5000 requests/day
        // Get your key at: https://open-platform.theguardian.com/
        guardian: '4ee83d60-f3c2-432f-bccd-edda4bad2bbe',
        
        // New York Times API - Free tier: 1000 requests/day
        // Get your key at: https://developer.nytimes.com/
        nytimes: 'ryJNFYRNEe5nntlRnMCNJLnC1CQE6Juh'
    },
    
    // Update intervals (in milliseconds)
    updateIntervals: {
        // How often to check for new content
        checkInterval: 6 * 60 * 60 * 1000, // 6 hours
        
        // How often to force refresh content
        refreshInterval: 24 * 60 * 60 * 1000, // 24 hours
        
        // How often to update cache
        cacheInterval: 2 * 60 * 60 * 1000 // 2 hours
    },
    
    // Content ranking weights
    rankingWeights: {
        recency: 0.3,      // How recent the article is
        relevance: 0.4,     // How relevant to the category
        source: 0.2,        // Source credibility
        engagement: 0.1    // Engagement potential
    },
    
    // News sources configuration
    sources: {
        // Top stories sources
        topStories: {
            newsapi: { country: 'us', pageSize: 10 },
            guardian: { section: 'world', 'page-size': 5 },
            nytimes: { section: 'home' }
        },
        
        // New York news sources
        nyNews: {
            newsapi: { q: 'New York OR NYC OR Manhattan OR Brooklyn', pageSize: 8 },
            guardian: { section: 'us-news', q: 'New York', 'page-size': 5 }
        },
        
        // US news sources
        usNews: {
            newsapi: { country: 'us', category: 'politics', pageSize: 8 },
            guardian: { section: 'us-news', 'page-size': 5 },
            nytimes: { section: 'politics' }
        },
        
        // Global news sources
        globalNews: {
            newsapi: { country: 'us', pageSize: 8 },
            guardian: { section: 'world', 'page-size': 5 },
            nytimes: { section: 'world' }
        },
        
        // Opinion sources
        opinion: {
            newsapi: { q: 'opinion OR editorial OR analysis', pageSize: 6 },
            guardian: { section: 'commentisfree', 'page-size': 4 },
            nytimes: { section: 'opinion' }
        },
        
        // Arts & culture sources
        artsCulture: {
            newsapi: { q: 'art OR culture OR museum OR theater OR music', pageSize: 6 },
            guardian: { section: 'culture', 'page-size': 4 },
            nytimes: { section: 'arts' }
        },
        
        // Fashion & trends sources
        fashionTrends: {
            newsapi: { q: 'fashion OR style OR design OR trend', pageSize: 6 },
            guardian: { section: 'fashion', 'page-size': 4 },
            nytimes: { section: 'fashion' }
        },
        
        // New York events sources
        nyEvents: {
            newsapi: { q: 'New York events OR NYC events OR Manhattan events', pageSize: 6 },
            guardian: { section: 'us-news', q: 'New York events', 'page-size': 4 }
        }
    },
    
    // Fallback content settings
    fallback: {
        // Use mock data when APIs fail
        useMockData: true,
        
        // Show error messages to users
        showErrors: false,
        
        // Retry failed requests
        retryAttempts: 3,
        retryDelay: 1000 // 1 second
    },
    
    // Performance settings
    performance: {
        // Enable caching
        enableCaching: true,
        
        // Cache duration (24 hours)
        cacheDuration: 24 * 60 * 60 * 1000,
        
        // Maximum articles per section
        maxArticles: 10,
        
        // Image optimization
        optimizeImages: true,
        imageQuality: 80
    },
    
    // UI settings
    ui: {
        // Show loading indicators
        showLoading: true,
        
        // Show last update time
        showLastUpdate: true,
        
        // Enable dark mode by default
        defaultDarkMode: false,
        
        // Animation duration
        animationDuration: 300
    }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}
