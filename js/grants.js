// GRANTS DATABASE INTEGRATION
// Connects to Google Sheets and handles dynamic grant display

// Configuration - YOUR LIVE GOOGLE SHEETS WEB APP URL
const GOOGLE_SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwZuAHnnWvoEd52DcoJXSwL5Yqcnur-siJnxoEhe5Tf6WbsP7pLKe8PLq5e02L_hVND/exec';

// Global variables
let allGrants = [];
let filteredGrants = [];

// Initialize grants page
document.addEventListener('DOMContentLoaded', function() {
  // Only run on grants page
  if (document.getElementById('grants-container')) {
    loadGrantsData();
    setupFilters();
  }
});

// Load grants data from Google Sheets
async function loadGrantsData() {
  try {
    showLoading();
    
    // For development/fallback, use sample data
    if (GOOGLE_SHEETS_WEB_APP_URL === 'YOUR_GOOGLE_SHEETS_WEB_APP_URL_HERE') {
      console.log('Using fallback data. Set up Google Sheets connection for live data.');
      allGrants = getFallbackData();
      setTimeout(() => {
        displayGrants(allGrants);
        updateStats();
      }, 1000);
    } else {
      // Actual API call to Google Sheets Web App
      const response = await fetch(GOOGLE_SHEETS_WEB_APP_URL + '?action=getGrants');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        allGrants = data.grants || [];
        displayGrants(allGrants);
        updateStats();
      } else {
        throw new Error(data.error || 'Failed to load grants');
      }
    }
    
  } catch (error) {
    console.error('Error loading grants:', error);
    showError('Unable to load grant opportunities. Please try again later.');
  }
}

// Show loading state
function showLoading() {
  const container = document.getElementById('grants-container');
  if (!container) return;
  
  container.innerHTML = `
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading current grant opportunities...</p>
    </div>
  `;
}

// Show error state
function showError(message) {
  const container = document.getElementById('grants-container');
  if (!container) return;
  
  container.innerHTML = `
    <div class="loading-container">
      <div class="error-message">${message}</div>
      <button class="retry-btn" onclick="loadGrantsData()">Try Again</button>
    </div>
  `;
}

// Display grants in the grid
function displayGrants(grants) {
  const container = document.getElementById('grants-container');
  if (!container) return;
  
  if (!grants || grants.length === 0) {
    container.innerHTML = `
      <div class="loading-container">
        <p>No grant opportunities found. Please check back later.</p>
      </div>
    `;
    return;
  }

  // Filter out inactive grants and sort by featured status
  const activeGrants = grants.filter(grant => grant.Status === 'Active');
  const sortedGrants = activeGrants.sort((a, b) => {
    // Featured grants first
    if (a.Featured === 'TRUE' && b.Featured !== 'TRUE') return -1;
    if (b.Featured === 'TRUE' && a.Featured !== 'TRUE') return 1;
    return 0;
  });

  const grantsHTML = sortedGrants.map(grant => createGrantCard(grant)).join('');
  container.innerHTML = grantsHTML;
}

// Create HTML for a single grant card
function createGrantCard(grant) {
  const isFeatured = grant.Featured === 'TRUE' || grant.Featured === true;
  const featuredBadge = isFeatured ? '<div class="featured-badge">Featured</div>' : '';
  
  // Format funding amount
  let fundingDisplay = 'Amount Varies';
  if (grant.Funding_Min && grant.Funding_Max) {
    const min = formatCurrency(grant.Funding_Min);
    const max = formatCurrency(grant.Funding_Max);
    if (min === max) {
      fundingDisplay = max;
    } else {
      fundingDisplay = `${min} - ${max}`;
    }
  } else if (grant.Funding_Max) {
    fundingDisplay = `Up to ${formatCurrency(grant.Funding_Max)}`;
  } else if (grant.Funding_Min) {
    fundingDisplay = `From ${formatCurrency(grant.Funding_Min)}`;
  }

  // Format deadline - FIXED: Handle Google Sheets timestamp format
  const formattedDeadline = formatDeadline(grant.Deadline);
  const deadlineClass = getDeadlineClass(grant.Deadline);
  
  // Determine complexity class
  const complexityClass = getComplexityClass(grant.Complexity);

  return `
    <div class="grant-card ${isFeatured ? 'featured' : ''}" data-category="${grant.Category}">
      ${featuredBadge}
      <div class="grant-header">
        <h3 class="grant-title">${grant.Grant_Name || 'Grant Opportunity'}</h3>
        <p class="grant-source">${grant.Source_Organization || 'Various Sources'}</p>
      </div>
      <div class="grant-amount">${fundingDisplay}</div>
      <div class="grant-details">
        <div class="grant-detail">
          <span class="detail-label">Deadline:</span>
          <span class="detail-value ${deadlineClass}">${formattedDeadline}</span>
        </div>
        <div class="grant-detail">
          <span class="detail-label">Eligibility:</span>
          <span class="detail-value">${truncateText(grant.Eligibility || 'See full details', 40)}</span>
        </div>
        <div class="grant-detail">
          <span class="detail-label">Purpose:</span>
          <span class="detail-value">${truncateText(grant.Purpose || 'Various purposes', 40)}</span>
        </div>
        <div class="grant-detail">
          <span class="detail-label">Application:</span>
          <span class="detail-value ${complexityClass}">${grant.Complexity || 'Moderate'}</span>
        </div>
        <div class="grant-detail">
          <span class="detail-label">Match Required:</span>
          <span class="detail-value">${grant.Match_Required || 'Not specified'}</span>
        </div>
      </div>
      <div class="grant-cta">
        <a href="index.html/#contact" class="btn btn-primary">Get Full Details</a>
      </div>
    </div>
  `;
}

// Utility functions
function formatCurrency(amount) {
  if (!amount || amount === 'Not specified') return '';
  
  // Remove any existing formatting
  const cleanAmount = amount.toString().replace(/[,$]/g, '');
  const num = parseFloat(cleanAmount);
  
  if (isNaN(num)) return amount;
  
  if (num >= 1000000) {
    return '$' + (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return '$' + (num / 1000).toFixed(0) + 'K';
  } else {
    return '$' + num.toLocaleString();
  }
}

// Format deadline - NEW: Handle Google Sheets timestamp format
function formatDeadline(deadline) {
  if (!deadline) return 'Ongoing';
  
  // Handle common text values
  const deadlineStr = deadline.toString().toLowerCase();
  if (deadlineStr.includes('rolling') || deadlineStr.includes('ongoing') || deadlineStr.includes('tbd')) {
    return deadline;
  }
  
  try {
    // Handle Google Sheets timestamp format (2025-06-30T05:00:00.000Z)
    let date;
    if (deadline.includes('T') && deadline.includes('Z')) {
      date = new Date(deadline);
    } else {
      date = new Date(deadline);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return deadline; // Return original if can't parse
    }
    
    // Format as M/D/YYYY
    return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    
  } catch (error) {
    console.log('Error formatting deadline:', deadline);
    return deadline; // Return original if error
  }
}

function getDeadlineClass(deadline) {
  if (!deadline || deadline.toLowerCase().includes('rolling') || deadline.toLowerCase().includes('ongoing')) {
    return '';
  }
  
  try {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const daysUntil = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 30) return 'urgent';
    if (daysUntil < 60) return 'warning';
  } catch (error) {
    console.log('Error parsing deadline:', deadline);
  }
  
  return '';
}

function getComplexityClass(complexity) {
  if (!complexity) return '';
  
  const comp = complexity.toLowerCase();
  if (comp.includes('simple') || comp.includes('easy')) return 'easy';
  if (comp.includes('complex') || comp.includes('competitive')) return 'competitive';
  return '';
}

function truncateText(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Setup filter functionality
function setupFilters() {
  const filterTags = document.querySelectorAll('.filter-tag');
  
  filterTags.forEach(tag => {
    tag.addEventListener('click', function() {
      // Remove active class from all tags
      filterTags.forEach(t => t.classList.remove('active'));
      // Add active class to clicked tag
      this.classList.add('active');
      
      const filter = this.getAttribute('data-filter');
      filterGrants(filter);
    });
  });
}

// Filter grants by category
function filterGrants(category) {
  const grantCards = document.querySelectorAll('.grant-card');
  
  grantCards.forEach(card => {
    if (category === 'all') {
      card.style.display = 'block';
    } else {
      const cardCategory = card.getAttribute('data-category');
      if (cardCategory && cardCategory.toLowerCase().includes(category.toLowerCase())) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    }
  });
}

// Update statistics
function updateStats() {
  const totalGrantsElement = document.getElementById('total-grants');
  if (totalGrantsElement && allGrants.length > 0) {
    const activeGrants = allGrants.filter(grant => grant.Status === 'Active');
    totalGrantsElement.textContent = activeGrants.length + '+';
  }
}

// Fallback data for development/testing
function getFallbackData() {
  return [
    {
      Grant_Name: "Recreational Trails Program (RTP)",
      Source_Organization: "Wisconsin Department of Natural Resources",
      Funding_Min: "",
      Funding_Max: "100000",
      Deadline: "5/1/2025",
      Application_Period: "Annual application cycle",
      Eligibility: "Towns, villages, cities, counties, tribal governing bodies, school districts, state agencies, federal agencies, incorporated organizations",
      Purpose: "Development, rehabilitation, and maintenance of recreational trails and trail-related facilities for motorized and non-motorized use",
      Complexity: "Complex",
      Match_Required: "20% match required",
      Success_Rate: "Not specified",
      Category: "Community Development",
      Status: "Active",
      Source_URL: "https://dnr.wisconsin.gov/aid/RTP.html",
      Last_Updated: "1/15/2025",
      Featured: "TRUE"
    },
    {
      Grant_Name: "Small Business Development Grant",
      Source_Organization: "Wisconsin Economic Development Corporation (WEDC)",
      Funding_Min: "50000",
      Funding_Max: "250000",
      Deadline: "Rolling",
      Application_Period: "Fiscal Year 2025 ongoing",
      Eligibility: "Communities and economic development partners",
      Purpose: "Matching grant programs, small business financing for firms with fewer than 25 employees",
      Complexity: "Moderate",
      Match_Required: "No match required (but bonus points for match)",
      Success_Rate: "$2 million allocated for FY2025",
      Category: "Rural Business",
      Status: "Active",
      Source_URL: "https://wedc.org/programs/small-business-development-grant/",
      Last_Updated: "1/15/2025",
      Featured: "TRUE"
    }
  ];
}