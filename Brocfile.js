var funnel = require('broccoli-funnel');

// the variable `html` now holds a Broccoli tree
var html = funnel('app', {
  files   : ['index.html'],
  destDir : '/'
});
module.exports = html;

var concat = require('broccoli-concat');
var mergeTrees = require('broccoli-merge-trees');
var styles = concat('css/', {
               inputFiles : ['style.css',
                             'fontello/css/fontello.css'],
               outputFile : '/site.css'
             });

var fonts = funnel('fontello/font', {
  files   : ['fontello.woff',
             'fontello.ttf'],
  destDir : '/font'
});

module.exports = mergeTrees([html, styles, fonts]);
