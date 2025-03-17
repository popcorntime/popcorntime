export function timeDisplay(totalMinutes: number | string) {
  const asMinutes = Number(totalMinutes);
  //const t = useTranslations('Time')
  const hours = Math.floor(asMinutes / 60);
  let minutes = asMinutes % 60;
  if (minutes < 5 || minutes > 55) {
    minutes = 0;
  }

  return `${hours}h ${minutes}m`;
}
