/**!
 * @fileOverview turbolinks-animate.js - Animations extending Turbolinks
 * @version 1.3.8
 * @license
 * MIT License
 *
 * Copyright (c) 2017 Jonas Hübotter
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
$.fn.extend({
    turbolinksAnimate: function(options) {
        var defaults = {
            animation: 'fadein',
            duration: '0.3s',
            delay: false,
            reversedDisappearing: true,
            mobileMedia: '500',
            tabletMedia: '1024'
        };

        options = $.extend( defaults, options );

        turbolinksAnimateInit( $(this), options );
    }
});


var turbolinksAnimateData = {}, turbolinksAnimateInline = false, turbolinksAnimateElement, turbolinksAnimateElements;

function turbolinksAnimateInit( el, options ) {
    var turbolinksAnimatePreviousType = turbolinksAnimateData['type'],
        turbolinksAnimateAppear = turbolinksAnimateData['appear'];
    turbolinksAnimateData = {};
    turbolinksAnimateElement = el;
    turbolinksAnimateData['animation'] = options.animation;
    turbolinksAnimateData['duration'] = options.duration;
    turbolinksAnimateData['delay'] = options.delay;
    turbolinksAnimateData['mobileMedia'] = options.mobileMedia;
    turbolinksAnimateData['tabletMedia'] = options.tabletMedia;
    turbolinksAnimateData['appear'] = turbolinksAnimateAppear;
    turbolinksAnimateData['previousType'] = turbolinksAnimatePreviousType;
    $('a, button').click( function() {
        if ( $(this).data('turbolinks-animate-animation') !== undefined ) { turbolinksAnimateInline = true };
        turbolinksAnimateData['animation'] = $(this).data('turbolinks-animate-animation') || options.animation;
        turbolinksAnimateData['appear'] = $(this).data('turbolinks-animate-appear');
        turbolinksAnimateData['duration'] = $(this).data('turbolinks-animate-duration') || options.duration;
        turbolinksAnimateData['delay'] = $(this).data('turbolinks-animate-delay') || options.delay;
        turbolinksAnimateData['type'] = $(this).data('turbolinks-animate-type');
    });
};



function turbolinksAnimateAppear() {
    turbolinksAnimateToggle(false);
    delete turbolinksAnimateData['appear'];
};

function turbolinksAnimateDisappear() {
    turbolinksAnimateToggle(true);
};

function turbolinksAnimateToggle(disappears) {
    if ( turbolinksAnimateData['animation'] != 'false' ) {
        turbolinksAnimateReset();
        turbolinksAnimateOptions();

        Turbolinks.clearCache() // fix cache issues
        turbolinksAnimateAnimateElements(disappears);
    };
};



function turbolinksAnimateGetAnimation(disappears) {
    var animation;
    if (!disappears) { animation = turbolinksAnimateData['appear'] };
    if (turbolinksAnimateInline) {
        animation = turbolinksAnimateData['animation']
    } else if ( typeof turbolinksAnimateElement.data('turbolinks-animate-animation') !== 'undefined' ) {
        animation = turbolinksAnimateElement.data('turbolinks-animate-animation')
    } else {
        animation = turbolinksAnimateData['animation'];
    };
    return animation;
};

function turbolinksAnimateOptions() {
    turbolinksAnimateElement.css('animationDuration', turbolinksAnimateData['duration']);
    if (turbolinksAnimateData['delay'] != false) {
        turbolinksAnimateElement.css('animationDelay', turbolinksAnimateData['delay']);
    };
    if ( typeof turbolinksAnimateElements !== 'undefined' ) {
        $(turbolinksAnimateElements).each(function() {
            $(this).css('animationDuration', turbolinksAnimateData['duration']);
            if (turbolinksAnimateData['delay'] != false) {
                $(this).css('animationDelay', turbolinksAnimateData['delay']);
            };
        });
    };
};

function turbolinksAnimateReset() {
    var classes = 'fadeIn fadeInUp fadeInDown fadeInLeft fadeInRightfadeOut fadeOutUp fadeOutDown fadeOutLeft fadeOutRight';
    if ( typeof turbolinksAnimateElements !== 'undefined' ) {
        $(turbolinksAnimateElements).each(function() {
            $(this).removeClass(classes);
        });
    };
    turbolinksAnimateElement.removeClass(classes);
};



function turbolinksAnimateAnimateElements(disappears) {
    if ( turbolinksAnimateElement.find('[data-turbolinks-animate-persist]').length > 0 || turbolinksAnimateElement.find('[data-turbolinks-animate-persist-itself]').length > 0 ) {
        turbolinksAnimateElements = turbolinksAnimateGetElements();
        $(turbolinksAnimateElements).each(function() {
            $(this).one( 'webkitAnimationEnd mozAnimationEnd oAnimationEnd oanimationend animationend', function() {
                setTimeout(function() {
                    turbolinksAnimateReset();
                }, 250);
            });
            $(this).addClass(turbolinksAnimateGetClassListFor( turbolinksAnimateGetAnimation(disappears), disappears ));
        });
    };
    turbolinksAnimateElement.one( 'webkitAnimationEnd mozAnimationEnd oAnimationEnd oanimationend animationend', function() {
        setTimeout(function() {
            turbolinksAnimateReset();
        }, 250);
    });
    turbolinksAnimateElement.addClass(turbolinksAnimateGetClassListFor( turbolinksAnimateGetAnimation(disappears), disappears ));

    delete turbolinksAnimateData['previousType'];
    turbolinksAnimateInline = false;
};

function turbolinksAnimateGetElements() {
    var turbolinksAnimateElements = [];

    getChildren(turbolinksAnimateElement);

    function getChildren(parent) {
        var turbolinksAnimateType = turbolinksAnimateData['type'] || turbolinksAnimateData['previousType'] || 'true';
        if (parent.attr('data-turbolinks-animate-persist') == turbolinksAnimateType) {
            return;
        } else if ( parent.attr('data-turbolinks-animate-persist-itself') == turbolinksAnimateType || parent.find('[data-turbolinks-animate-persist]').length > 0 || parent.find('[data-turbolinks-animate-persist-itself]').length > 0 ) {
            parent.children().each(function() {
                getChildren($(this));
            });
        } else {
            turbolinksAnimateElements.push(parent);
        };
    };

    return turbolinksAnimateElements
};



function turbolinksAnimateGetClassListFor( animations, disappears ) {
    var classList = 'animated',
        browserWidth = $(window).width();
    if ( browserWidth <= turbolinksAnimateData['mobileMedia'] ) {
        var animation = animations['mobile'] || animations['tablet'] || animations['desktop'] || animations;
    } else if ( browserWidth <= turbolinksAnimateData['tabletMedia'] ) {
        var animation = animations['tablet'] || animations['desktop'] || animations;
    } else {
        var animation = animations['desktop'] || animations;
    };
    animation.toLowerCase();
    if ( animation == 'fadein' ) { classList += ( disappears ? ' fadeOut' : ' fadeIn' ) }
    else if ( animation == 'fadeinup' ) { classList += ( disappears ? ( turbolinksAnimateData['reversedDisappearing'] ? ' fadeOutDown' : ' fadeOutUp' ) : ' fadeInUp' ) }
    else if ( animation == 'fadeindown' ) { classList += ( disappears ? ( turbolinksAnimateData['reversedDisappearing'] ? ' fadeOutUp' : ' fadeOutDown' ) : ' fadeInDown' ) }
    else if ( animation == 'fadeinleft' ) { classList += ( disappears ? ' fadeOutLeft' : ' fadeInLeft' ) }
    else if ( animation == 'fadeinright' ) { classList += ( disappears ? ' fadeOutRight' : ' fadeInRight' ) }
    else if ( animation == 'fadeout' ) { classList += ' fadeOut' }
    else if ( animation == 'fadeoutup' ) { classList += ( turbolinksAnimateData['reversedDisappearing'] ? ' fadeOutDown' : ' fadeOutUp' ) }
    else if ( animation == 'fadeoutdown' ) { classList += ( turbolinksAnimateData['reversedDisappearing'] ? ' fadeOutUp' : ' fadeOutDown' ) }
    else if ( animation == 'fadeoutleft' ) { classList += ' fadeOutLeft' }
    else if ( animation == 'fadeoutright' ) { classList += ' fadeOutRight' };
    return classList;
};
