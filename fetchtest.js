import { exec } from 'child_process';

const curl = `curl 'https://www.immoweb.be/nl/zoek/huis/te-koop/antwerpen/2000?xorderby1=datemodification' -H 'Connection: keep-alive' -H 'Pragma: no-cache' -H 'Cache-Control: no-cache' -H 'Upgrade-Insecure-Requests: 1' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36' -H 'DNT: 1' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: en-GB,en;q=0.9,en-US;q=0.8,nl;q=0.7,la;q=0.6' --compressed`;
  // -H 'Cookie: BIMvisited=yes; visid_incap_150286=zCbW0LW8QJa35JQTQkry8NZDq1wAAAAAQUIPAAAAAACODjFcPTt9Urz30Mrh8Z14; LANGUAGE=nl; IWEBCHECK=Y; __utmz=118884753.1554727896.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); _tty=16388971841733158645; _ga=GA1.2.317348327.1554727896; _gid=GA1.2.1234275751.1554727896; __gfp_64b=KAmBiEpW7kokfwNX698X0ZQ6RgzEyvCawMF8Syp3d_j.p7; _fbp=fb.1.1554727896005.1433691090; cto_lwid=7d5605e5-5503-46d5-aead-efe5d17f1a24; cX_P=ju8fwhe4u7oj7sef; cX_G=cx%3A3mj25k3rrku241ifhcojq1oiju%3Am58y41axbwxa; imbvpjs-sov-adbanner=0; imbvpjs-sov-admax=0; __gads=ID=3e639dc7cefe3c91:T=1554733028:S=ALNI_MaF0NE5dKYKE7-5_UCpGEfgtHdcsQ; LASTSEARCHTRANSACTIONTYPE=1; imbvpjs-sov-adfocus=0; COOKIEVISIBILITY=1%2CB%2C1%2C2000%2CN; ddsg=8luwh78lh1sb.8luwh78lh1se.8m5xx8z0a7kg.8m5zksody5vj.8mh2o9kxumlx.8mscmrs61znb; CKTYPEBIENVISITE=0117%3D2018%2F1%3B0118%3D2000%2F1; imbvpjs-sov-adimsxl=0; ADVERTISINGTAGSERVEUR=1%2C4%2C1%2C000000%2C9%2C73%2CG%2C1%2C4%2CE%2CAX%2C1%2C000000%2C000000%2CAGE%2C2000%2C3055336%2C000000%2C000000%2Cbuy%2C1026%2C000000%2C000000%2C2%2Cfalse; CFID=160154067; CFTOKEN=52801300; imbvpjs-dataprovider-params=?nl&mainType=HOUSE&postalCode=2000&abroad=false&prestige=false&holiday=false&investmentProperty=false&transactionType=BUY; JSESSIONID=1775910B9A75533D038EFE4DC03D7DA6.cfusion; CKVISITCOUNT=8; CKVISITDATELAST=201904100934; CKSECTIONQUERYDATA=buy; ONGLETIDCLIENT=0; NPI=22%2CParVisit%2CP%2C08%2D04%2D2019%2C16; Kemp-test=206274197.53596.707308552.1660826624; incap_ses_767_150286=M7ZQITgYm0Os0n7sN++kCp6crVwAAAAAaHHdvb3boKuaUntfFUQA9w==; __utma=118884753.317348327.1554727896.1554827614.1554881696.17; __utmc=118884753; __utmt=1; __utmb=118884753.1.10.1554881696; _gat_UA-1469439-1=1; imbvpjs-sov-adside=2; cX_S=juawf0ns5pwekje7; euconsent=BOesW7iOeyB5ZABABAENCN-AAAAmd7_______9______5uz_Ov_v_f__33e8__9v_l_7_-___u_-3zd4-_1vf99yfm1-7etr3tp_87ues2_Xur__59__3z3_9phPrsk89ryw'
  
const fetch = () => {
  exec(curl, (err, stdout, stderr) => {
    console.log('***** err ******');
    console.log(err);
    console.log('***** stdout ******');
    // console.log(stdout);
    console.log('***** stderr ******');
    console.log(stderr);
  });
};

fetch();
