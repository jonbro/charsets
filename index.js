var fs = require('fs');
const punycode = require('punycode');

var extractCharData = function(cData)
{
  let charDataLines = cData.split("\n");
  let readline = 0;
  let res = {};
  res.chars = {};
  let charCount = 0;
  for(let i=0;i<charDataLines.length;i++)
  {
    let line = charDataLines[i];
    if(line.substring(0,2) == "//")
      continue;
    // first line, source image
    if(readline == 0)
    {
      res.sourceImg = line;
    }
    else if(readline==1)
    {
      let dim = line.split(",");
      dim = [parseInt(dim[0].trim()), parseInt(dim[1].trim())];
      res.dim = dim;
    }
    else
    {
      let codepoints = punycode.ucs2.decode(line);
      for(let j=0;j<codepoints.length;j++)
      {
        c = punycode.ucs2.encode([codepoints[j]]);
        res.chars[c] = charCount;
        charCount++;
      }
    }
    // second line, image dimensions
    // all other lines, character layout
    readline++;
  }
  return res;
}
var setNames = [];
fs.readdir(__dirname + "/data", function(err, items){
  let strippedItems = [];
  for(let i=0;i<items.length;i++)
  {
    let base = items[i].split(".")[0];
    if(items[i].split(".")[1] == "char")
    {
      strippedItems.push(base);
    }
  }
  setNames = strippedItems;
});
let listSets = function()
{
  return setNames;
}
let getSet = function(setName)
{
  let baseName = __dirname + "/data/"+setName;
  if(fs.existsSync(baseName+".png") && fs.existsSync(baseName+".char"))
  {
    let b64img = fs.readFileSync(baseName+".png").toString("base64");
    let charData = fs.readFileSync(baseName+".char", "utf8");
    // extract the data from the character set stuff
    charData = extractCharData(charData);
    charData.img = b64img;
    return charData;
  }
  else
  {
    return {};
  }
}

module.exports = {
  listSets: listSets,
  getSet: getSet
}
