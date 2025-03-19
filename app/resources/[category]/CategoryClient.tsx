import React from 'react';

interface CategoryClientProps {
  category: string;
}

const CategoryClient: React.FC<CategoryClientProps> = ({ category }) => {
  return (
    <div>
      <h1>Category: {category}</h1>
      <p>This is a placeholder component for CategoryClient.</p>
    </div>
  );
};

export default CategoryClient; 