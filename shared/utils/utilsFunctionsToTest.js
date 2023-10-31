var utils = {};
var testToken = true; // Variable para omitir la validacion de identidad en local [DEV]

utils.setTokenInLocalStorage1 = function (user, password, callback) {
  var myHeaders = new Headers();
  myHeaders.append('Connection', 'keep-alive');
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Accept', 'application/json, text/plain, */*');
  myHeaders.append('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36');
  myHeaders.append('x-api-key', 'tJI0HIPiuC36hlUGcZoQW9m6GJTLhHOPkCjYxnBi');
  myHeaders.append('Sec-Fetch-Site', 'cross-site');
  myHeaders.append('Sec-Fetch-Mode', 'cors');
  myHeaders.append('Sec-Fetch-Dest', 'empty');
  myHeaders.append('X-Amz-Content-Sha256', 'beaead3198f7da1e70d03ab969765e0821b24fc913697e929e726aeaebf0eba3');
  myHeaders.append('X-Amz-Date', '20210923T202922Z');
  myHeaders.append('Authorization', 'AWS4-HMAC-SHA256 Credential={{access_key}}/20210923/us-east-1/execute-api/aws4_request, SignedHeaders=accept;content-type;host;sec-fetch-dest;sec-fetch-mode;sec-fetch-site;x-amz-content-sha256;x-amz-date;x-api-key, Signature=108cc6a2722e57da48d6b0323352bb3e092fe7c00181f31824964fd20898ad50');
  var raw = JSON.stringify({
    username: user,
    password: password,
    country: 'co',
    deviceId: '123456',
    code: '444444',
    trace: {
      creationChannel: 'oneapp',
      creationChannelType: 'email',
    },
  });
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };
  fetch('https://tigoid-api-qa.tigocloud.net/dar/v4/public/auth/login', requestOptions)
    .then((response) => response.text())
    .then((result) => {
      var resp = JSON.parse(result);
      // console.log(resp);
      if (resp.success === true && resp.body != null && resp.success === true) {
        localStorage.setItem('IdToken', resp.body.IdToken);
        if (callback != void 0 && callback != null) {
          callback();
        }
      }
    })
    .catch((error) => console.log('error', error));
};

utils.setTokenInLocalStorage = function (user, password, callback) {
  // console.log('testToken :>> ', testToken);
  var myHeaders = new Headers();
  myHeaders.append('Connection', 'keep-alive');
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Accept', 'application/json, text/plain, */*');
  myHeaders.append('Sec-Fetch-Site', 'cross-site');
  myHeaders.append('Sec-Fetch-Mode', 'cors');
  myHeaders.append('Sec-Fetch-Dest', 'empty');
  myHeaders.append('Accept-Language', 'en-US,en;q=0.9,es;q=0.8');
  myHeaders.append('x-api-key', 'jZXeAL6rex7NJEPTvuHen1hY6Ehkvwzz2i31shDR');
  myHeaders.append('X-Amz-Content-Sha256', 'beaead3198f7da1e70d03ab969765e0821b24fc913697e929e726aeaebf0eba3');
  myHeaders.append('X-Amz-Date', '20210923T194030Z');
  myHeaders.append('Authorization', 'AWS4-HMAC-SHA256 Credential=AKIAR5AURRDSVX4PKNX6/20210923/us-east-1/execute-api/aws4_request, SignedHeaders=accept;accept-language;connection;content-type;host;sec-fetch-dest;sec-fetch-mode;sec-fetch-site;x-amz-content-sha256;x-amz-date;x-api-key, Signature=7530efcdee40313c0db19bec78f01be85ea12dfd2aa96a776c2e5cf54e3943c7');

  var raw = JSON.stringify({
    username: user,
    password: password,
    country: 'co',
    code: '444444',
    deviceId: '123456',
    trace: { creationChannel: 'oneapp', creationChannelType: 'email' },
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  if (testToken) {
    localStorage.setItem('IdToken', 'token');
    callback();
  } else {
    fetch('https://tigoid-api-qa.tigocloud.net/dar/v4/public/auth/login', requestOptions)
      .then((response) => response.text())
      .then((result) => {
        var resp = JSON.parse(result);
        if (resp != void 0 && resp != null && resp.body != void 0 && resp.body != null) {
          localStorage.setItem('IdToken', resp.body.IdToken);
          // console.log(resp.AuthenticationResult);
          if (callback != void 0 && callback != null) {
            callback();
          }
        }
      })
      .catch((error) => console.log('error', error));
  }
};

utils.encodeQueryData = function (data) {
  const ret = [];
  for (var d in data) {
    ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
  }
  return ret.join('&');
};

utils.getParams = function (url) {
  var params = {};
  var parser = document.createElement('a');
  parser.href = url;
  var query = parser.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    params[pair[0]] = decodeURIComponent(pair[1]);
  }
  return params;
};

utils.loadJSON = function (callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType('application/json');
  xobj.open('GET', 'config.json', true); // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == '200') {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
};

utils.loadSelector = function (ids) {
  var accountSelected = localStorage.getItem('wcAccountId');

  var exist = false;
  for (var i = 0; i < ids.length; i++) {
    if (ids[i] == accountSelected) {
      exist = true;
    }
  }

  if (exist == false || accountSelected == null) {
    accountSelected = ids[0];
  }

  localStorage.setItem('wcAccountId', accountSelected);

  for (var i = 0; i < ids.length; i++) {
    if (ids[i] == accountSelected) {
      $('#accountSelector').append(
        '<option selected value="' + ids[i] + '">' + ids[i] + '</option>'
      );
    } else {
      $('#accountSelector').append('<option value="' + ids[i] + '">' + ids[i] + '</option>');
    }
  }

  $('#accountSelector').on('change', function () {
    localStorage.setItem('wcAccountId', $(this).val());
    window.location.href = '/';
  });
};

utils.init = function () {
  var ids = dataJson.ids;

  if (ids != void 0 && ids != null) {
    utils.loadSelector(ids);
  } else {
    utils.loadSelector([dataJson.id]);
  }

  var container_wc = '.render-wc-index';
  var params = utils.getParams(window.location.href);

  if (params.tagHtml != void 0 && params.tagHtml != null && params.tagHtml != '') {
    tagName = params.tagHtml;
    container_wc = '.render-wc';

    Object.assign(dataJson, params);
    document.querySelector('.render-wc-index').classList.add('d-none');
  } else {
    document.querySelector('.render-wc-index').classList.remove('d-none');
  }

  var wc = document.createElement(tagName);
  var container = document.querySelector(container_wc);

  container.append(wc);

  wc.addEventListener('eventCustom', function (e) {
    console.log('eventCustom data :>> ', e.detail);
  });

  wc.addEventListener('wcLoading', function (e) {
    var loading = document.querySelector(container_wc + ' .div-loading');

    if (loading != null) {
      if (e.detail.data.status) {
        loading.classList.add('d-flex');
        loading.classList.remove('d-none');
      } else {
        loading.classList.remove('d-flex');
        loading.classList.add('d-none');
      }
    }
  });

  wc.addEventListener('wcMessage', function (e) {
    var data = e.detail.data;

    var class_alert = 'alert-default';
    if (data.type == 'error') {
      class_alert = 'alert-danger';
    }
    if (data.type == 'success') {
      class_alert = 'alert-success';
    }
    if (data.type == 'warning') {
      class_alert = 'alert-warning';
    }
    if (data.type == 'info') {
      class_alert = 'alert-info';
    }

    var html =
      '<div class="alert ' + class_alert + ' alert-dismissible div-alert" role="alert">\n' +
      '<span class="alert-text">' +
      data.message +
      '</span>\n' +
      '<button type="button" class="close" data-dismiss="alert" aria-label="Close">\n' +
      '<span aria-hidden="true">&times;</span>\n' +
      '</button>\n' +
      '</div>\n';

    document.querySelector('.div-message').innerHTML = html + document.querySelector('.div-message').innerHTML;
  });

  wc.addEventListener('wcSegment', function (e) {
    // console.log('segment', e.detail.data);
  });

  wc.addEventListener('wcRedirect', function (e) {
    var event = e.detail.data;
    // console.log('wcRedirect :>> ', event);

    if (event.redirectType == 'webcomponent') {
      var params = {
        tagHtml: event.data.tagHtml,
      };

      for (var k in event.data.params) {
        if (event.data.params.hasOwnProperty(k)) {
          params[k] = event.data.params[k];
        }
      }
      var url = event.url + '?';
      url += utils.encodeQueryData(params);
      window.location.href = url;
    }

    if (event.redirectType == 'self') {
      // console.log(event);
      let urlSelf = event.url;
      if (event.data.hasOwnProperty('force_update')) {
        if (event.data.force_update) {
          urlSelf = urlSelf + '?';
          let paramsForce = {
            force_update: 'true',
            tagHtml: event.data.tagHtml,
          };
          urlSelf += utils.encodeQueryData(paramsForce);
        }
      }
      window.location.href = urlSelf;
    }

    if (event.redirectType == 'blank') {
      let urlBlank = event.url;
      if (event.data.hasOwnProperty('force_update')) {
        if (event.data.force_update) {
          urlBlank = urlBlank + '?';
          let paramsForce = {
            force_update: 'true',
            tagHtml: event.data.tagHtml,
          };
          urlBlank += utils.encodeQueryData(paramsForce);
        }
      }
      window.open(urlBlank, '_blank');
    }

    if (event.redirectType == 'blank') {
      // console.log(event);
      // window.location.href = event.url;
    }
  });

  wc.addEventListener('wcRefreshToken', function (e) {
    utils.setTokenInLocalStorage(authData.user, authData.password, function () {
      wc.setAttribute('refresh-wc', new Date().getTime());
      console.log('new token Test!');
    });
  });

  dataJson.id = localStorage.getItem('wcAccountId');
  wc.wcData = dataJson;

  document.querySelector('.btn-refresh').addEventListener('click', function (e) {
    wc.setAttribute('refresh-wc', new Date().getTime());
  });

  document.querySelector('.btn-home').addEventListener('click', function (e) {
    window.location.href = '/';
  });

  document.querySelector('.btn-back').addEventListener('click', function (e) {
    window.history.back();
  });
};
