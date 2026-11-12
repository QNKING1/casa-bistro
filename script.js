const restaurant = window.restaurantConfig;

function buildSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: restaurant.name,
    image: [
      'images/rooftop-restaurant-hero.jpg',
      'images/restaurant-ambience.jpg',
      'images/grilled-kebab.jpg'
    ],
    url: 'https://example.com/',
    telephone: '+923022361262',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Building 46-C, Lane 1, Zulfiqar & Al Murtaza Commercial Area, DHA Phase 8',
      addressLocality: 'Karachi',
      postalCode: '75500',
      addressCountry: 'PK'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: restaurant.coordinates.lat,
      longitude: restaurant.coordinates.lng
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: restaurant.rating,
      reviewCount: restaurant.reviewCount
    },
    acceptsReservations: true,
    servesCuisine: ['Eclectic', 'Grill', 'Pizza', 'Sheesha'],
    priceRange: 'Rs 10,000+ per person',
    openingHours: restaurant.hours.opens ? `Mo-Su ${restaurant.hours.opens}` : undefined
  };

  const scriptNode = document.getElementById('restaurant-schema-json');
  scriptNode.textContent = JSON.stringify(schema);
}

function renderMenuTabs() {
  const menuTabs = document.getElementById('menu-tabs');
  const tabButtons = restaurant.menuCategories.map((category, index) => `
    <button class="menu-tab ${index === 0 ? 'is-active' : ''}" data-category="${category.key}" type="button" aria-pressed="${index === 0 ? 'true' : 'false'}">${category.label}</button>
  `).join('');

  menuTabs.innerHTML = tabButtons;
  const buttons = menuTabs.querySelectorAll('.menu-tab');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const currentCategory = button.dataset.category;
      buttons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      updateMenu(currentCategory);
    });
  });

  updateMenu(restaurant.menuCategories[0].key);
}

function updateMenu(categoryKey) {
  const category = restaurant.menuCategories.find((item) => item.key === categoryKey) || restaurant.menuCategories[0];
  const list = document.getElementById('menu-list');
  const photo = document.getElementById('menu-photo');
  const items = restaurant.menu[categoryKey] || [];

  list.innerHTML = items.map((item) => `<li>${item}</li>`).join('');
  photo.src = category.photo;
  photo.alt = `${category.label} dishes at Casa Bistro`;
}

function renderGallery() {
  const gallery = document.getElementById('gallery-grid');
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-inner">
      <button type="button" class="lightbox-close" aria-label="Close gallery image">×</button>
      <img src="" alt="Expanded gallery view" />
    </div>
  `;
  document.body.appendChild(lightbox);

  gallery.innerHTML = restaurant.gallery.map((item, index) => `
    <button
      class="gallery-item"
      type="button"
      aria-label="Open gallery image ${index + 1}"
      data-image="${item.src}"
      data-alt="${item.alt}"
    >
      <img src="${item.src}" alt="${item.alt}" loading="lazy" />
    </button>
  `).join('');

  const galleryButtons = gallery.querySelectorAll('.gallery-item');
  const popupImage = lightbox.querySelector('img');
  const closeButton = lightbox.querySelector('.lightbox-close');

  galleryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      popupImage.src = button.dataset.image;
      popupImage.alt = button.dataset.alt;
      lightbox.classList.add('is-open');
      closeButton.focus();
    });
  });

  closeButton.addEventListener('click', () => lightbox.classList.remove('is-open'));
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      lightbox.classList.remove('is-open');
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
      lightbox.classList.remove('is-open');
    }
  });
}

function renderReviews() {
  const reviewGrid = document.getElementById('review-grid');
  reviewGrid.innerHTML = restaurant.reviews.map((review) => `
    <article class="review-card">
      <div class="meta">${review.name} · ${review.source}</div>
      <p>“${review.text}”</p>
    </article>
  `).join('');
}

function populateMeta() {
  const phoneLink = document.querySelector('a[href="tel:+923022361262"]');
  if (phoneLink) {
    phoneLink.textContent = restaurant.phoneDisplay;
  }

  const tagLine = document.getElementById('tagline');
  if (tagLine) {
    tagLine.textContent = restaurant.tagline;
  }
}

function configureReservationForm() {
  const form = document.getElementById('reservationForm');
  const dateField = document.getElementById('date');
  const formStatus = document.getElementById('formStatus');

  const today = new Date();
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  dateField.min = localDate;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = formData.get('name')?.toString().trim();
    const phone = formData.get('phone')?.toString().trim();
    const date = formData.get('date')?.toString();
    const time = formData.get('time')?.toString();
    const guests = formData.get('guests')?.toString();
    const seating = formData.get('seating')?.toString();
    const note = formData.get('note')?.toString().trim();

    if (!name || !phone || !date || !time || !guests || !seating) {
      formStatus.textContent = 'Please complete all required fields before sending your reservation.';
      return;
    }

    const message = [
      'Hi Casa Bistro, I would like to reserve a table.',
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Date: ${date}`,
      `Time: ${time}`,
      `Guests: ${guests}`,
      `Seating: ${seating}`,
      note ? `Note: ${note}` : ''
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/${restaurant.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener');
    formStatus.textContent = 'Opening WhatsApp with your reservation details...';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  buildSchema();
  populateMeta();
  renderMenuTabs();
  renderGallery();
  renderReviews();
  configureReservationForm();
});
