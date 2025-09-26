// News API Integration - Fixed Version
// This file handles fetching real news data from various sources

class NewsAPI {
    constructor() {
        // Use configuration from config.js
        this.apiKeys = CONFIG.apiKeys;
        this.rankingWeights = CONFIG.rankingWeights;
        
        this.baseUrls = {
            newsapi: 'https://newsapi.org/v2',
            guardian: 'https://content.guardianapis.com',
            nytimes: 'https://api.nytimes.com/svc'
        };
        
        // Cache for daily updates
        this.cache = {
            lastUpdate: null,
            data: {},
            updateInterval: CONFIG.updateIntervals.refreshInterval
        };
        
        this.loadCache();
    }

    // Load cache from localStorage
    loadCache() {
        try {
            const cached = localStorage.getItem('newsCache');
            if (cached) {
                const cacheData = JSON.parse(cached);
                this.cache.lastUpdate = cacheData.lastUpdate ? new Date(cacheData.lastUpdate) : null;
                this.cache.data = cacheData.data || {};
            }
        } catch (error) {
            console.warn('Error loading cache:', error);
        }
    }

    // Save cache to localStorage
    saveCache() {
        try {
            const cacheData = {
                lastUpdate: this.cache.lastUpdate,
                data: this.cache.data
            };
            localStorage.setItem('newsCache', JSON.stringify(cacheData));
        } catch (error) {
            console.warn('Error saving cache:', error);
        }
    }

    // Check if cache needs update
    needsUpdate() {
        if (!this.cache.lastUpdate) return true;
        const now = new Date();
        const diff = now - this.cache.lastUpdate;
        return diff > this.cache.updateInterval;
    }

    // Clear cache and force update
    clearCache() {
        this.cache.lastUpdate = null;
        this.cache.data = {};
        localStorage.removeItem('newsCache');
        console.log('Cache cleared');
    }

    // Alternative clear cache method for compatibility
    clearCacheData() {
        this.clearCache();
    }

    // Force refresh all content
    async forceRefresh() {
        console.log('Force refreshing all content...');
        this.cache.lastUpdate = null;
        this.cache.data = {};
        
        // Refresh all sections
        const sections = [
            'fetchTopStories',
            'fetchNYNews', 
            'fetchUSNews',
            'fetchGlobalNews',
            'fetchOpinion',
            'fetchArtsCulture',
            'fetchFashionTrends',
            'fetchNYEvents'
        ];
        
        const results = await Promise.allSettled(
            sections.map(section => this[section]())
        );
        
        console.log('Content refresh completed');
        return results;
    }

    // Fetch top stories
    async fetchTopStories() {
        try {
            this.loadCache();
            
            // Check if we need to update
            if (!this.needsUpdate() && this.cache.data.topStories) {
                return this.cache.data.topStories;
            }
            
            console.log('Fetching fresh top stories...');
            
            // Try multiple sources
            const sources = [
                () => this.fetchFromNewsAPI('/top-headlines', { country: 'us' }),
                () => this.fetchFromGuardian('/search', { 'show-fields': 'headline,trailText,thumbnail' }),
                () => this.fetchFromNYTimes('/search/v2/articlesearch.json', { q: 'politics' })
            ];
            
            const results = await Promise.allSettled(sources.map(source => source()));
            const articles = [];
            
            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value) {
                    try {
                        const processed = this.processArticles(result.value, index);
                        articles.push(...processed);
                    } catch (error) {
                        console.warn(`Error processing articles from source ${index}:`, error);
                    }
                }
            });
            
            if (articles.length > 0) {
                const ranked = this.rankArticles(articles);
                this.cache.data.topStories = ranked;
                this.cache.lastUpdate = new Date();
                this.saveCache();
                return ranked;
            } else {
                // Return empty array if no real articles
                return [];
            }
            
        } catch (error) {
            console.error('Error fetching top stories:', error);
            return this.cache.data.topStories || this.getMockTopStories();
        }
    }

    // Fetch NY News
    async fetchNYNews() {
        try {
            this.loadCache();
            
            if (!this.needsUpdate() && this.cache.data.nyNews) {
                return this.cache.data.nyNews;
            }
            
            console.log('Fetching fresh NY news...');
            
            const sources = [
                () => this.fetchFromNewsAPI('/top-headlines', { country: 'us', category: 'politics' }),
                () => this.fetchFromGuardian('/search', { 'show-fields': 'headline,trailText,thumbnail', q: 'New York' }),
                () => this.fetchFromNYTimes('/search/v2/articlesearch.json', { q: 'New York politics' })
            ];
            
            const results = await Promise.allSettled(sources.map(source => source()));
            const articles = [];
            
            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value) {
                    try {
                        const processed = this.processArticles(result.value, index);
                        articles.push(...processed);
                    } catch (error) {
                        console.warn(`Error processing NY news from source ${index}:`, error);
                    }
                }
            });
            
            if (articles.length > 0) {
                const ranked = this.rankArticles(articles);
                this.cache.data.nyNews = ranked;
                this.cache.lastUpdate = new Date();
                this.saveCache();
                return ranked;
            } else {
                return [];
            }
            
        } catch (error) {
            console.error('Error fetching NY news:', error);
            return this.cache.data.nyNews || this.getMockNYNews();
        }
    }

    // Fetch US News
    async fetchUSNews() {
        try {
            this.loadCache();
            
            if (!this.needsUpdate() && this.cache.data.usNews) {
                return this.cache.data.usNews;
            }
            
            console.log('Fetching fresh US news...');
            
            const sources = [
                () => this.fetchFromNewsAPI('/top-headlines', { country: 'us' }),
                () => this.fetchFromGuardian('/search', { 'show-fields': 'headline,trailText,thumbnail', q: 'US politics' }),
                () => this.fetchFromNYTimes('/search/v2/articlesearch.json', { q: 'US politics' })
            ];
            
            const results = await Promise.allSettled(sources.map(source => source()));
            const articles = [];
            
            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value) {
                    try {
                        const processed = this.processArticles(result.value, index);
                        articles.push(...processed);
                    } catch (error) {
                        console.warn(`Error processing US news from source ${index}:`, error);
                    }
                }
            });
            
            if (articles.length > 0) {
                const ranked = this.rankArticles(articles);
                this.cache.data.usNews = ranked;
                this.cache.lastUpdate = new Date();
                this.saveCache();
                return ranked;
            } else {
                return [];
            }
            
        } catch (error) {
            console.error('Error fetching US news:', error);
            return this.cache.data.usNews || this.getMockUSNews();
        }
    }

    // Fetch Global News
    async fetchGlobalNews() {
        try {
            this.loadCache();
            
            if (!this.needsUpdate() && this.cache.data.globalNews) {
                return this.cache.data.globalNews;
            }
            
            console.log('Fetching fresh global news...');
            
            const sources = [
                () => this.fetchFromNewsAPI('/top-headlines', { country: 'us', category: 'general' }),
                () => this.fetchFromGuardian('/search', { 'show-fields': 'headline,trailText,thumbnail' }),
                () => this.fetchFromNYTimes('/search/v2/articlesearch.json', { q: 'world news' })
            ];
            
            const results = await Promise.allSettled(sources.map(source => source()));
            const articles = [];
            
            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value) {
                    try {
                        const processed = this.processArticles(result.value, index);
                        articles.push(...processed);
                    } catch (error) {
                        console.warn(`Error processing global news from source ${index}:`, error);
                    }
                }
            });
            
            if (articles.length > 0) {
                const ranked = this.rankArticles(articles);
                this.cache.data.globalNews = ranked;
                this.cache.lastUpdate = new Date();
                this.saveCache();
                return ranked;
            } else {
                return [];
            }
            
        } catch (error) {
            console.error('Error fetching global news:', error);
            return this.cache.data.globalNews || this.getMockGlobalNews();
        }
    }

    // Fetch Opinion Articles
    async fetchOpinion() {
        try {
            this.loadCache();
            
            // Temporarily bypass cache for testing
            console.log('Bypassing cache for Opinion - fetching fresh data');
            // if (!this.needsUpdate() && this.cache.data.opinion) {
            //     return this.cache.data.opinion;
            // }
            
            console.log('Fetching fresh opinion articles...');
            
            const sources = [
                () => this.fetchFromGuardian('/search', { 'show-fields': 'headline,trailText,thumbnail', q: 'news' }),
                () => this.fetchFromNYTimes('/search/v2/articlesearch.json', { q: 'news' })
            ];
            
            const results = await Promise.allSettled(sources.map(source => source()));
            const articles = [];
            
            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value) {
                    try {
                        const processed = this.processArticles(result.value, index);
                        articles.push(...processed);
                    } catch (error) {
                        console.warn(`Error processing opinion from source ${index}:`, error);
                    }
                }
            });
            
            if (articles.length > 0) {
                const ranked = this.rankArticles(articles);
                this.cache.data.opinion = ranked;
                this.cache.lastUpdate = new Date();
                this.saveCache();
                return ranked;
            } else {
                return [];
            }
            
        } catch (error) {
            console.error('Error fetching opinion articles:', error);
            return this.cache.data.opinion || [];
        }
    }

    // Fetch Arts & Culture
    async fetchArtsCulture() {
        try {
            this.loadCache();
            
            // Temporarily bypass cache for testing
            console.log('Bypassing cache for Arts - fetching fresh data');
            // if (!this.needsUpdate() && this.cache.data.artsCulture) {
            //     return this.cache.data.artsCulture;
            // }
            
            console.log('Fetching fresh arts & culture...');
            
            const sources = [
                () => this.fetchFromGuardian('/search', { 'show-fields': 'headline,trailText,thumbnail', q: 'news' }),
                () => this.fetchFromNYTimes('/search/v2/articlesearch.json', { q: 'news' })
            ];
            
            const results = await Promise.allSettled(sources.map(source => source()));
            const articles = [];
            
            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value) {
                    try {
                        const processed = this.processArticles(result.value, index);
                        articles.push(...processed);
                    } catch (error) {
                        console.warn(`Error processing arts & culture from source ${index}:`, error);
                    }
                }
            });
            
            if (articles.length > 0) {
                const ranked = this.rankArticles(articles);
                this.cache.data.artsCulture = ranked;
                this.cache.lastUpdate = new Date();
                this.saveCache();
                return ranked;
            } else {
                return [];
            }
            
        } catch (error) {
            console.error('Error fetching arts & culture:', error);
            return this.cache.data.artsCulture || [];
        }
    }

    // Fetch Fashion & Trends
    async fetchFashionTrends() {
        try {
            this.loadCache();
            
            // Temporarily bypass cache for testing
            console.log('Bypassing cache for Fashion - fetching fresh data');
            // if (!this.needsUpdate() && this.cache.data.fashionTrends) {
            //     return this.cache.data.fashionTrends;
            // }
            
            console.log('Fetching fresh fashion & trends...');
            
            const sources = [
                () => this.fetchFromGuardian('/search', { 'show-fields': 'headline,trailText,thumbnail', q: 'news' }),
                () => this.fetchFromNYTimes('/search/v2/articlesearch.json', { q: 'news' })
            ];
            
            const results = await Promise.allSettled(sources.map(source => source()));
            const articles = [];
            
            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value) {
                    try {
                        const processed = this.processArticles(result.value, index);
                        articles.push(...processed);
                    } catch (error) {
                        console.warn(`Error processing fashion & trends from source ${index}:`, error);
                    }
                }
            });
            
            if (articles.length > 0) {
                const ranked = this.rankArticles(articles);
                this.cache.data.fashionTrends = ranked;
                this.cache.lastUpdate = new Date();
                this.saveCache();
                return ranked;
            } else {
                return [];
            }
            
        } catch (error) {
            console.error('Error fetching fashion & trends:', error);
            return this.cache.data.fashionTrends || [];
        }
    }

    // Fetch NY Events
    async fetchNYEvents() {
        try {
            this.loadCache();
            
            // Temporarily bypass cache for testing
            console.log('Bypassing cache for Events - fetching fresh data');
            // if (!this.needsUpdate() && this.cache.data.nyEvents) {
            //     return this.cache.data.nyEvents;
            // }
            
            console.log('Fetching fresh NY events...');
            
            const sources = [
                () => this.fetchFromGuardian('/search', { 'show-fields': 'headline,trailText,thumbnail', q: 'news' }),
                () => this.fetchFromNYTimes('/search/v2/articlesearch.json', { q: 'news' })
            ];
            
            const results = await Promise.allSettled(sources.map(source => source()));
            const articles = [];
            
            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value) {
                    try {
                        const processed = this.processArticles(result.value, index);
                        articles.push(...processed);
                    } catch (error) {
                        console.warn(`Error processing NY events from source ${index}:`, error);
                    }
                }
            });
            
            if (articles.length > 0) {
                const ranked = this.rankArticles(articles);
                this.cache.data.nyEvents = ranked;
                this.cache.lastUpdate = new Date();
                this.saveCache();
                return ranked;
            } else {
                return [];
            }
            
        } catch (error) {
            console.error('Error fetching NY events:', error);
            return this.cache.data.nyEvents || [];
        }
    }

    // Fetch from NewsAPI
    async fetchFromNewsAPI(endpoint, params = {}) {
        if (!this.apiKeys.newsapi || this.apiKeys.newsapi === 'your-newsapi-key-here') {
            console.warn('NewsAPI key not configured, skipping...');
            return null;
        }

        try {
            const url = new URL(`${this.baseUrls.newsapi}${endpoint}`);
            url.searchParams.append('apiKey', this.apiKeys.newsapi);

            Object.keys(params).forEach(key => {
                url.searchParams.append(key, params[key]);
            });

            const response = await fetch(url);
            if (!response.ok) {
                console.warn(`NewsAPI error: ${response.status}`);
                return null;
            }

            return await response.json();
        } catch (error) {
            console.warn('NewsAPI fetch error:', error.message);
            return null;
        }
    }

    // Fetch from Guardian API
    async fetchFromGuardian(endpoint, params = {}) {
        if (!this.apiKeys.guardian || this.apiKeys.guardian === 'your-guardian-key-here') {
            console.warn('Guardian API key not configured, skipping...');
            return null;
        }

        try {
            const url = new URL(`${this.baseUrls.guardian}${endpoint}`);
            url.searchParams.append('api-key', this.apiKeys.guardian);

            Object.keys(params).forEach(key => {
                url.searchParams.append(key, params[key]);
            });

            const response = await fetch(url);
            if (!response.ok) {
                console.warn(`Guardian API error: ${response.status}`);
                return null;
            }

            return await response.json();
        } catch (error) {
            console.warn('Guardian API fetch error:', error.message);
            return null;
        }
    }

    // Fetch from NY Times API
    async fetchFromNYTimes(endpoint, params = {}) {
        if (!this.apiKeys.nytimes || this.apiKeys.nytimes === 'your-nytimes-key-here') {
            console.warn('NY Times API key not configured, skipping...');
            return null;
        }

        try {
            const url = new URL(`${this.baseUrls.nytimes}${endpoint}`);
            url.searchParams.append('api-key', this.apiKeys.nytimes);

            Object.keys(params).forEach(key => {
                url.searchParams.append(key, params[key]);
            });

            const response = await fetch(url);
            if (!response.ok) {
                console.warn(`NY Times API error: ${response.status}`);
                return null;
            }

            return await response.json();
        } catch (error) {
            console.warn('NY Times API fetch error:', error.message);
            return null;
        }
    }

    // Process articles from different sources
    processArticles(data, sourceIndex) {
        const articles = [];
        console.log(`Processing articles from source ${sourceIndex}:`, data);
        
        switch (sourceIndex) {
            case 0: // NewsAPI
                if (data.articles) {
                    data.articles.forEach(article => {
                        articles.push({
                            headline: article.title,
                            summary: article.description,
                            image: article.urlToImage || 'https://via.placeholder.com/600x400/1a1a1a/ffffff?text=No+Image',
                            source: article.source.name,
                            time: this.formatTime(article.publishedAt),
                            url: article.url,
                            publishedAt: new Date(article.publishedAt),
                            sourceType: 'newsapi'
                        });
                    });
                }
                break;
                
            case 1: // Guardian
                if (data.response && data.response.results) {
                    data.response.results.forEach(article => {
                        articles.push({
                            headline: article.webTitle,
                            summary: article.fields?.trailText || article.webTitle,
                            image: article.fields?.thumbnail || 'https://via.placeholder.com/600x400/1a1a1a/ffffff?text=No+Image',
                            source: 'The Guardian',
                            time: this.formatTime(article.webPublicationDate),
                            url: article.webUrl,
                            publishedAt: new Date(article.webPublicationDate),
                            sourceType: 'guardian'
                        });
                    });
                }
                break;
                
            case 2: // NY Times
                if (data.response && data.response.docs) {
                    data.response.docs.forEach(article => {
                        articles.push({
                            headline: article.headline?.main || article.title,
                            summary: article.abstract || article.snippet,
                            image: article.multimedia?.[0]?.url ? `https://static01.nyt.com/${article.multimedia[0].url}` : 'https://via.placeholder.com/600x400/1a1a1a/ffffff?text=No+Image',
                            source: 'The New York Times',
                            time: this.formatTime(article.pub_date),
                            url: article.web_url,
                            publishedAt: new Date(article.pub_date),
                            sourceType: 'nytimes'
                        });
                    });
                } else if (data.results) {
                    // Fallback for other NY Times API formats
                    data.results.forEach(article => {
                        articles.push({
                            headline: article.title,
                            summary: article.abstract,
                            image: article.multimedia?.[0]?.url ? `https://static01.nyt.com/${article.multimedia[0].url}` : 'https://via.placeholder.com/600x400/1a1a1a/ffffff?text=No+Image',
                            source: 'The New York Times',
                            time: this.formatTime(article.published_date),
                            url: article.url,
                            publishedAt: new Date(article.published_date),
                            sourceType: 'nytimes'
                        });
                    });
                }
                break;
        }
        
        console.log(`Processed ${articles.length} articles from source ${sourceIndex}`);
        return articles;
    }

    // Rank articles by relevance and recency
    rankArticles(articles) {
        console.log(`Ranking ${articles.length} articles`);
        const filtered = articles.filter(article => article.headline && article.url);
        console.log(`After filtering: ${filtered.length} articles`);
        return filtered.sort((a, b) => {
                let scoreA = 0;
                let scoreB = 0;
                
                // Recency score
                const now = new Date();
                const ageA = now - a.publishedAt;
                const ageB = now - b.publishedAt;
                scoreA += Math.max(0, 100 - (ageA / (1000 * 60 * 60 * 24))); // Days
                scoreB += Math.max(0, 100 - (ageB / (1000 * 60 * 60 * 24)));
                
                // Source credibility
                const sourceCredibility = {
                    'The New York Times': 10,
                    'The Guardian': 9,
                    'BBC News': 8,
                    'CNN': 7,
                    'Reuters': 8,
                    'Associated Press': 8
                };
                scoreA += sourceCredibility[a.source] || 5;
                scoreB += sourceCredibility[b.source] || 5;
                
                return scoreB - scoreA;
            })
            .slice(0, 10); // Limit to top 10
    }

    // Format time for display
    formatTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    }

    // Mock data methods
    getMockTopStories() {
        return [
            {
                headline: "Breaking: Major Political Development",
                summary: "A significant political event has occurred that will impact the nation.",
                image: "https://via.placeholder.com/600x400/1a1a1a/ffffff?text=Breaking+News",
                source: "Mock News",
                time: "2h ago",
                url: "https://example.com/breaking-news",
                publishedAt: new Date(),
                sourceType: 'mock'
            }
        ];
    }

    getMockNYNews() {
        return [
            {
                headline: "New York City Updates",
                summary: "Latest developments in New York City politics and current events.",
                image: "https://via.placeholder.com/600x400/1a1a1a/ffffff?text=NY+News",
                source: "Mock News",
                time: "3h ago",
                url: "https://example.com/ny-news",
                publishedAt: new Date(),
                sourceType: 'mock'
            }
        ];
    }

    getMockUSNews() {
        return [
            {
                headline: "US Political Updates",
                summary: "Latest news from Washington and across the United States.",
                image: "https://via.placeholder.com/600x400/1a1a1a/ffffff?text=US+News",
                source: "Mock News",
                time: "4h ago",
                url: "https://example.com/us-news",
                publishedAt: new Date(),
                sourceType: 'mock'
            }
        ];
    }

    getMockGlobalNews() {
        return [
            {
                headline: "Global News Update",
                summary: "Important developments from around the world.",
                image: "https://via.placeholder.com/600x400/1a1a1a/ffffff?text=Global+News",
                source: "Mock News",
                time: "5h ago",
                url: "https://example.com/global-news",
                publishedAt: new Date(),
                sourceType: 'mock'
            }
        ];
    }

    getMockOpinion() {
        return [
            {
                headline: "Opinion: Current Affairs",
                summary: "An editorial perspective on today's most important issues.",
                image: "https://via.placeholder.com/600x400/1a1a1a/ffffff?text=Opinion",
                source: "Mock News",
                time: "6h ago",
                url: "https://example.com/opinion",
                publishedAt: new Date(),
                sourceType: 'mock'
            }
        ];
    }

    getMockArtsCulture() {
        return [
            {
                headline: "Arts & Culture Spotlight",
                summary: "The latest in arts, culture, and entertainment.",
                image: "https://via.placeholder.com/600x400/1a1a1a/ffffff?text=Arts+Culture",
                source: "Mock News",
                time: "7h ago",
                url: "https://example.com/arts-culture",
                publishedAt: new Date(),
                sourceType: 'mock'
            }
        ];
    }

    getMockFashionTrends() {
        return [
            {
                headline: "Fashion & Trends Update",
                summary: "The latest in fashion, style, and cultural trends.",
                image: "https://via.placeholder.com/600x400/1a1a1a/ffffff?text=Fashion+Trends",
                source: "Mock News",
                time: "8h ago",
                url: "https://example.com/fashion-trends",
                publishedAt: new Date(),
                sourceType: 'mock'
            }
        ];
    }

    getMockNYEvents() {
        return [
            {
                headline: "New York Events",
                summary: "What's happening in New York City this week.",
                image: "https://via.placeholder.com/600x400/1a1a1a/ffffff?text=NY+Events",
                source: "Mock News",
                time: "9h ago",
                url: "https://example.com/ny-events",
                publishedAt: new Date(),
                sourceType: 'mock'
            }
        ];
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NewsAPI;
} else {
    window.NewsAPI = NewsAPI;
}
