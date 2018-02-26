export function windDeg(deg) {
  switch(true) {
    case (deg > 340 || deg <= 20):
      return 'N';
      
    case (deg > 20 && deg <= 70):
      return'NE';
      
    case (deg > 70 && deg <= 110):
      return 'E';
      
    case (deg > 110 && deg <= 160):
      return 'SE';
      
    case (deg > 160 && deg <= 200):
      return 'S';
      
    case (deg > 200 && deg <= 250):
      return 'SW';
      
    case (deg > 250 && deg <= 290):
      return 'W';
      
    case (deg > 290 && deg <= 340):
      return 'NW';
       
    default:
      return 'N/a';  
  }
}