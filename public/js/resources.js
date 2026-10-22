document.addEventListener('DOMContentLoaded', () => {

  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const videoContainer = document.getElementById('videoResultsContainer');
    //async funct that fetches video data and dynamically builds the video cards grid

  async function searchVideos(query) {
    
    if (!query) return; //empty -> cancel

    videoContainer.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="spinner-border text-light" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-white mt-2">Searching study videos...</p>
      </div>
    `;

    try {
      // Send a GET request to the Express API proxy route with the encoded search query
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`);
      const result = await response.json();

      // Check if the HTTP response status is OK and the backend returned success
      if (!response.ok || !result.success) {
        throw new Error(result.message || result.error?.message || 'Error fetching videos');
      }

      // Handle empty search results from YouTube API
      if (!result.data || result.data.length === 0) {
        videoContainer.innerHTML = `
          <div class="col-12 text-center py-5">
            <p class="text-white fs-5">No videos found for "${query}". Try another search!</p>
          </div>
        `;
        return;
      }

      // Clear the loading spinner before appending new results
      videoContainer.innerHTML = '';

      // Loop through each video item returned by YouTube API and construct HTML cards
      result.data.forEach(item => {
        // Extract necessary metadata from YouTube video snippet object
        const videoId = item.id.videoId;
        const title = item.snippet.title;
        const channelTitle = item.snippet.channelTitle;
        const description = item.snippet.description || 'No description available.';

        // Build Bootstrap-formatted card structure for each video
        const cardHTML = `
          <div class="col-12 col-md-6 col-lg-4">
            <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
              <!-- Embedded YouTube iframe player -->
              <div class="ratio ratio-16x9">
                <iframe src="https://www.youtube.com/embed/${videoId}" title="${title}" allowfullscreen></iframe>
              </div>
              <div class="card-body p-4 d-flex flex-column">
                <span class="badge bg-primary bg-opacity-10 text-primary w-auto me-auto mb-2 px-3 py-2 rounded-pill">YouTube Resource</span>
                <h5 class="card-title fw-bold fs-6">${title}</h5>
                <p class="card-text small text-muted flex-grow-1">
                  ${description.length > 90 ? description.substring(0, 90) + '...' : description}
                </p>
                <div class="d-flex align-items-center justify-content-between mt-3 pt-3 border-top">
                  <small class="card-meta text-truncate col-7"><i class="bi bi-person me-1"></i> ${channelTitle}</small>
                  <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" class="btn btn-sm btn-outline-danger rounded-pill px-3">
                    <i class="bi bi-play-fill"></i> Watch
                  </a>
                </div>
              </div>
            </div>
          </div>
        `;

        // Append generated card HTML to the grid container
        videoContainer.innerHTML += cardHTML;
      });

    } catch (error) {
      // Log errors to browser console and show a user-friendly alert message
      console.error('Error:', error);
      videoContainer.innerHTML = `
        <div class="col-12 text-center py-4">
          <div class="alert alert-danger" role="alert">
            Could not load videos. Please check your API key configuration.
          </div>
        </div>
      `;
    }
  }

  // Event listener: Execute video search when clicking the Search button
  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    searchVideos(query);
  });

  // Event listener: Execute video search when pressing the "Enter" key inside the input field
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const query = searchInput.value.trim();
      searchVideos(query);
    }
  });

  //default study recommendations search
  searchVideos('best study techniques for students');
});