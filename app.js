import fs from 'fs';
import notify from './helpers/notify.js';
import immoweb from './immosites/immoweb.js';
import immoscoop from './immosites/immoscoop.js';
import zimmo from './immosites/zimmo.js';
// import immovlan from './immosites/immovlan.js';
import notaris from './immosites/notaris.js';
import morelAndCo from './immosites/morelAndCo.js';

const MINUTES = 10;
const TIMEOUT = 1000 * 60 * MINUTES;

const MIN_PRICE = 200000;
const MAX_PRICE = 500000;

const sites = [
  // {
  //   name: 'immovlan',
  //   curl: `curl 'https://immo.vlan.be/nl/vastgoed?transactiontypes=te-koop,in-openbare-verkoop&propertytypes=huis&towns=2000-antwerpen,2018-antwerpen,2600-berchem&minprice=${MIN_PRICE}&maxprice=${MAX_PRICE}&noindex=1' -H 'authority: immo.vlan.be' -H 'pragma: no-cache' -H 'cache-control: no-cache' -H 'upgrade-insecure-requests: 1' -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36' -H 'dnt: 1' -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3' -H 'referer: https://immo.vlan.be/nl/vastgoed?transactiontypes=te-koop,in-openbare-verkoop&propertytypes=huis&towns=2000-antwerpen,2018-antwerpen,2600-berchem&minprice=200000&maxprice=500000&noindex=1' -H 'accept-encoding: gzip, deflate, br' -H 'accept-language: en-GB,en;q=0.9,en-US;q=0.8,nl;q=0.7,la;q=0.6' -H 'cookie: _gcl_au=1.1.1311141044.1555339501; __gfp_64b=Cq3WKT9976gUctI0QRfto7BGFbDjRTTRSc.DF0eeqBn.67; _ga=GA1.3.1468030448.1555339501; _gid=GA1.3.374642184.1555339501; _fbp=fb.1.1555339500807.782078662; ASP.NET_SessionId=vh0nxwo02rkyshilefvrxsdy; lang=nl; __RequestVerificationToken=oltDP3MXIIJLtmbuC36UHBL2VuVKqs6GoW4pd5AGx9QBiWuTZD-phEsLu9ZSl8pHp213FTWKziGelfxMtlbZJdPmsLg1; ConsentFacebook=1; ConsentDfp=1; ConsentCriteo=1; ConsentTrackuity=1; ConsentCXense=1; __ssds=2; cto_lwid=e1fecf47-8209-4cb0-ac6c-3079d25cdfd1; __ssuzjsr2=a9be0cd8e; __uzmaj2=6d5347d0-8fd8-48b7-bccd-af0754f0d22b; __uzmbj2=1555339503; cX_S=juigzechm0e8eeb0; cX_P=juigzeckvy5j80p2; _tty=2147424599268695630; cX_G=cx%3A3mj25k3rrku241ifhcojq1oiju%3Am58y41axbwxa; __gads=ID=3c202a9c24f0aa74:T=1555339505:S=ALNI_Maqby_xxkc32rf8-pcjrV2_7OkB8Q; __uzma=fc513a6b-fda6-4b4d-871b-7f1c32520737; __uzmb=1555339526; __uzmcj2=428111330940; __uzmdj2=1555339533; __uzmc=899131325112; __uzmd=1555339528; _gali=searchpage_8' --compressed`,
  //   script: immovlan,
  // },
  {
    name: 'immoweb 2000',
    curl: "curl 'https://www.immoweb.be/nl/zoek/huis/te-koop/antwerpen/2000?xorderby1=datemodification' -H 'Connection: keep-alive' -H 'Pragma: no-cache' -H 'Cache-Control: no-cache' -H 'Upgrade-Insecure-Requests: 1' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36' -H 'DNT: 1' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: en-GB,en;q=0.9,en-US;q=0.8,nl;q=0.7,la;q=0.6' --compressed",
    curl_with_cookie: "curl 'https://www.immoweb.be/nl/zoek/huis/te-koop/antwerpen/2000?xorderby1=datemodification' -H 'Connection: keep-alive' -H 'Pragma: no-cache' -H 'Cache-Control: no-cache' -H 'Upgrade-Insecure-Requests: 1' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36' -H 'DNT: 1' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: en-GB,en;q=0.9,en-US;q=0.8,nl;q=0.7,la;q=0.6' -H 'Cookie: BIMvisited=yes; visid_incap_150286=zCbW0LW8QJa35JQTQkry8NZDq1wAAAAAQUIPAAAAAACODjFcPTt9Urz30Mrh8Z14; LANGUAGE=nl; IWEBCHECK=Y; __utmz=118884753.1554727896.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); _tty=16388971841733158645; _ga=GA1.2.317348327.1554727896; _gid=GA1.2.1234275751.1554727896; __gfp_64b=KAmBiEpW7kokfwNX698X0ZQ6RgzEyvCawMF8Syp3d_j.p7; _fbp=fb.1.1554727896005.1433691090; cto_lwid=7d5605e5-5503-46d5-aead-efe5d17f1a24; cX_P=ju8fwhe4u7oj7sef; cX_G=cx%3A3mj25k3rrku241ifhcojq1oiju%3Am58y41axbwxa; imbvpjs-sov-adbanner=0; imbvpjs-sov-admax=0; __gads=ID=3e639dc7cefe3c91:T=1554733028:S=ALNI_MaF0NE5dKYKE7-5_UCpGEfgtHdcsQ; LASTSEARCHTRANSACTIONTYPE=1; imbvpjs-sov-adfocus=0; COOKIEVISIBILITY=1%2CB%2C1%2C2000%2CN; ddsg=8luwh78lh1sb.8luwh78lh1se.8m5xx8z0a7kg.8m5zksody5vj.8mh2o9kxumlx.8mscmrs61znb; CKTYPEBIENVISITE=0117%3D2018%2F1%3B0118%3D2000%2F1; imbvpjs-sov-adimsxl=0; ADVERTISINGTAGSERVEUR=1%2C4%2C1%2C000000%2C9%2C73%2CG%2C1%2C4%2CE%2CAX%2C1%2C000000%2C000000%2CAGE%2C2000%2C3055336%2C000000%2C000000%2Cbuy%2C1026%2C000000%2C000000%2C2%2Cfalse; CFID=160154067; CFTOKEN=52801300; imbvpjs-dataprovider-params=?nl&mainType=HOUSE&postalCode=2000&abroad=false&prestige=false&holiday=false&investmentProperty=false&transactionType=BUY; JSESSIONID=1775910B9A75533D038EFE4DC03D7DA6.cfusion; CKVISITCOUNT=8; CKVISITDATELAST=201904100934; CKSECTIONQUERYDATA=buy; ONGLETIDCLIENT=0; NPI=22%2CParVisit%2CP%2C08%2D04%2D2019%2C16; Kemp-test=206274197.53596.707308552.1660826624; incap_ses_767_150286=M7ZQITgYm0Os0n7sN++kCp6crVwAAAAAaHHdvb3boKuaUntfFUQA9w==; __utma=118884753.317348327.1554727896.1554827614.1554881696.17; __utmc=118884753; __utmt=1; __utmb=118884753.1.10.1554881696; _gat_UA-1469439-1=1; imbvpjs-sov-adside=2; cX_S=juawf0ns5pwekje7; euconsent=BOesW7iOeyB5ZABABAENCN-AAAAmd7_______9______5uz_Ov_v_f__33e8__9v_l_7_-___u_-3zd4-_1vf99yfm1-7etr3tp_87ues2_Xur__59__3z3_9phPrsk89ryw' --compressed",
    minPrice: MIN_PRICE,
    maxPrice: MAX_PRICE,
    script: immoweb,
  },
  {
    name: 'immoweb 2018',
    curl: "curl 'https://www.immoweb.be/nl/zoek/huis/te-koop/antwerpen/2018?xorderby1=datemodification' -H 'Connection: keep-alive' -H 'Pragma: no-cache' -H 'Cache-Control: no-cache' -H 'Upgrade-Insecure-Requests: 1' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36' -H 'DNT: 1' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: en-GB,en;q=0.9,en-US;q=0.8,nl;q=0.7,la;q=0.6' --compressed",
    curl_with_cookie: "curl 'https://www.immoweb.be/nl/zoek/huis/te-koop/antwerpen/2018?xorderby1=datemodification' -H 'Connection: keep-alive' -H 'Pragma: no-cache' -H 'Cache-Control: no-cache' -H 'Upgrade-Insecure-Requests: 1' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36' -H 'DNT: 1' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: en-GB,en;q=0.9,en-US;q=0.8,nl;q=0.7,la;q=0.6' -H 'Cookie: BIMvisited=yes; visid_incap_150286=zCbW0LW8QJa35JQTQkry8NZDq1wAAAAAQUIPAAAAAACODjFcPTt9Urz30Mrh8Z14; LANGUAGE=nl; IWEBCHECK=Y; __utmz=118884753.1554727896.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); _tty=16388971841733158645; _ga=GA1.2.317348327.1554727896; _gid=GA1.2.1234275751.1554727896; __gfp_64b=KAmBiEpW7kokfwNX698X0ZQ6RgzEyvCawMF8Syp3d_j.p7; _fbp=fb.1.1554727896005.1433691090; cto_lwid=7d5605e5-5503-46d5-aead-efe5d17f1a24; cX_P=ju8fwhe4u7oj7sef; cX_G=cx%3A3mj25k3rrku241ifhcojq1oiju%3Am58y41axbwxa; imbvpjs-sov-adbanner=0; imbvpjs-sov-admax=0; __gads=ID=3e639dc7cefe3c91:T=1554733028:S=ALNI_MaF0NE5dKYKE7-5_UCpGEfgtHdcsQ; LASTSEARCHTRANSACTIONTYPE=1; imbvpjs-sov-adfocus=0; COOKIEVISIBILITY=1%2CB%2C1%2C2000%2CN; ddsg=8luwh78lh1sb.8luwh78lh1se.8m5xx8z0a7kg.8m5zksody5vj.8mh2o9kxumlx.8mscmrs61znb; CKTYPEBIENVISITE=0117%3D2018%2F1%3B0118%3D2000%2F1; imbvpjs-sov-adimsxl=0; ADVERTISINGTAGSERVEUR=1%2C4%2C1%2C000000%2C9%2C73%2CG%2C1%2C4%2CE%2CAX%2C1%2C000000%2C000000%2CAGE%2C2000%2C3055336%2C000000%2C000000%2Cbuy%2C1026%2C000000%2C000000%2C2%2Cfalse; CFID=160154067; CFTOKEN=52801300; imbvpjs-dataprovider-params=?nl&mainType=HOUSE&postalCode=2000&abroad=false&prestige=false&holiday=false&investmentProperty=false&transactionType=BUY; JSESSIONID=1775910B9A75533D038EFE4DC03D7DA6.cfusion; CKVISITCOUNT=8; CKVISITDATELAST=201904100934; CKSECTIONQUERYDATA=buy; ONGLETIDCLIENT=0; NPI=22%2CParVisit%2CP%2C08%2D04%2D2019%2C16; Kemp-test=206274197.53596.707308552.1660826624; incap_ses_767_150286=M7ZQITgYm0Os0n7sN++kCp6crVwAAAAAaHHdvb3boKuaUntfFUQA9w==; __utma=118884753.317348327.1554727896.1554827614.1554881696.17; __utmc=118884753; __utmt=1; __utmb=118884753.1.10.1554881696; _gat_UA-1469439-1=1; imbvpjs-sov-adside=2; cX_S=juawf0ns5pwekje7; euconsent=BOesW7iOeyB5ZABABAENCN-AAAAmd7_______9______5uz_Ov_v_f__33e8__9v_l_7_-___u_-3zd4-_1vf99yfm1-7etr3tp_87ues2_Xur__59__3z3_9phPrsk89ryw' --compressed",
    minPrice: MIN_PRICE,
    maxPrice: MAX_PRICE,
    script: immoweb,
  },
  {
    name: 'immoweb 2600',
    curl: "curl 'https://www.immoweb.be/nl/zoek/huis/te-koop/berchem/2600?xorderby1=datemodification' -H 'Connection: keep-alive' -H 'Pragma: no-cache' -H 'Cache-Control: no-cache' -H 'Upgrade-Insecure-Requests: 1' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36' -H 'DNT: 1' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: en-GB,en;q=0.9,en-US;q=0.8,nl;q=0.7,la;q=0.6' --compressed",
    curl_with_cookie: "curl 'https://www.immoweb.be/nl/zoek/huis/te-koop/berchem/2600?xorderby1=datemodification' -H 'Connection: keep-alive' -H 'Pragma: no-cache' -H 'Cache-Control: no-cache' -H 'Upgrade-Insecure-Requests: 1' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36' -H 'DNT: 1' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: en-GB,en;q=0.9,en-US;q=0.8,nl;q=0.7,la;q=0.6' -H 'Cookie: BIMvisited=yes; visid_incap_150286=zCbW0LW8QJa35JQTQkry8NZDq1wAAAAAQUIPAAAAAACODjFcPTt9Urz30Mrh8Z14; LANGUAGE=nl; IWEBCHECK=Y; __utmz=118884753.1554727896.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); _tty=16388971841733158645; _ga=GA1.2.317348327.1554727896; _gid=GA1.2.1234275751.1554727896; __gfp_64b=KAmBiEpW7kokfwNX698X0ZQ6RgzEyvCawMF8Syp3d_j.p7; _fbp=fb.1.1554727896005.1433691090; cto_lwid=7d5605e5-5503-46d5-aead-efe5d17f1a24; cX_P=ju8fwhe4u7oj7sef; cX_G=cx%3A3mj25k3rrku241ifhcojq1oiju%3Am58y41axbwxa; imbvpjs-sov-adbanner=0; imbvpjs-sov-admax=0; __gads=ID=3e639dc7cefe3c91:T=1554733028:S=ALNI_MaF0NE5dKYKE7-5_UCpGEfgtHdcsQ; LASTSEARCHTRANSACTIONTYPE=1; imbvpjs-sov-adfocus=0; COOKIEVISIBILITY=1%2CB%2C1%2C2000%2CN; ddsg=8luwh78lh1sb.8luwh78lh1se.8m5xx8z0a7kg.8m5zksody5vj.8mh2o9kxumlx.8mscmrs61znb; CKTYPEBIENVISITE=0117%3D2018%2F1%3B0118%3D2000%2F1; imbvpjs-sov-adimsxl=0; ADVERTISINGTAGSERVEUR=1%2C4%2C1%2C000000%2C9%2C73%2CG%2C1%2C4%2CE%2CAX%2C1%2C000000%2C000000%2CAGE%2C2000%2C3055336%2C000000%2C000000%2Cbuy%2C1026%2C000000%2C000000%2C2%2Cfalse; CFID=160154067; CFTOKEN=52801300; imbvpjs-dataprovider-params=?nl&mainType=HOUSE&postalCode=2000&abroad=false&prestige=false&holiday=false&investmentProperty=false&transactionType=BUY; JSESSIONID=1775910B9A75533D038EFE4DC03D7DA6.cfusion; CKVISITCOUNT=8; CKVISITDATELAST=201904100934; CKSECTIONQUERYDATA=buy; ONGLETIDCLIENT=0; NPI=22%2CParVisit%2CP%2C08%2D04%2D2019%2C16; Kemp-test=206274197.53596.707308552.1660826624; incap_ses_767_150286=M7ZQITgYm0Os0n7sN++kCp6crVwAAAAAaHHdvb3boKuaUntfFUQA9w==; __utma=118884753.317348327.1554727896.1554827614.1554881696.17; __utmc=118884753; __utmt=1; __utmb=118884753.1.10.1554881696; _gat_UA-1469439-1=1; imbvpjs-sov-adside=2; cX_S=juawf0ns5pwekje7; euconsent=BOesW7iOeyB5ZABABAENCN-AAAAmd7_______9______5uz_Ov_v_f__33e8__9v_l_7_-___u_-3zd4-_1vf99yfm1-7etr3tp_87ues2_Xur__59__3z3_9phPrsk89ryw' --compressed",
    minPrice: MIN_PRICE,
    maxPrice: MAX_PRICE,
    script: immoweb,
  },
  {
    name: 'immoscoop',
    curl: `curl 'https://www.immoscoop.be/immo.php?distance=&livingareacondition=&livingarea=&plotareacondition=&plotarea=&yearcondition=&year=&bedroom=&category=woning&order=date&newproject=&streetname=&min_price=${MIN_PRICE}&max_price=${MAX_PRICE}&search_field=260&order=date&proptype=Sale&s_postcode%5B%5D=57&s_postcode%5B%5D=56&s_postcode%5B%5D=158&ipp=10' -H 'authority: www.immoscoop.be' -H 'pragma: no-cache' -H 'cache-control: no-cache' -H 'upgrade-insecure-requests: 1' -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36' -H 'dnt: 1' -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3' -H 'accept-encoding: gzip, deflate, br' -H 'accept-language: en-GB,en;q=0.9,en-US;q=0.8,nl;q=0.7,la;q=0.6' --compressed`,
    curl_with_cookie: `curl 'https://www.immoscoop.be/immo.php?distance=&livingareacondition=&livingarea=&plotareacondition=&plotarea=&yearcondition=&year=&bedroom=&category=woning&order=date&newproject=&streetname=&min_price=${MIN_PRICE}&max_price=${MAX_PRICE}&search_field=260&order=date&proptype=Sale&s_postcode%5B%5D=57&s_postcode%5B%5D=56&s_postcode%5B%5D=158&ipp=10' -H 'authority: www.immoscoop.be' -H 'pragma: no-cache' -H 'cache-control: no-cache' -H 'upgrade-insecure-requests: 1' -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36' -H 'dnt: 1' -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3' -H 'accept-encoding: gzip, deflate, br' -H 'accept-language: en-GB,en;q=0.9,en-US;q=0.8,nl;q=0.7,la;q=0.6' -H 'cookie: _ga=GA1.2.1079711794.1553845648; _tty=1661984448309633836; _gid=GA1.2.849504561.1554705658; PHPSESSID=245262s83j9a2696056vq33ffo; immoscoop_last_search_keyword=NTcsNTYsMTU4LCBUZSBLb29wLCBXb25pbmcsICZldXJvOzIwMDAwMCAtICZldXJvOzUwMDAwMA%3D%3D; immoscoop_map=aHR0cHM6Ly93d3cuaW1tb3Njb29wLmJlL2ltbW9rYWFydDIucGhwP3NfcG9zdGNvZGU9NTcsNTYsMTU4JnR5cGU9U2FsZSZjYXRlZ29yeT13b25pbmcmbWluX3ByaWNlPTIwMDAwMCZtYXhfcHJpY2U9NTAwMDAwJm9yZGVyPWRhdGUmaXBwPTEwJnVybD0%3D; immoscoop_last_search=P3NfcG9zdGNvZGU9NTcsNTYsMTU4JnByb3B0eXBlPVNhbGUmY2F0ZWdvcnk9d29uaW5nJm1pbl9wcmljZT0yMDAwMDAmbWF4X3ByaWNlPTUwMDAwMCZvcmRlcj1kYXRl; immoscoop_backto_search=P3NfcG9zdGNvZGU9NTcsNTYsMTU4JnByb3B0eXBlPVNhbGUmY2F0ZWdvcnk9d29uaW5nJm9yZGVyPWRhdGUmaXBwPTEw; AWSELB=7D35E5FB1693BF216E0568A66B43740BA402D0F263C03D532847D6F46F5D3413020B3F08765D3AA578C4199FF1F3E8BB3C7B740DAC28050C641E6746E53D8A6C2C2BE3EBEC; _gat_gtag_UA_73426272_1=1' --compressed`,
    minPrice: MIN_PRICE,
    maxPrice: MAX_PRICE,
    script: immoscoop,
  },
  {
    name: 'zimmo',
    curl: `curl 'https://www.zimmo.be/nl/panden/?status=1&type%5B0%5D=5&hash=6dc1c496874d84d9b628364c28126cf4&priceMin=${MIN_PRICE}&priceMax=${MAX_PRICE}&priceIncludeUnknown=1&priceChangedOnly=0&bedroomsIncludeUnknown=1&bathroomsIncludeUnknown=1&constructionIncludeUnknown=1&livingAreaIncludeUnknown=1&landAreaIncludeUnknown=1&commercialAreaIncludeUnknown=1&yearOfConstructionIncludeUnknown=1&epcIncludeUnknown=1&queryCondition=and&includeNoPhotos=1&includeNoAddress=1&onlyRecent=0&onlyRecentlyUpdated=0&isPlus=0&region=list&city=MzAYBQMGDA1ReAA%253D&sort=recent&sort_order=desc' -H 'Connection: keep-alive' -H 'Pragma: no-cache' -H 'Cache-Control: no-cache' -H 'Upgrade-Insecure-Requests: 1' -H 'DNT: 1' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3' -H 'Referer: https://www.zimmo.be/nl/panden/?status=1&type%5B0%5D=5&hash=e6e19d0d25cfe95d9bef47f507398210&priceMin=200000&priceMax=500000&priceIncludeUnknown=1&priceChangedOnly=0&bedroomsIncludeUnknown=1&bathroomsIncludeUnknown=1&constructionIncludeUnknown=1&livingAreaIncludeUnknown=1&landAreaIncludeUnknown=1&commercialAreaIncludeUnknown=1&yearOfConstructionIncludeUnknown=1&epcIncludeUnknown=1&queryCondition=and&includeNoPhotos=1&includeNoAddress=1&onlyRecent=0&onlyRecentlyUpdated=0&isPlus=0&region=list&city=MzAYBQMGDA1ReAA%253D' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: en-GB,en;q=0.9,en-US;q=0.8,nl;q=0.7,la;q=0.6' -H 'Cookie: Locale=nl; enr_cxense_throttle=throttle; _ga=GA1.2.383469307.1555083961; __io_r=google.com; __io_first_source=google.com; __io_lv=1555083961592; __io=fd04b3191.f55714c35_1555083961593; __io_unique_42905=12; __gfp_64b=kkUshioQhWPu81O2rhNi7526ykA7.CImaXVuum4fsm3.N7; __gads=ID=08e80f69b04328a1:T=1555083962:S=ALNI_MYXMyXZn3q9kBQ7MVMMHENCCQl5Eg; c_05={"type":"CONSENT","version":1,"language":"nl","source":"https://www.zimmo.be/blog/2016/10/27/bieden-op-een-huis-dit-moet-je-weten/","value":true,"platform":"WEB","id":"54c19f9a-b549-4969-a005-c551ef52cf5f"}; evid_0056=4ee8c682-5122-44c7-8249-84806364f0c5; cX_P=jue92cr7gqyq82jx; cX_G=cx%3A3mj25k3rrku241ifhcojq1oiju%3Am58y41axbwxa; __uzma=5cb491d12ee8a0.55949272; __uzmb=1555337681; ci_session=BWUEaAEyBTlbclNyAWhUZAczAWlVIlB3VjUOJVQlVmkDPAluUAsGbAVgB3MBPQB1VT0DYgdmAjkFI1ViUTQAY1A3CjENOVRgBWVUaFJvADAFNwRgAWMFNVttUzABZ1QzBzsBMFVlUDZWYQ4yVG9WYgNlCTJQZAYwBTIHcwE9AHVVPQNgB2QCOQUjVW5RdAALUDcKNg1rVHAFMFQuUiUAIQU%2FBCEBPAUyWzlTOwFwVGYHNgFlVTRQPFZjDmZUYVYyA2sJIlBvBnYFPgdgATYAPFUlAyQHJwJmBXNVWFFlADNQMwo8DXtUIAVuVC5SbAA2BTQEaAEkBU5bZlN7ATtUOQdvATJVL1AxVn4OZlR2VigDHglhUDcGbAVqByUBaQB1VW8Dagd0AkoFb1VzUWEAOFB2Ch8NblRhBXVUElIFACMFXARyATcFM1tWUzABZlQKBzYBelUgUEVWIA50VG1WcwNpCTFQZwY%2FBSYHPQFnAHVVcwMOBzUCYAV1VW5RcgA9UCIKKw0tVDkFJlRnUmcAMwU%2BBHABNwU2WzxTNAFhVGYHNAFlVThQNVZyDm1UKw%3D%3D; ab_testing=active; __ssds=2; __ssuzjsr2=a9be0cd8e; __uzmaj2=b09f32ae-50c9-462f-a505-70a6ea9aa79b; __uzmbj2=1555337681; _gid=GA1.2.2095102246.1555337682; Locale=nl; _tty=32092871716106831; cto_lwid=f7f7a2a3-f543-4589-a003-19a8e82d4af3; _fbp=fb.1.1555337685139.1974626142; cX_S=juifwek947xbigaz; evid_set_0056=2; adptset_0056=1; enr_cint_sent=1; zimmo_cp_last_search=%7B%22status%22%3A%221%22%2C%22id%22%3A%22382%22%2C%22pc%22%3A%222000%22%2C%22type%22%3A%225%22%7D; __uzmcj2=564071640965; __uzmdj2=1555337738; __uzmc=416742525683; __uzmd=1555337739; cstp=604800' --compressed`,
    script: zimmo,
  },
  {
    name: 'notaris.be',
    url: 'https://immo.notaris.be/immoplatform-public-service_v1/api/properties?location=51.2037695_4.411263700000063_10&priceMax=500000&priceMin=100000&propertyType=HOUSE&superSType=SALE',
    script: notaris,
  },
  {
    name: 'Morel&Co',
    url: 'https://www.immo-morelandco.com/tekoop',
    script: morelAndCo,
    maxPrice: MAX_PRICE,
  },
];

let withCookie = true;

const scrape = async () => {
  const file = JSON.parse(fs.readFileSync('./data/immoscraper.json', 'utf8'));
  withCookie = !withCookie;
  await sites.reduce(async (prev, site) => {
    const result = await prev;
    const { script, ...rest } = site;
    let newResults = (await script(Object.assign(rest, { withCookie })));
    if (Array.isArray(newResults)) {
      newResults = newResults.filter(siteResult => !file.find(item => item.id === siteResult.id));
      newResults.forEach((newResult) => {
        console.log(JSON.stringify(newResult.msg, null, 2));
        notify(newResult.msg);
        file.push(newResult);
      });
      return [...result, ...newResults];
    }
    if (newResults instanceof Error) {
      notify({
        text: `Error for ${site.name}`,
        attachment: {
          color: 'danger',
          text: newResults.message,
        },
      });
    }
    return result;
  }, Promise.resolve([]));
  fs.writeFileSync('./data/immoscraper.json', JSON.stringify(file, null, 2), 'utf8');
  console.log(`NEXT RUN: ${(new Date((new Date()).getTime() + TIMEOUT)).toTimeString()}`);
  console.log(' ');
  setTimeout(scrape, TIMEOUT);
};

scrape();
