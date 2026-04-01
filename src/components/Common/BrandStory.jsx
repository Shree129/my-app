import React from 'react';
import { Link } from 'react-router-dom';

const StoryStyle = {
  container: {
    padding: '4rem 2rem',
    backgroundColor: 'var(--color-bg-main)',
    textAlign: 'center',
    maxWidth: '1000px',
    margin: '3rem auto',
    borderRadius: '8px',
  },
  heading: {
    fontSize: '2rem',
    color: 'var(--color-accent-gold)',
    marginBottom: '1rem',
    fontWeight: 700,
  },
  text: {
    fontSize: '1.1rem',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.8,
    marginBottom: '2rem',
  },
  highlight: {
    fontWeight: 600,
    color: 'var(--color-accent-green)',
  }
};

function BrandStory() {
  return (
    <div style={StoryStyle.container}>
      <h2 style={StoryStyle.heading}>The JP Furnishing House Story</h2>
      <p style={StoryStyle.text}>
        Established with a dedication to **uncompromising comfort and timeless design**, JP Furnishing House is more than just a mattress store—it's a promise of a better sleep experience. We believe your home sanctuary deserves products crafted with care, combining **traditional craftsmanship** with modern ergonomic science. 
      </p>
      <p style={StoryStyle.text}>
        From our premium orthopaedic mattresses to our luxurious linens, every item reflects our commitment to **quality, durability, and the calm luxury** you desire. Our mission is to furnish houses with pieces that bring peace and profound rest.
      </p>
      <Link to="/about" className="btn-primary" style={{backgroundColor: 'var(--color-accent-gold)'}}>
        Read Our Full Story
      </Link>
    </div>
  );
}

export default BrandStory;