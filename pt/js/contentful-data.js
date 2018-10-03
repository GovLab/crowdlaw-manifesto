var contentfulClient = contentful.createClient({
  accessToken: '9a8ad725385db3f0ff407604f43fe74e72c7c3154c493c6011494264a7090a49',
  space: 'g2zojx7mxdj0'
})

var container = document.getElementById('content');
var containerOrgs = document.getElementById('content-orgs');

var multiRequest = function(_client, _options, callback, _skip, allEntries) {
    if (typeof _skip === 'undefined') { _skip = 0; }
    if (typeof allEntries === 'undefined') { allEntries = []; }
    _options.skip = _skip;
    _client.getEntries(_options)
    .then(function(entries) {
        console.log('Getting entries', _skip, '-', _skip+1000, 'of', entries.total);
        if (entries.items.length > 0) {
            allEntries = allEntries.concat(entries.items);
        } else {
            throw 'No entries found';
        }
        _skip += 1000;
        if (_skip < entries.total) {
            multiRequest(_skip, allEntries);
        } else {
            console.log('done');
            callback(allEntries);
        }
    })
    .catch(console.error)
}

multiRequest(contentfulClient,
  { content_type: 'signature',
  'fields.signingForOrganization[match]' : 'Signing as Individual',
  limit: 1000,
  order: 'fields.fullName' } , render);

multiRequest(contentfulClient,
  { content_type: 'signature',
  'fields.signingForOrganization[match]' : 'Signing on Behalf of Organization',
  limit: 1000,
  order: 'fields.organization' } , renderOrgs);

// contentfulClient.getEntries({
//   content_type: 'signature',
//   'fields.signingForOrganization[match]' : 'Signing as Individual',
//   limit: 1000,
//   order: 'fields.fullName'
// })
// .then(function(entries) {
//   container.innerHTML = render(entries.items)
// })

// contentfulClient.getEntries({
//   content_type: 'signature',
//   'fields.signingForOrganization[match]' : 'Signing on Behalf of Organization',
//   limit: 1000,
//   order: 'fields.organization'
// })
// .then(function(entries) {
//   containerOrgs.innerHTML = renderOrgs(entries.items)
// })

function render(items) {
  var split = Math.ceil(items.length / 3);
  var col1 = items.splice(0, split);
  var col2 = items.splice(0, split);
  container.innerHTML = '<div class="signatures">' +
  '<div class="row"><div class="column small-12 medium-12 large-4">' +
  col1.map(renderSingle).join('\n') +
  '</div><div class="column small-12 medium-12 large-4">' +
  col2.map(renderSingle).join('\n') +
  '</div><div class="column small-12 medium-12 large-4">' +
  items.map(renderSingle).join('\n') +
  '</div></div></div>'
}

function renderSingle(items) {
  var fields = items.fields;
  return '<div class="signatures__signature">' +
  fields.fullName + '<div class="signatures__signature__org">' +
  ((typeof fields.title === 'undefined') ? '' : fields.title + ', ') +
  ((typeof fields.organization === 'undefined') ? '' : (fields.organization)) +
  '</div></div>';
}

function renderOrgs(items) {
  var orgnames = [];
  items.map(function (i) {
    if (!orgnames.includes(i.fields.organization)) {
      orgnames.push(i.fields.organization);
    }
  });
  var split = Math.ceil(orgnames.length / 3);
  var col1 = orgnames.splice(0, split);
  var col2 = orgnames.splice(0, split);
  containerOrgs.innerHTML = '<div class="signatures">' +
  '<div class="row"><div class="column small-12 medium-12 large-4">' +
  col1.map(renderSingleOrg).join('\n') +
  '</div><div class="column small-12 medium-12 large-4">' +
  col2.map(renderSingleOrg).join('\n') +
  '</div><div class="column small-12 medium-12 large-4">' +
  orgnames.map(renderSingleOrg).join('\n') +
  '</div></div></div>'
}

function renderSingleOrg(items) {
  return '<div class="signatures__signature">' +
  items +
  '</div>';
}