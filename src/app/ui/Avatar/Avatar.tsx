import React from 'react';

interface AvatarProps {
  username: string;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ username, size = 50 }) => {
  // Extract initials
  const getInitials = (name: string): string =>
    name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .join('');

  // Generate a random color based on username
  const generateColor = (name: string): string => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 70%, 60%)`;
  };

  const initials = getInitials(username);
  const bgColor = generateColor(username);

  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: 'white',
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: size * 0.4,
        fontWeight: 'bold',
      }}
    >
      {initials}
    </div>
  );
};

export default Avatar;