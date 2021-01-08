$(document).ready(function () {
  let _url = 'https://my-json-server.typicode.com/adimunawar31/pwa-api/products';

  let result = '';
  let marquee = '';
  let catResult = '';
  let categories = [];

  function renderPage(data) {
      $.each(data, function (key, items) {
        console.log(items.name);
        marquee += `
        <a href="" class="links"> 
        Name : <span class="text-success">${items.name}</span> ~~ Category : <span class="text-danger">${items.category}</span> ||
        </a>`;
        _cat = items.category;
        result += `<div>
        <h3>${items.name}</h3>
        <footer class="badge badge-pill badge-warning">Category : ${_cat}</footer>
        <hr class="bg-light">
        </div>`;
  
        if ($.inArray(_cat, categories) == -1) {
          categories.push(_cat);
          catResult += `<option value="${_cat}">${_cat}</option>`;
        }
      });
      $('#product').html(result);
      $('#mr').html(marquee);
      $('#select').html(
        "<option value='all' selected><-- All Product Data --></option>" +
          catResult,
      );
  }

  let networkDataReceived = false;

  // RETURN DATA FROM ONLINE
  let networkUpdate = fetch(_url)
    .then(function (response) {
    return response.json()
  }).then(function (data) {
    networkDataReceived = true;
    renderPage(data)
  });

  // RETURN DATA FROM CACHE
  caches.match(_url).then(function (response) {
    if (!response) throw Error('No data on cache!')
    return response.json();
  }).then(function (data) {
    if (!networkDataReceived) {
      renderPage(data);
      console.log('Data From Cache ' + data);
    }
  }).catch(function () {
    return networkUpdate
  });

  // fungsi filter
  $('#select').on('change', function () {
    updateProduct($(this).val());
  });

  function updateProduct(cat) {
    let result = '';
    let marquee = '';
    let newUrl = _url;
    if (cat != 'all') {
      newUrl = _url + `?category=${cat}`;
    }

    $.get(newUrl, function (data) {
      $.each(data, function (key, items) {
        _cat = items.category;
        result += `<div>
        <h3>${items.name}</h3>
        <footer class="badge badge-pill badge-warning">Category : ${_cat}</footer>
        <hr class="bg-light">
        </div>`;

        marquee += `
      <a href="" class="links"> 
      Name : <span class="text-success">${items.name}</span> ~~ Category : <span class="text-danger">${items.category}</span> ||
      </a>`;
      });
      $('#product').html(result);
      $('#mr').html(marquee);
    });
  }
});


if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('serviceWorker.js')
      .then(function (registration) {
      console.log('ServiceWorker registration was successful with scope: ' + registration.scope);
      }, function (err) {
          console.log('ServiceWorker registration failed!', + err);
    });
  })
}