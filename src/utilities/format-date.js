const date = new Date();

const mes = ("0" + (date.getMonth() + 1)).substr(-2);
const dia = ("0" + date.getDate()).substr(-2);
const hor = ("0" + date.getHours()).substr(-2);
const min = ("0" + date.getMinutes()).substr(-2);
const seg = ("0" + date.getSeconds()).substr(-2);
const ano = date.getFullYear();

module.exports = {
  timestampString() {
    let newdate = "";

    newdate += ano + "-";
    newdate += mes + "-";
    newdate += dia + "T";
    newdate += hor + ":";
    newdate += min + ":";
    newdate += seg + ".000Z";

    // "2020-04-05T23:00:00.000Z"
    return newdate;
  },

  time() {
    return hor + ":" + min + ":" + seg;
  },
};
