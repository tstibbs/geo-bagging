if (navigator.userAgent.indexOf('Trident') != -1
|| navigator.userAgent.indexOf('trident') != -1
|| navigator.userAgent.indexOf('MSIE') != -1
|| navigator.userAgent.indexOf('msie') != -1) {
    alert("Geo-Bagging does not support Internet Explorer. Please use a more modern browser like Chrome or Edge. If you are not running in Internet Explorer and this message is being shown in error, please report a bug at https://github.com/tstibbs/geo-bagging/issues/new");
