import gm from "gm";

export default function run(buffer) {
  return new Promise((resolve, reject) => {
    try {
      gm(buffer)
        .antialias(false)
        .negative()
        .contrast(-25)
        .threshold(55, true)
        .size(function (error, size) {
          if (error) reject(error);
          const factor = Math.min(1, 1920.0 / size.width);          
          this.resize(size.width * factor, size.height * factor);
          
          this.toBuffer("JPG", (error, newBuffer) => {
            if (error) reject(error);
            resolve(newBuffer);
          });
        });
    } catch (error) {
      reject(error);
    }
  });
}
