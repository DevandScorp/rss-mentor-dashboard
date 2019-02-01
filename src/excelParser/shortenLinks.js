// function, which is used to remove unnecessary parts of links
function shortenLinks(fullLink, separator) {
  let shortenLink = fullLink.substring(fullLink.indexOf(separator) + separator.length,
    fullLink.length);
  if (shortenLink.indexOf('-2018Q3') !== -1)shortenLink = shortenLink.slice(0, shortenLink.indexOf('-2018Q3'));
  if (shortenLink.indexOf('/') !== -1)shortenLink = shortenLink.slice(0, shortenLink.indexOf('/'));
  return shortenLink;
}
module.exports = shortenLinks;
