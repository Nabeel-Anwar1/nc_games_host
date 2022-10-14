const fs = require("fs/promises");

exports.selectEndpoints = () => {
  return fs
    .readFile(`/home/nabeel/northcoders/backend/be-nc-games/endpoints.json`)
    .then((contents) => {
      console.log(contents.toString());
      return contents;
    });
};
