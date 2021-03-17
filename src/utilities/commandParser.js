export default (str) => {
  const args = [];
  let readingPart = false;
  let part = "";
  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) === " " && !readingPart) {
      args.push(part);
      part = "";
    } else if (str.charAt(i) === '\\"') {
      readingPart = !readingPart;
    } else {
      part += str.charAt(i);
    }
  }
  args.push(part);
  return args;
}
