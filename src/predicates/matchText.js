const matchSubstring = require('./matchSubstring');
// Includes the entire type string
//   ?q=text:shuffle
//   ?q=text:gain q:life
const matchText = (needles, card) => {
  return matchSubstring(needles, card.text);
};

module.exports = matchText;