import React from 'react';

const Avatar = ({ name }) => {
  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    return names
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
