import React from 'react';

const PageStyle = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '4rem 2rem',
    textAlign: 'center',
  },
  heading: {
    fontSize: '2.5rem',
    color: 'var(--color-accent-gold)',
    marginBottom: '1rem',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    marginTop: '2rem',
  },
  listItem: {
    backgroundColor: 'var(--color-bg-secondary)',
    padding: '1rem',
    margin: '1rem 0',
    borderRadius: 'var(--border-radius)',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
    fontSize: '1.2rem',
    fontWeight: 500,
    borderLeft: `5px solid var(--color-accent-green)`,
  }
};

function Categories() {
  const categories = ['Mattresses (Our Core)', 'Pillows & Comfort Accessories', 'Premium Bed Linens', 'Home Furniture (Select Range)'];

  return (
    <div style={PageStyle.container}>
      <h1 style={PageStyle.heading}>Shop By Category</h1>
      <p style={{color: 'var(--color-text-secondary)', fontSize: '1.1rem'}}>Explore the full range of JP Furnishing House products.</p>
      
      <ul style={PageStyle.list}>
        {categories.map((cat, index) => (
          <li key={index} style={PageStyle.listItem}>
            {cat}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Categories;