(function () {

function initGoogleAnalyticsEvents () {
  window.ga('create', 'UA-24056643-4', 'auto', {name: 'originalTracker'});
  window.ga('send', 'event', 'pageload.querystring', window.location.search);
  window.ga('send', 'event', 'pageload.hash', window.location.hash);
  window.ga('send', 'event', 'supports.getVRDevices', 'getVRDevices' in navigator);
  window.ga('send', 'event', 'supports.getVRDisplays', 'getVRDisplays' in navigator);
  window.ga('send', 'event', 'supports.WEBVRPLUS', 'WEBVRPLUS' in window);
}

initGoogleAnalyticsEvents();

})();
