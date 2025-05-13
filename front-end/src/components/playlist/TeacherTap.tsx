import React from 'react';
import Image from 'next/image';
import instructorData from '@/data/instructorData';

interface TeacherTabsProps {
  instructorData: typeof instructorData;
  selected: (typeof instructorData)[number];
  onSelectTeacher: (inst: (typeof instructorData)[number]) => void;
}

const TeacherTabs: React.FC<TeacherTabsProps> = ({ instructorData, selected, onSelectTeacher }) => {
  return (
    <div className="dev_list_cont">
      <ul className="dev_list teacher">
        {instructorData.map((inst) => (
          <li key={inst.name} className={selected.name === inst.name ? 'active' : ''}>
            <button
              type="button"
              onClick={() => onSelectTeacher(inst)}
              disabled={selected.name === inst.name}
            >
              <Image src={inst.img} alt={inst.name} width={70} height={70} />
              <span>{inst.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeacherTabs;
