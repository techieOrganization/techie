// components/CategoryTabs.tsx
import React from 'react';
import Image from 'next/image';
import vidListData from '@/data/vidListData';

interface CategoryTabsProps {
  category: string;
  onCategoryClick: (newCategory: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ category, onCategoryClick }) => {
  return (
    <div className="dev_list_cont">
      <ul className="dev_list">
        {vidListData.map((tab) => (
          <li key={tab.id} className={tab.id === category ? 'active' : ''}>
            <button
              type="button"
              onClick={() => onCategoryClick(tab.id)}
              disabled={tab.id === category}
            >
              <Image src={tab.img} alt={tab.title} width={40} height={40} />
              <span>{tab.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryTabs;
