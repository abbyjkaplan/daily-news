# Daily News Platform - Setup Guide

## Quick Start

1. **Open the platform**: Simply open `index.html` in your browser
2. **For local development**: Run `python3 -m http.server 8000` and visit `http://localhost:8000`

## API Keys Setup (Optional)

The platform works with mock data by default, but you can enable real-time news by adding API keys:

### 1. NewsAPI (Recommended)
- **Free tier**: 1,000 requests/day
- **Sign up**: https://newsapi.org/
- **Get your key**: After registration, copy your API key
- **Update config**: Edit `config.js` and replace `'your-newsapi-key-here'` with your key

### 2. Guardian API
- **Free tier**: 5,000 requests/day
- **Sign up**: https://open-platform.theguardian.com/
- **Get your key**: After registration, copy your API key
- **Update config**: Edit `config.js` and replace `'your-guardian-key-here'` with your key

### 3. New York Times API
- **Free tier**: 1,000 requests/day
- **Sign up**: https://developer.nytimes.com/
- **Get your key**: After registration, copy your API key
- **Update config**: Edit `config.js` and replace `'your-nytimes-key-here'` with your key

## Configuration

Edit `config.js` to customize:

### API Keys
```javascript
apiKeys: {
    newsapi: 'your-actual-newsapi-key',
    guardian: 'your-actual-guardian-key',
    nytimes: 'your-actual-nytimes-key'
}
```

### Update Intervals
```javascript
updateIntervals: {
    checkInterval: 6 * 60 * 60 * 1000,  // 6 hours
    refreshInterval: 24 * 60 * 60 * 1000, // 24 hours
    cacheInterval: 2 * 60 * 60 * 1000    // 2 hours
}
```

### Content Ranking
```javascript
rankingWeights: {
    recency: 0.3,      // How recent the article is
    relevance: 0.4,    // How relevant to the category
    source: 0.2,       // Source credibility
    engagement: 0.1    // Engagement potential
}
```

## Features

### Automatic Updates
- **Daily refresh**: Content updates every 24 hours
- **Smart caching**: Reduces API calls and improves performance
- **Fallback content**: Shows mock data when APIs are unavailable
- **Manual refresh**: Click the 🔄 button to refresh immediately

### Content Ranking
The platform uses an intelligent ranking system to show the most relevant articles:

1. **Recency** (30%): Newer articles rank higher
2. **Relevance** (40%): Articles matching category keywords
3. **Source** (20%): Credible sources get priority
4. **Engagement** (10%): Optimal headline and summary length

### Performance
- **Caching**: Content is cached for 24 hours
- **Offline support**: Works offline after initial load
- **Fast loading**: Optimized for speed
- **Responsive**: Works on all devices

## Troubleshooting

### Common Issues

1. **"API key not configured" error**
   - Solution: Add your API keys to `config.js`

2. **No articles showing**
   - Solution: Check your API keys are valid and have remaining quota

3. **Slow loading**
   - Solution: The platform caches content for 24 hours to improve performance

4. **CORS errors**
   - Solution: Use a local server (`python3 -m http.server 8000`) instead of opening files directly

### Debug Mode

Open browser console (F12) to see:
- API request status
- Cache hit/miss information
- Error messages
- Performance metrics

## Customization

### Adding New News Sources
1. Edit `config.js` to add new API endpoints
2. Update `news-api.js` to handle new source format
3. Add source-specific processing in `processArticles()`

### Changing Update Frequency
```javascript
// Update every 2 hours instead of 6
updateIntervals: {
    checkInterval: 2 * 60 * 60 * 1000
}
```

### Modifying Content Ranking
```javascript
// Prioritize recency over relevance
rankingWeights: {
    recency: 0.5,
    relevance: 0.3,
    source: 0.2,
    engagement: 0.0
}
```

## Production Deployment

### Requirements
- HTTPS enabled (required for service worker)
- Web server (Apache, Nginx, etc.)
- API keys configured

### Steps
1. Upload all files to your web server
2. Configure API keys in `config.js`
3. Test the platform
4. Monitor API usage and performance

## Support

### Getting Help
- Check browser console for errors
- Verify API keys are correct
- Ensure you're using HTTPS in production
- Test with mock data first

### Performance Tips
- Use a CDN for faster loading
- Enable gzip compression
- Monitor API usage to avoid rate limits
- Cache static assets

## License

This project is open source and available under the MIT License.
