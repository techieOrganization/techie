export const formatDuration = (duration: string | undefined): string => {
  if (!duration) return '0:00'; // duration 값이 없을 경우 "0:00" 반환
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '0:00';

  const hours = parseInt(match[1]?.replace('H', '') || '0', 10);
  const minutes = parseInt(match[2]?.replace('M', '') || '0', 10);
  const seconds = parseInt(match[3]?.replace('S', '') || '0', 10);

  if (hours > 0) {
    // 시간이 1 이상인 경우 H:MM:SS 포맷으로 반환
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // 그렇지 않으면 MM:SS 포맷으로 반환
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
