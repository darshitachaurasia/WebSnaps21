export function getStreak() {
  const lastDate = localStorage.getItem("lastDate");
  const storedStreak = parseInt(localStorage.getItem("streak") || "0");
  const today = new Date().toDateString();

  if (lastDate === today) {
    return storedStreak;
  }

  const daysDiff = lastDate
    ? (new Date(today) - new Date(lastDate)) / (1000 * 60 * 60 * 24)
    : null;

  if (daysDiff === 1) {
    localStorage.setItem("streak", storedStreak + 1);
    localStorage.setItem("lastDate", today);
    return storedStreak + 1;
  } else {
    localStorage.setItem("streak", 1);
    localStorage.setItem("lastDate", today);
    return 1;
  }
}
