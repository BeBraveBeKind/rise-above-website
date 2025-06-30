# Navigation Guide for Rise Above Partners

## Current Navigation Structure
```
Home | Services | Acceleration | Grants | Get Started
```

## Navigation Code Template
Use this exact HTML structure for all pages:

```html
<header>
  <div class="container">
    <nav class="navbar">
      <a href="/" class="logo">
        <img src="images/brand/logomark.svg" alt="Rise Above Partners" class="logo-mark" width="45" height="45">
        <div class="logo-text">
          <span>RISE ABOVE</span>
          <span>PARTNERS</span>
        </div>
      </a>
      <div class="nav-links">
        <a href="index.html">Home</a>
        <a href="services.html">Services</a>
        <a href="acceleration.html">Acceleration</a>
        <a href="grants.html">Grants</a>
        <a href="contact.html" class="btn btn-primary">Get Started</a>
      </div>
      <div class="menu-toggle">
        <span></span><span></span><span></span>
      </div>
    </nav>
  </div>
</header>
```

## Active States
Add `class="nav-active"` to the current page's link:
- On index.html: `<a href="index.html" class="nav-active">Home</a>`
- On services.html: `<a href="services.html" class="nav-active">Services</a>`
- On acceleration.html: `<a href="acceleration.html" class="nav-active">Acceleration</a>`
- On grants.html: `<a href="grants.html" class="nav-active">Grants</a>`
- On contact.html: `<a href="contact.html" class="btn btn-primary nav-active">Get Started</a>`

## Important Notes
1. "About" has been removed from main nav (exists as section on homepage)
2. "Work" page doesn't exist - don't add it
3. All pages use contact.html for the CTA button
4. Navigation is responsive with mobile menu at 950px breakpoint

## CSS Classes
- `.nav-active` - Shows current page with primary color and underline
- `.btn.btn-primary` - Styled CTA button
- `.menu-toggle` - Mobile hamburger menu (hidden on desktop)

## Navigation Updates Applied
- ✅ Consistent structure across all pages
- ✅ Active state indicators
- ✅ All CTAs point to contact.html
- ✅ Acceleration page now linked from all pages
- ✅ Removed non-existent "Work" link
- ✅ Mobile menu breakpoint at 950px for crowded nav
