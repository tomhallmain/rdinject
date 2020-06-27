
// Conditional Settings On Page Load

document.getElementsByTagName('body')[0].style.filter = "brightness(80%)"
document.getElementsByTagName('body')[0].style.backgroundColor = "#92a8d1"

const baseUrl = 'https://www.reddit.com/'
const initialLink = window.location.href;
const postLinkRe = /reddit\.com\/r\/[-_A-Za-z]+\/comments/;
const showQuery = '?limit=500';
const postLink = postLinkRe.test(initialLink);
const showing500Posts = initialLink.includes(showQuery);

//if (postLink && !showing500Posts) {
//  if (postCommentCount() > 400) {
//    window.location.replace(initialLink + showQuery)
//  };
//};

if (postLink && (postCommentCount() > 600 || postCommentCount() <= 400)) {
  expandPosts()
  window.scrollTo(0, 0)
};


