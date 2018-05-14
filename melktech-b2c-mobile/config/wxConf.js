/**
 * http://usejsdoc.org/

 */
'use strict';
function wxConf(){};

//  获取token grant_type
wxConf.getTokenGrantType="client_credential";
//  获取openid grant_type
wxConf.userInfoGrantType="authorization_code";
//  appId
// wxConf.appId="wx6844940cd71c6d78";
//  secret
// wxConf.secret="44a3fd8de54f3f4655309c98a353d45f";

module.exports = wxConf;