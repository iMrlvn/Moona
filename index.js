const { Moona } = require("./structures/index.js");
new Moona();

global.subText = (text="", length=0) => {
    return text.length > length ? text.substring(0, length-3)+"..." : text;
};

global.modTitle = (title, track={}) => {
    const maxlength = 70;
    const addition = ` by ${track.author}`;
    const lengths = (`${title}${addition}`).length;
    title = lengths > maxlength ? `${title.substring(0, (maxlength - addition.length) - 3)}...${addition}` : `${title}${addition}`;
    return title;
};