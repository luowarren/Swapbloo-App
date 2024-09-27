export function displayTime(t) {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - t.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  if (months < 12) return `${months}m ago`;

  return `${years}y ago`;
}

export function sortData(array) {
  return array.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
}

export function placeholder() {
  console.log("hi");
}
