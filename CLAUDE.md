# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Rise Above Partners is a static marketing consulting website built with vanilla HTML, CSS, and JavaScript. The site is deployed on Netlify and targets rural/small-town businesses with marketing strategy, digital presence, and grant assistance services.

## Development Commands

This is a static website with no build process. Development is done by:
- Editing HTML, CSS, and JS files directly
- Testing locally by opening HTML files in browser
- Deploying via git push to Netlify (auto-deploy configured)

## Architecture & Structure

### Static Site Structure
- **HTML Pages**: Each service/section has its own HTML file (index.html, services.html, acceleration.html, grants.html, contact.html)
- **Data Layer**: JSON files in `_data/` directory contain content that could be dynamically loaded
- **Responsive Design**: Mobile-first approach with breakpoints at 769px, 950px, and 1920px (ultra-wide)

### Key Components
- **Navigation**: Consistent navbar structure across all pages (see navigation-guide.md)
- **Hero Sections**: Each page has unique hero with responsive background images
- **Content Sections**: Service cards, testimonials, and CTAs following consistent patterns

### CSS Architecture
- **styles.css**: Main stylesheet with comprehensive responsive design
- **Specialized CSS**: Additional files for specific fixes (ultra-wide-fixes.css, hero-image-fix.css, nav-fix-1900px.css)
- **CSS Reset**: Aggressive reset at top of styles.css eliminates browser defaults
- **CSS Variables**: Defined for colors, fonts, and spacing consistency

### JavaScript Structure
- **main.js**: Handles mobile menu toggle and smooth scrolling
- **grants.js**: Page-specific functionality for grants page
- Minimal vanilla JS approach, no frameworks

### Image Strategy
- **WebP with JPG fallbacks**: Modern format optimization with compatibility
- **Responsive images**: Separate mobile/desktop versions for key hero images
- **Brand assets**: Centralized in images/brand/ (logos, favicons, icons)

### Data Management
- **JSON Content**: Structured data in _data/ directory for testimonials, services, and home content
- **Service Data**: Individual JSON files for each service (content-creation.json, digital-strategy.json, web-presence.json)

## Key Files & Patterns

### Navigation Implementation
Follow the exact structure in `navigation-guide.md` for consistent navigation across all pages. Active states use `.nav-active` class and mobile breakpoint is at 950px.

### Responsive Design Patterns
- Mobile-first CSS with progressive enhancement
- Ultra-wide screen support (1920px+) with specific fixes
- Hero sections require page-specific padding adjustments

### Content Integration
- Testimonials and service data stored in JSON format in _data/
- Content can be dynamically loaded or manually integrated into HTML

## Deployment

- **Netlify Configuration**: Auto-deploy from git repository
- **Build Settings**: Static site, publishes from root directory
- **Headers**: Security headers configured in netlify.toml
- **Functions**: Netlify Functions configured for potential API endpoints

## Important Constraints

- No build process or package management
- Static HTML/CSS/JS only
- Must maintain mobile responsiveness across all breakpoints
- Navigation structure must remain consistent across all pages
- WebP image format preferred with JPG fallbacks