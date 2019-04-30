/*
MIT License

Copyright (c) 2019 Berk Soysal

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var SocialCounter = function(callbackFunc) {

    function socialCounter(callbackFunc) {
        this._url = this._getURL();

        this._initialize($("#social-counter"), callbackFunc);
        this._getCounts()
    }

    socialCounter.prototype._getURL = function() {
        var docURL = window.location.href;

        docURL = docURL.replace(/\#.*/,'');
        docURL = docURL.replace("\/?m=1", "");
        docURL = docURL.replace("\?m=1", "");
        docURL = docURL.replace("https://", "http://");
        
        return docURL;
    }

    socialCounter.prototype._initialize = function (container, callbackFunc) {
        // Empty container first to prevent multiple initialization
        container.empty();

        // Total Shares
        var socialTotalContainer = $('<div class="social-total-container"></div>').appendTo(container);
        $('<div class="social-total">0</div>').appendTo(socialTotalContainer);
        $('<div class="social-total-text">SHARES</div>').appendTo(socialTotalContainer);

        // Buttons
        var buttonGroup = $('<div class="button-group"></div>').appendTo(container);
        
        var fbButton = $('<button class="fb"><a><i class="fab fa-facebook-f"></i></a></button>').appendTo(buttonGroup);
        var twitterButton = $('<button class="twitter"><a><i class="fab fa-twitter"></i></a></button>').appendTo(buttonGroup);
        var liButton = $('<button class="li"><a><i class="fab fa-linkedin-in"></i></a></button>').appendTo(buttonGroup);
        var piButton = $('<button class="pi"><div class="count">0</div><a><i class="fab fa-pinterest"></i></a></button>').appendTo(buttonGroup);
        var mixButton = $('<button class="mix"><a><i class="fab fa-mix"></i></a></button>').appendTo(buttonGroup);
        var tumblrButton = $('<button class="tumblr"><div class="count">0</div><a><i class="fab fa-tumblr"></i></a></button>').appendTo(buttonGroup);
        var printButton = $('<button class="print"><a><i class="fa fa-print"></i></a></button>').appendTo(buttonGroup);

        var currentTitle = document.title;
        var windowOpenSettings = "height=550,width=525,left=100,top=100,menubar=0";
    
        fbButton.click(function() {
            if (callbackFunc) 
                callbackFunc();
            return window.open("https://www.facebook.com/sharer.php?u=" + this._url, "", windowOpenSettings);
        }.bind(this));
        
        twitterButton.click(function() {
            if (callbackFunc) 
                callbackFunc();
            return window.open("https://twitter.com/share?url=" + this._url + "&text=" + currentTitle + "&hashtags=codemio,programming,technology", "", windowOpenSettings);
        }.bind(this));
        
        liButton.click(function() {
            if (callbackFunc) 
                callbackFunc();
            return window.open("https://www.linkedin.com/shareArticle?mini=true&url=" + this._url + "&title=" + currentTitle + "&source=", "", windowOpenSettings);
        }.bind(this));

        piButton.click(function() {
            if (callbackFunc) 
                callbackFunc();
            var e=document.createElement('script');
            e.setAttribute('type','text/javascript');
            e.setAttribute('charset','UTF-8');
            e.setAttribute('src','https://assets.pinterest.com/js/pinmarklet.js?r='+Math.random()*99999999);
            document.body.appendChild(e)
        }.bind(this));

        mixButton.click(function() {
            if (callbackFunc) 
                callbackFunc();
            return window.open("https://mix.com/add?url=" + this._url, "", windowOpenSettings), !1
        }.bind(this));
        
        tumblrButton.click(function() {
            if (callbackFunc) 
                callbackFunc();
            return window.open("https://www.tumblr.com/widgets/share/tool?url=" + this._url, "", windowOpenSettings), !1
        }.bind(this));

        printButton.click(function() {
            window.print();
        }.bind(this));
    }

    socialCounter.prototype._getCounts = function() {
        var total = 0;
        var updateTotalFunc = this._updateTotal.bind(this);
        var shortenFunc = this._shorten.bind(this);

        var callback = function (count, element) {
            total += count;
            if (count == 0) {
                jQuery(element).remove();
                return;
            }
            jQuery(element).text(shortenFunc(count));
            updateTotalFunc(total);
            jQuery(".social-total-container").css("display", "block");
        };

        var pinterestCount = this._getPinterestCount(function(count) {
            callback(count, ".pi .count");
        });

        var tumblrCount = this._getTumblrCount(function(count) {
            callback(count, ".tumblr .count");
        });
    }

    socialCounter.prototype._updateTotal = function (total) {
        if (!isNaN(total)) {
            jQuery(".social-total").text(this._shorten(total));
        }
    }

    socialCounter.prototype._shorten = function (num) {
        var n = parseInt(num, 10);

        if (n === null) {
            return 0;
        }
        
        if (n >= 1000000000) {
            return (n / 1000000000).toFixed(1).replace(/\.0$/, "") + "G";
        }
        
        if (n >= 1000000) {
            return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
        }
        
        if (n >= 1000) {
            return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
        }
        
        return n;
    }

    socialCounter.prototype._getPinterestCount = function (onComplete) {
        jQuery.getJSON("https://api.pinterest.com/v1/urls/count.json?url=" + this._url + "&callback=?", 
        function(data) {
            if (data.count) {
                onComplete(data.count);
                return;
            }
            onComplete(0);
        });
    }

    socialCounter.prototype._getTumblrCount = function (onComplete) {
        $.getJSON('https://api.tumblr.com/v2/share/stats?url=' + encodeURIComponent(this._url) + '&callback=?', 
        function(response) {
            if (response.response.note_count) {
                onComplete(parseInt(response.response.note_count));
                return;
            }
            onComplete(0);
        });
    }

    new socialCounter(callbackFunc)
};