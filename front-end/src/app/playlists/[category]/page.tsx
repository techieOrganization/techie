'use client';

import React from 'react';

import CategoryPlaylist from '@/components/playlist/CategoryPlaylist';

interface CategoryPageProps {
  params: { category: string };
}

const CategoryPage: React.FC<CategoryPageProps> = ({ params }) => {
  return (
    <div>
      <CategoryPlaylist category={params.category.toUpperCase()} />
    </div>
  );
};

export default CategoryPage;
