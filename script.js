function getTourism() {
  const state = document.getElementById("stateInput").value;
  const resultDiv = document.getElementById("result");

  const messages = [
    'Finding amazing destinations for you...',
    'Discovering hidden gems and treasures...',
    'Exploring cultural heritage and landmarks...',
    'Uncovering local experiences...',
    'Loading wonderful places to visit...'
  ];
  
  document.body.style.overflow = 'hidden';
  const loadingOverlay = document.createElement('div');
  loadingOverlay.className = 'loading-overlay';
  loadingOverlay.innerHTML = `
    <div class="loading-overlay-content">
      <div class="loading-spinner-large">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      <h1 class="loading-title">✨ Exploring ${state} ✨</h1>
      <p class="loading-subtitle" id="loading-message">Finding amazing destinations for you...</p>
      <div class="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;
  document.body.appendChild(loadingOverlay);
  
  let messageIndex = 0;
  const messageInterval = setInterval(() => {
    const messageEl = document.getElementById('loading-message');
    if (messageEl) {
      messageIndex = (messageIndex + 1) % messages.length;
      messageEl.style.animation = 'none';
      setTimeout(() => {
        messageEl.style.animation = 'fadeInUp 0.6s ease-out';
        messageEl.textContent = messages[messageIndex];
      }, 10);
    }
  }, 2500);
  
  resultDiv.innerHTML = "";
  resultDiv.classList.add('loading');

  fetch(`http://localhost:5001/api/state/${state}`)
    .then(res => res.json())
    .then(data => {
      resultDiv.innerHTML += `
        <div style="grid-column: 1 / -1; margin-bottom: 30px;">
          <div class="state-header">
            <h2>🌏 ${state}</h2>
            <p>Discover amazing destinations and local experiences</p>
          </div>
          <div class="base-station">
            <h3>🚂 Railway Station</h3>
            <p>${data.base_station}</p>
            ${data.airport ? `
              <div style="margin-top: 25px;">
                <h3>✈️ Airport</h3>
                <p>${data.airport}</p>
                <p style="font-size: 15px; color: #999; margin-top: 8px;">📍 Distance from city: <strong style="color: var(--primary);">${data.airport_distance} km</strong></p>
              </div>
            ` : ''}
          </div>
        </div>
      `;

      data.places.forEach((place, index) => {
        resultDiv.innerHTML += `
          <div class="card">
            ${place.image ? `<img src="${place.image}" alt="${place.name}" loading="lazy">` : ''}
            <div class="card-content">
              <h4>${place.name}</h4>
              
              <div class="info-section">
                <div class="info-label">🚂 Railway Access</div>
                <div class="info-value">${place.nearest_station || 'N/A'}</div>
              </div>
              
              <div class="info-section">
                <div class="info-label">✈️ Airport Access</div>
                <div class="info-value">${place.nearest_airport || 'N/A'}</div>
              </div>
              
              ${place.famous_for ? `
              <div class="info-section">
                <div class="info-label">⭐ Why Visit</div>
                <div class="info-value">${place.famous_for}</div>
              </div>
              ` : ''}
              
              ${place.local_food && place.local_food.length > 0 ? `
              <div class="info-section">
                <div class="info-label">🍽️ Must Try</div>
                <div class="info-value">${place.local_food.join(' • ')}</div>
              </div>
              ` : ''}
              
              <div style="margin-top: auto; padding-top: 16px; border-top: 2px solid #f0f0f0; display: flex; gap: 20px; font-weight: 600; color: var(--primary); font-size: 13px;">
                <span>🚂 ${place.distance_km} km</span>
                <span>✈️ ${place.airport_distance} km</span>
              </div>
            </div>
          </div>
        `;
      });
      
      clearInterval(messageInterval);
      const overlay = document.querySelector('.loading-overlay');
      if (overlay) {
        overlay.classList.add('fade-out');
        setTimeout(() => {
          overlay.remove();
          document.body.style.overflow = 'auto';
          resultDiv.classList.remove('loading');
        }, 600);
      }
    })
    .catch(() => {
      clearInterval(messageInterval);
      const overlay = document.querySelector('.loading-overlay');
      if (overlay) {
        overlay.classList.add('fade-out');
        setTimeout(() => {
          overlay.remove();
          document.body.style.overflow = 'auto';
        }, 600);
      }
      
      resultDiv.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; animation: slideUp 0.6s ease-out;">
          <div style="font-size: 48px; margin-bottom: 16px;">😕</div>
          <p style="font-size: 20px; color: var(--primary); font-weight: 700;">State Not Found</p>
          <p style="color: #666; margin-top: 8px;">Try searching for a different state or use abbreviations like "UP", "DL", "KL"</p>
        </div>
      `;
      resultDiv.classList.remove('loading');
    });
}

function quickSearch(state) {
  document.getElementById("stateInput").value = state;
  getTourism();
}
