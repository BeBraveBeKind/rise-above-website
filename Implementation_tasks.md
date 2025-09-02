# Implementation Task List

## Phase 1: Core Structure Updates

### Task 1: Update Homepage (index.html)
- [ ] Replace hero H1 and paragraph with AI agent copy
- [ ] Update proof points section → "The Problem"
- [ ] Transform services grid to 3 AI services
- [ ] Update about section to focus on AI expertise
- [ ] Keep contact form, update surrounding copy

### Task 2: Create Services Page (services.html)
- [ ] Add collapsible JavaScript function
- [ ] Create 4 service sections with accordion
- [ ] Add pricing prominently
- [ ] Include "Book Demo" and "Get Assessment" CTAs
- [ ] First service auto-expanded on load

### Task 3: Create Why Rise Above Page (why-rise-above.html)
- [ ] Copy about.html as template
- [ ] Add case study content (text-heavy)
- [ ] Include proof metrics
- [ ] Add credibility indicators

### Task 4: Add CSS Components
```css
/* Collapsible Services */
.service-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.service-card.expanded .service-content {
  max-height: 2000px;
}

/* Badges */
.availability-badge {
  display: inline-block;
  background: linear-gradient(135deg, #d63384 0%, #fd7e14 100%);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: var(--rounded-md);
  font-weight: 700;
  animation: pulse 2s infinite;
}

/* Video Placeholder */
.video-placeholder {
  position: relative;
  background: #f0f0f0;
  border-radius: var(--rounded-lg);
  overflow: hidden;
  cursor: pointer;
}