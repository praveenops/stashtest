var dataLayer = window.dataLayer = window.dataLayer || [];
var iondataLayerVars = {ionUserId: '', ionOrganizationName: '', ionEmailId: ''};

function dataLayerPushEvent(event, category, action, label, value) {
    dataLayer.push({
        'event': event,
        'category': category,
        'action': action,
        'label': label,
        'value': value
     });
}

function dataLayerPushPageview(url) {
    dataLayer.push({
        'event': 'content-view',
        'userId': iondataLayerVars.ionUserId,
        'organizationName': iondataLayerVars.ionOrganizationName,
        'emailId': iondataLayerVars.ionEmailId,
        'content-name': url
     });    
}

function dataLayerPush(user, org, email) {
    iondataLayerVars.ionUserId = user;
    iondataLayerVars.ionOrganizationName = org;
    iondataLayerVars.ionEmailId = email;
    dataLayer.push({
        'userId': iondataLayerVars.ionUserId,
        'organizationName': iondataLayerVars.ionOrganizationName,
        'emailId': iondataLayerVars.ionEmailId
     });
     // console.log(dataLayer);
}

function gtm(gtmEnv) {
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl+ gtmEnv +'&gtm_cookies_win=x';f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-N832R35');
}