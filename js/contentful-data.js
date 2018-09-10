var contentfulClient = contentful.createClient({
  accessToken: '9a8ad725385db3f0ff407604f43fe74e72c7c3154c493c6011494264a7090a49',
  space: 'g2zojx7mxdj0'
})

var container = document.getElementById('content');
var containerOrgs = document.getElementById('content-orgs');

contentfulClient.getEntries({
    content_type: 'signature',
    'fields.signingForOrganization[match]' : 'Signing as Individual',
    order: 'fields.fullName'
  })
  .then(function(entries) {
    container.innerHTML = render(entries.items)
  })

contentfulClient.getEntries({
    content_type: 'signature',
    'fields.signingForOrganization[match]' : 'Signing on Behalf of Organization',
    order: 'fields.organization'
  })
  .then(function(entries) {
    containerOrgs.innerHTML = renderOrgs(entries.items)
  })

function render(items) {
  return '<div class="signatures">' +
    items.map(renderSingle).join('\n') +
    '</div>'
}

function renderSingle(items) {
  var fields = items.fields
  return '<div class="signatures__signature">' +
    fields.fullName +
    '</div>'
}

function renderOrgs(items) {
  var orgnames = [];
  return '<div class="signatures">' +
    items.map(function (i) {
      if (!orgnames.includes(i.fields.organization)) {
        orgnames.push(i.fields.organization);
        return renderSingleOrg(i);
      }
    }).join('\n') +
    '</div>'
}

function renderSingleOrg(items) {
  var fields = items.fields
  return '<div class="signatures__signature">' +
    fields.organization +
    '</div>'
}