
/**
 * Форматирует время аптайма в читаемый формат
 * @param hours Количество часов аптайма
 * @returns Отформатированная строка аптайма
 */
export const formatUptime = (hours?: number) => {
  if (!hours) return 'Н/Д';
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  if (days > 0) {
    return `${days} д ${remainingHours} ч`;
  }
  return `${hours} ч`;
};

/**
 * Генерирует историю данных сервера для заданного временного диапазона
 * @param maxPlayers Максимальное количество игроков
 * @param timeRange Диапазон времени ('day', 'week', 'month')
 * @returns Массив исторических данных
 */
export const generateServerHistory = (maxPlayers: number, timeRange: 'day' | 'week' | 'month') => {
  const history = [];
  const hoursInPeriod = timeRange === 'day' ? 24 : timeRange === 'week' ? 24 * 7 : 24 * 30;
  const stepSize = timeRange === 'day' ? 1 : timeRange === 'week' ? 6 : 24;
  
  for (let i = 0; i < hoursInPeriod; i += stepSize) {
    const time = new Date();
    time.setHours(time.getHours() - hoursInPeriod + i);
    const timeStr = time.getHours() + ':00';
    
    history.push({
      time: timeStr,
      players: Math.floor(Math.random() * maxPlayers * 0.9),
      tps: parseFloat((Math.min(20, (Math.random() * 3 + 17))).toFixed(1)),
    });
  }
  
  return history;
};
