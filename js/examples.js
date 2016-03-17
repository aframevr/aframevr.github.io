/* global $, getJSON, settings, singlePage */
(function () {

var path = window.location.pathname;
var pathWithSlash = forceTrailingSlash(path);

var a = document.createElement('a');
function parseUrl (url) {
  a.href = url;
  return a;
}

function stripTrailingSlash (url) {
  return url.replace(/\/+$/, '');
}

function forceTrailingSlash (str) {
  if (str.substr(-1) !== '/') {
    str += '/';
  }
  return str;
}

var examplesSubnav = document.querySelector('#examplesSubnav');
var examplesRoutes = {};

function getUrlParameter (name) {
  // Simple function because `URLSearchParams` isn't supported everywhere yet.
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

var examplesServerUrl = getUrlParameter('examples_server_url');

if (window.location.protocol === 'http:') {
  // We're likely running the dev server.
  // We could also just check if `localStorage.debug` is set, but this is faster.
  if (examplesServerUrl) {
    try {
      localStorage.examplesServerUrl = examplesServerUrl;
    } catch (e) {}
    // Remove the query string and reload the page.
    window.location.href = window.location.href.split('?')[0] + window.location.hash;
    return;
  }
}

try {
  examplesServerUrl = localStorage.examplesServerUrl;
} catch (e) {
  examplesServerUrl = null;
}

getJSON(settings.rootUrl + '/examples/index.json', function (err, examples) {
  if (err) {
    console.error('Could not fetch examples\n%s', err);
    return;
  }

  fetchExamples(examples);
  init();
});

function fetchExamples (examples) {
  if (examplesSubnav) {
    var li;
    var a;
    var span;
    var url;
    var className = '';
    var supportsAndroid;
    var supportsIOS;

    var tempExamplesSubnav = document.createElement('ul');

    if (examples.home) {
      // For local development.
      if (examplesServerUrl) {
        examples.home.scene_url = examples.home.scene_url.replace('https://aframe.io/aframe', stripTrailingSlash(examplesServerUrl));
      }
    }

    examples.showcase.forEach(function (item, idx) {
      // For local development.
      if (examplesServerUrl) {
        item.scene_url = item.scene_url.replace('https://aframe.io/aframe', stripTrailingSlash(examplesServerUrl));
      }

      url = settings.rootUrl + '/examples/' + item.section + '/' + item.slug + '/';

      className = url === pathWithSlash ? ' current' : '';
      supportsAndroid = item.supports && ('android' in item.supports) ? item.supports.android : true;
      supportsIOS = item.supports && ('ios' in item.supports) ? item.supports.ios : true;

      // TODO: Make DRY with HTML generated by server in `sidebar.ejs` (use templates).
      li = document.createElement('li');
      li.setAttribute('data-supports-android', supportsAndroid);
      li.setAttribute('data-supports-ios', supportsIOS);
      li.setAttribute('data-url', url);
      li.setAttribute('data-scene-url', item.scene_url);
      li.setAttribute('data-slug', item.slug);
      li.setAttribute('data-idx', idx);
      li.className = 'example-item subnav-item' + className;

      a = document.createElement('a');
      a.setAttribute('data-spa-link', '');
      a.setAttribute('href', url);
      a.className = 'subnav-link' + className;

      span = document.createElement('span');
      span.className = 'sidebar__link__text';
      span.textContent = item.title;

      a.appendChild(span);
      li.appendChild(a);
      tempExamplesSubnav.appendChild(li);

      item.url = url;
      item.getLi = function () {
        return $('.example-item[data-slug="' + this.slug + '"]');
      };
      item.getA = function () {
        return $('.example-item[data-slug="' + this.slug + '"] a');
      };

      examplesRoutes[url] = item;
    });

    examplesSubnav.innerHTML = tempExamplesSubnav.innerHTML;
    delete tempExamplesSubnav;
  }

  examplesRoutes.__default__ = examples.showcase[0];
  examplesRoutes.__home__ = examples.home;
}

function init () {
  var body = document.body;

  var currentLink = getCurrentNavLink();
  var navLinks = getNavLinks();
  var navLinksLength = navLinks.length;

  // Trigger `:active` styles when we "click" on examples, previous/next links.
  var SHOW_ACTIVE_STYLES_ON_CLICK = true;

  function getTitle (title) {
    return settings.title.replace('{title}', title);
  }

  function clickEl (el) {
    if (!el) { return; }
    if (SHOW_ACTIVE_STYLES_ON_CLICK) { el.classList.add('click'); }
    el.click();
  }

  function clickNavLink (link) {
    currentLink = getCurrentNavLink();
    if (!currentLink || currentLink === link) { return; }
    currentLink.classList.remove('current');
    currentLink.classList.remove('click');
    clickEl(link);
    currentLink = link;
    currentLink.classList.add('current');
    currentLink.classList.remove('click');
  }

  function getCurrentNavLink () {
    return document.querySelector('.examples-subnav .subnav-link.current');
  }

  function getNavLinks () {
    return document.querySelectorAll('.examples-subnav .subnav-link');
  }

  function getDestNavLink (left) {
    currentLink = getCurrentNavLink();
    var idx = parseInt(currentLink.parentNode.getAttribute('data-idx'), 10);

    var offset = left ? -1 : 1;
    var nextIdx = idx + offset;
    if (nextIdx < 0) { nextIdx = navLinksLength - 1; }

    var destLink = navLinks[nextIdx % navLinksLength];

    return destLink;
  }

  function getPrevNavLink () {
    return getDestNavLink(true);
  }

  function getNextNavLink () {
    return getDestNavLink(false);
  }

  body.addEventListener('keyup', function (e) {
    var left = e.keyCode === 37;
    var right = e.keyCode === 39;
    if (!left && !right) { return; }

    if (!currentLink) {
      // TODO: Swap out when SPA is engaged.
      window.location.href = settings.rootUrl + '/examples/';
      return;
    }

    var destLink = left ? getPrevNavLink() : getNextNavLink();
    clickNavLink(destLink);
  });

  var examplePrev = document.querySelector('#examplePrev');
  var exampleNext = document.querySelector('#exampleNext');
  examplePrev.addEventListener('click', function () {
    this.setAttribute('href', getPrevNavLink());
  });
  exampleNext.addEventListener('click', function () {
    this.setAttribute('href', getNextNavLink());
  });

  var showPage = singlePage(function (href) {
    var hrefWithSlash = forceTrailingSlash(parseUrl(href).pathname);

    var exampleIframe = document.querySelector('#exampleIframe');
    if (exampleIframe) {
      var currentExample;
      if (settings.isHome) {
        currentExample = examplesRoutes.__home__;
      } else {
        if (hrefWithSlash in examplesRoutes) {
          currentExample = examplesRoutes[hrefWithSlash];
        }
        if (!currentExample) {
          currentExample = examplesRoutes.__default__;
        }

        document.title = getTitle(currentExample.title);

        currentExample.getLi().classList.add('current');
        currentExample.getA().classList.add('current');
      }

      exampleIframe.setAttribute('src', currentExample.scene_url);

      var exampleViewsource = document.querySelector('#exampleViewsource');
      if (exampleViewsource) {
        exampleViewsource.setAttribute('href', currentExample.source_url);
      }
    }
  });

  body.addEventListener('spa-navigate', function (e) {
    var link = $('[data-spa-link][href="' + e.detail.path + '"]');
    if (link) {
      clickNavLink(link);
      showPage(e.detail.path);
    }
  });
}

})();
