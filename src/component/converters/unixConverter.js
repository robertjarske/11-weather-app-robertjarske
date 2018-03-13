export function convertUnix(unix) {
  let d = new Date(unix * 1000),
    yyyy = d.getFullYear(),
    mm = ("0" + (d.getMonth() + 1)).slice(-2),
    dd = ("0" + d.getDate()).slice(-2),
    hh = ("0" + d.getHours()).slice(-2),
    min = ("0" + d.getMinutes()).slice(-2),
    time;

  time = `${yyyy}-${mm}-${dd}, ${hh}:${min}`;

  return time;
}
