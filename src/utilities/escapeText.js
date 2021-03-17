export default (str) => {
  try {
    str = str.replace(/[\n\r|\n\n]{2,}/g, "\n"); // clear carriage return
    str = str.replace(/\s{2,}/g, " "); // replace multiple spaces by a single one
    str = str.replace(/^\s{2,}|\s{2,}$/, ""); // clear leading and trailing spaces
    str = str.replace(/^\*{2,}|\*{2,}$/, ""); // remove stars at end and front cause we are placing
    return str;
  } catch (error) {
    logger.fatal(error);
  }
}
