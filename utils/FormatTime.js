module.exports = function(duration, f=["h", "m", "s"]) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = parseInt((duration / 1000) % 60),
        minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24);
    var h = hours+f[0],
        m = minutes+f[1],
        s = seconds+f[2];
  
        return hours < 1 ? (minutes < 1 ? s : m+" "+s) : (h+" "+m+" "+s);
};