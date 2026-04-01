import React from 'react';

const CarouselStyle = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    height: '400px',
    backgroundColor: 'var(--color-bg-main)',
    border: `2px solid var(--color-accent-green)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    color: 'var(--color-text-primary)',
  },
  text: {
    padding: '2rem',
  },
  title: {
    color: 'var(--color-accent-gold)',
    marginBottom: '0.5rem',
  }
};

function HomeCarousel() {
  return (
    <div style={CarouselStyle.container}>
      <div style={CarouselStyle.text}>
        <h3 style={CarouselStyle.title}>Carousel Placeholder</h3>
        <p>You would install a library like **react-responsive-carousel** here to display rotating product promotions or imagery.</p>
        <p>Example slide: **New Spring Collection Mattresses**</p>
      </div>
    </div>
  );
}

export default HomeCarousel;