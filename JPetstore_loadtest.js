import http from "k6/http";
import { check, group } from "k6";
import { sleep } from "k6";
import { SharedArray } from "k6/data";
import papaparse from "https://jslib.k6.io/papaparse/5.1.1/index.js";
//import encoding from 'k6/encoding';
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";
import { findBetween } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options = {
  stages: [
    { duration: "300s", target: 25 }, // Ramp-up to 100 users in 5 minutes
    { duration: "3100s", target: 25 }, // Stay at 100 users for 55 minutes
    { duration: "200s", target: 0 }, // Ramp-down to 0 users in 2 minutes
  ],
};
// const csvDataParamParam = new SharedArray("Values",function(){
//       return papaparse.parse(open('./testdata.csv'),{header: true}).data
// });

// const csvDataParam = papaparse.parse(open('./testdata.csv', {header:true})).data
// let p_selectedPet = csvDataParam[Math.floor(Math.random() * csvDataParam.length)]['Values']

const csvDataParam = new SharedArray("testdata", function () {
  return papaparse.parse(open("./testdata.csv"), { header: true }).data;
});

var p_pet =
  csvDataParam[Math.floor(Math.random() * csvDataParam.length)]["Values"];
// console.log('p_pet: ' + p_pet)

// csvDataParam.forEach(Values => {
//        console.log('Values: '+ Values)
// });

export default function () {
  let c_fp;
  let corr_sourcePage01;
  let c_jSession_id1;
  let corr_prod;
  let corr_itemid;
  let c_fp2;
  let c_sourcePage02;
  let c_orderId;
  let randomumber =
    Math.floor(Math.random() * 900000000000000) + 100000000000000;
  // Convert to string and insert spaces for formatting
  let cardNumber = randomumber
    .toString()
    .replace(/(\d{3})(\d{4})(\d{4})(\d{4})/, "$1 $2 $3 $4");
  // Stps to generate a random alphanumeric string
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";
  let length = 6;
  for (let i = 0; i < length; i++) {
    randomString =
      randomString + chars.charAt(Math.floor(Math.random() * chars.length));
  }

  const start = new Date().getTime(); // Track when the iteration starts
  const TARGET_ITERATION_DURATION = 10;
  let n = 2;

  group("T01_Launch", function t01_launch() {
    const url = "https://petstore.octoperf.com/";
    let header = {
      headers: {
        "upgrade-insecure-requests": "1",
        "sec-ch-ua":
          '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
      },
    };
    let response = http.get(url, header);
    // console.log("Launch_response: "+ response.body)
    console.log("Launch_response_code: " + response.status);
    check(response, {
      "checking status launch: ": (r) => r.status === 200,
      "checking assertion launch: ": (r) =>
        r.body.includes("Welcome to JPetStore 6"),
    });
    sleep(n);
  });

  group("T02_enterStore", function t02_enterStore() {
    let url = "https://petstore.octoperf.com/actions/Catalog.action";
    let header = {
      headers: {
        "upgrade-insecure-requests": "1",
        "sec-ch-ua":
          '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
      },
    };
    let response = http.get(url, header);
    // console.log('Enter store response: '+ response.body)
    console.log("Enter store response:code " + response.status);

    check(response, {
      "checking enterStore response code: ": (re) => re.status === 200,
      "checking assertion enterStore: ": (r) => r.body.includes("Freshwater"),
    });
    //<a href="/actions/Account.action;jsessionid=C68917EF8226A73836802FA7ACC469EE?signonForm=
    //a href="/actions/Catalog.action;jsessionid=C31686B0ED28B56483097F9905C2308A">
    c_jSession_id1 = findBetween(
      response.body,
      'a href="/actions/Account.action;jsessionid=',
      "?signonForm="
    );
    // let matches = response.body.match(regex)
    // const matchesCount = ( response.body.match(regex) || []).length
    // console.log('matchesCount: '+ matchesCount)

    // let matchList =[]
    // for(const jsessionid of matches){
    //   console.log(match[1]);
    //   matchList.push(jsessionid[1])
    // };
    console.log("jsessionid: " + c_jSession_id1);
    //sleep(3)
  });

  group("T03_ClickonSignin", function t03_clickonSignin() {
    // https://petstore.octoperf.com/actions/Account.action;jsessionid=C31686B0ED28B56483097F9905C2308A?signonForm=
    let jSessionID = c_jSession_id1;
    let url = `https://petstore.octoperf.com/actions/Account.action;jsessionid=${jSessionID}?signonForm=`;
    console.log("T03_ClickonSignin URL: " + url);
    let header = {
      headers: {
        // 'path': `/actions/Account.action;jsessionid=${jSessionID}?signonForm=`,
        Cookie: `JSESSIONID=${jSessionID}`,
        referer: "https://petstore.octoperf.com/actions/Catalog.action",
        "content-type": "application/x-www-form-urlencoded",
        origin: "https://petstore.octoperf.com",
        "upgrade-insecure-requests": "1",
        "sec-ch-ua":
          '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
      },
    };
    let response2 = http.get(url, header);
    // console.log('Click signin response: '+ response2.body)
    console.log("Click signin response:code " + response2.status);

    check(response2, {
      "checking Click signin response code: ": (re) => re.status === 200,
      "checking Click signin enterStore: ": (r) =>
        r.body.includes("Please enter your username and password."),
    });

    //<input type="hidden" name="_sourcePage" value="k9_GXXuoB8Qco6IpcavXacsB5WErIOt9OwOIQrGq2EaEUZWLFwO1ZzbOGPwyCC2VSlhYMOLAJJqi0laFWCpFphADsT4D-zNv57FR_legkps=" />
    //<input type="hidden" name="__fp" value="WxzXzCSpYFHhhr83XunJ2BHGiM6L_O8ztarhb9C02md-b7Ss8eZBa-xX1RTYq9ld" />
    corr_sourcePage01 = response2
      .html()
      .find("input[name=_sourcePage]")
      .attr("value");
    c_fp = response2.html().find("input[name=__fp]").attr("value");

    console.log(" c_sourcePage : " + corr_sourcePage01 + " c_fp: " + c_fp);
    //console.log("Response html: "+ response2.html().find('input[name=_sourcePage]').attr('value'))
    sleep(n);
  });

  group("T04_Login", function t04_login() {
    // console.log(" T03_ClickonSignin.c_sourcePage : ", + T03_ClickonSignin.c_sourcePage + " T03_ClickonSignin.c_fp: "+ T03_ClickonSignin.c_fp)
    let corr_fp1 = c_fp;
    let corr_sourcePage1 = corr_sourcePage01;

    let url = "https://petstore.octoperf.com/actions/Account.action";
    let payload = {
      username: "j2ee",
      password: "j2ee",
      signon: "Login",
      _sourcePage:
        //              'F0CFdf--zTwyK88v9T3SsShSO6XoXHVrA8VkB_SnWEqqxs9V0e4UHmwvXtWoYpxZ7PKV3dleW7K-j9I4A6vkyKCTfSCwxVI5ySd1aEesaVg=',
        corr_sourcePage1,

      // __fp: 'meiMI_RjmbrRrfx8eHRijPw8H8tBAonCJKbi9AtZ9lRgXNKD95wtLTL0aPkKxWga',
      __fp: corr_fp1,
    };

    let headers = {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        origin: "https://petstore.octoperf.com",
        "upgrade-insecure-requests": "1",
        "sec-ch-ua":
          '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
      },
    };
    let response = http.post(url, payload, headers);
    // console.log('login response: '+ response.body)
    console.log("login response:code " + response.status);

    check(response, {
      "checking login response code: ": (re) => re.status === 200,
      "checking login enterStore: ": (r) => r.body.includes("Welcome ABC!"),
    });
    sleep(n);
  });

  group("T05_Select_Pet_category", function t04_selectPet() {
    //const list = ['FISH', 'DOGS','REPTILES','CATS','BIRDS']
    // for (pet of list) {
    //   console.log('pet: '+ pet)
    // }
    //let p_selectedPet= pet

    // for(let category of list){
    //   let random = Math.floor((Math.random()*category.length)+1);
    //   console.log('random: '+ random + 'category.get(random): '+ category.get(random))
    //   let pet = category.get(random)
    //   return pet
    // }
    // for(let i=0; i<list.length(); i++){
    //   pet = list.get(i)
    //   return pet
    let pets = p_pet;
    console.log("Selected pet: " + p_pet);

    let url = `https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=${pets}`;
    console.log("Selected pet url: " + url);

    let headers = {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        origin: "https://petstore.octoperf.com",
        "upgrade-insecure-requests": "1",
        "sec-ch-ua":
          '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
      },
    };

    let response = http.get(url, headers);
    // console.log('T05_selectPet response: '+ response.body)
    let petResponse = response.body;
    //"/actions/Catalog.action?viewProduct=&amp;productId=RP-SN-01">
    // c_productID = findBetween(response.body, '/actions/Catalog.action?viewProduct=&amp;productId=','">')
    // let regex1 = "/actions/Catalog\.action\?viewProduct=&amp;productId=(.*?)"/g
    // <a href="/actions/Catalog.action?viewProduct=&amp;productId=RP-SN-01">
    let regex1 =
      /<a href="\/actions\/Catalog\.action\?viewProduct=&amp;productId=(.*?)">/g;
    let matches = petResponse.matchAll(regex1);
    console.log("matches: " + matches);
    const occurence = (response.body.match(regex1) || []).length;
    console.log("Occurence Count: " + occurence);
    let c_product_Id = [];
    for (const cc_product_Id of matches) {
      // console.log(cc_product_Id[1])
      c_product_Id.push(cc_product_Id[1]);
    }
    corr_prod = c_product_Id[Math.floor(Math.random() * occurence)].toString();

    // var regexp = new RegExp("/actions/Catalog\.action\?viewProduct=&amp;productId=(.*?)").exec(response.body)
    // let prodd = regexp;
    // console.log("regExp: "+ JSON.stringify(regexp) + "prodd: "+ prodd)
    console.log("T05_Select_Pet_category response:code " + response.status);
    console.log("corr_prod: " + corr_prod);

    check(response, {
      "checking T05_Select_Pet_category response code: ": (r1) =>
        r1.status === 200,
      "checking T05_Select_Pet_category enterStore: ": (r1) =>
        r1.body.includes(`${corr_prod}`),
    });
    sleep(n);
  });

  group("T06-Pet_SelectItem", function () {
    // let c_prodID = corr_prod;
    let url = `https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=${corr_prod}`;
    console.log("Pet_SelectItem URL: " + url);
    let head = {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        origin: "https://petstore.octoperf.com",
        "upgrade-insecure-requests": "1",
        "sec-ch-ua":
          '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
      },
    };

    let res = http.get(url, head);
    console.log("T06 Pet_SelectItem response status code: " + res.status);
    //<a href="/actions/Catalog.action?viewItem=&amp;itemId=EST-28">EST-28</a><
    let regexp2 =
      /<a href="\/actions\/Catalog\.action\?viewItem=&amp;itemId=(.*?)">/g;
    let itemID = [];
    let match2 = res.body.matchAll(regexp2);
    let occurence2 = (res.body.match(match2) || []).length;
    for (const c_itemID of match2) {
      console.log(c_itemID[1]);
      itemID.push(c_itemID[1]);
    }
    corr_itemid = itemID[Math.floor(Math.random() * occurence2)].toString();
    console.log("corr_itemid: " + corr_itemid);
    check(res, {
      "checking T06_Pet_SelectItem response code: ": (r2) => r2.status === 200,
      "checking T06_Pet_SelectItem enterStore: ": (r2) =>
        r2.body.includes(`${corr_itemid}`),
    });
    sleep(n);
  });

  group("T07_ViewItem", function () {
    let url = `https://petstore.octoperf.com/actions/Catalog.action?viewItem=&itemId=${corr_itemid}`;
    let headers = {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        origin: "https://petstore.octoperf.com",
        "upgrade-insecure-requests": "1",
        "sec-ch-ua":
          '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
      },
    };
    let response = http.get(url, headers);
    console.log("T07_viewItem response status: " + response.status);
    check(response, {
      "checking T07_viewItem response code: ": (r2) => r2.status === 200,
      "checking T07_viewItem enterStore: ": (r2) =>
        r2.body.includes(`${corr_itemid}`),
    });
    sleep(n);
  });

  group("T08-Click Add to cart", function () {
    let url = `https://petstore.octoperf.com/actions/Cart.action?addItemToCart=&workingItemId=${corr_itemid}`;
    let header = {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        origin: "https://petstore.octoperf.com",
        "upgrade-insecure-requests": "1",
        "sec-ch-ua":
          '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
      },
    };
    let response = http.get(url, header);
    //Proceed to Checkout
    console.log("T08_Click Add to cart response status: " + response.status);
    check(response, {
      "checking T08_Click Add to cart response code: ": (r2) =>
        r2.status === 200,
      "checking T08_Click Add to cart enterStore: ": (r2) =>
        r2.body.includes("Proceed to Checkout"),
    });
    sleep(n);
  });

  group("T09_Proceed_to_checkout", function () {
    let url =
      "https://petstore.octoperf.com/actions/Order.action?newOrderForm=";
    let head2 = {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        origin: "https://petstore.octoperf.com",
        "upgrade-insecure-requests": "1",
        "sec-ch-ua":
          '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
      },
    };
    let response = http.get(url, head2);
    console.log("T09_Proceed_to_checkout response status: " + response.status);
    //<input type="hidden" name="_sourcePage" value="gEEnKeYtAnCn0VIhDwJaTYzqwKL3V5DfTRYnW4lj3HXuabIFgncfhiXQbqJh4DhmLkQ-0sYtpx0f2gv48AFXNqgeEBvE59JZYH-BEa2Z7vE=" /><input type="hidden" name="__fp" value="fVVnIB6kOUBgn54HrdwkgrdD9Pdf6uHGWXMV6O3j5G5mHik6bwQvypoaZHwuXa3U" /></div></form></div>
    let fp = [];
    let sourcepage = [];
    let spregexp3 =
      /\<input type="hidden" name="_sourcePage" value="(.*?)" \/>/g;
    let fpregexp4 = /\<input type="hidden" name="__fp" value="(.*?)" \/>/g;
    let spmatch = response.body.matchAll(spregexp3);
    let fpmatch = response.body.matchAll(fpregexp4);
    let spoccurence = (response.body.match(spmatch) || []).length;
    let fpOccurence = (response.body.match(fpmatch) || []).length;
    for (const sp of spmatch) {
      console.log(sp[1]);
      sourcepage.push(sp[1]);
    }
    c_sourcePage02 = sourcepage[1].toString();
    for (const fpp of fpmatch) {
      console.log(fpp[1]);
      fp.push(fpp[1]);
    }
    c_fp2 = fp[1].toString();
    console.log("c_sourcePage02: " + c_sourcePage02 + ", c_fp2: " + c_fp2);

    check(response, {
      "checking T09_Proceed_to_checkout response code: ": (r3) =>
        r3.status === 200,
      "checking T09_Proceed_to_checkout response text: ": (r3) =>
        r3.body.includes("Payment Details"),
    });
    sleep(n);
  });

  group("T10_EnterDetails_clickonContinue", function () {
    let url = "https://petstore.octoperf.com/actions/Order.action";
    let head3 = {
      headers: {
        // 'Content-Type': 'multipart/form-data',
        "content-type": "application/x-www-form-urlencoded",
        origin: "https://petstore.octoperf.com",
        "upgrade-insecure-requests": "1",
        "sec-ch-ua":
          '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
      },
    };
    let random3 = Math.floor(Math.random() * 999) + 100;
    let zipCode = Math.floor(Math.random() * 99009) + 10000;
    console.log(
      "random3: " +
        random3 +
        " zipCode: " +
        zipCode +
        " Card Number : " +
        cardNumber
    );
    console.log("randomstring: " + randomString);
    let formData = {
      "order.cardType": "Visa",
      "order.creditCard": `${cardNumber}`,
      "order.expiryDate": "12/03",
      "order.billToFirstName": "PERFTEST",
      "order.billToLastName": `${randomString}`,
      "order.billAddress1": `${random3} ${randomString} test Road`,
      "order.billAddress2": `MS UCUP ${random3} ${randomString}`,
      "order.billCity": "Palo Alto",
      "order.billState": "TN",
      "order.billZip": `${zipCode}`,
      "order.billCountry": "INDIA",
      newOrder: "Continue",
      _sourcePage: `${c_sourcePage02}`,
      __fp: `${c_fp2}`,
    };

    let response = http.post(url, formData, head3);
    console.log(
      "T10_EnterDetails_clickonContinue response status code: " +
        response.status
    );
    check(response, {
      "Checking T10_EnterDetails_clickonContinue status code: ": (r4) =>
        r4.status === 200,
      "Checking T10_EnterDetails_clickonContinue text check: ": (r4) =>
        r4.body.includes("confirm"),
    });
    //sleep(3);
  });

  group("T11_ClickonConfirm", function () {
    let url =
      "https://petstore.octoperf.com/actions/Order.action?newOrder=&confirmed=true";
    let headd = {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        origin: "https://petstore.octoperf.com",
        "upgrade-insecure-requests": "1",
        "sec-ch-ua":
          '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
      },
    };

    let cresponse = http.get(url, headd);
    console.log("T11_ClickonCofirm response status code: " + cresponse.status);
    //		<th align="center" colspan="2">Order #510766
    // let prod_order =[]
    // let orderRegex =/<th align="center" colspan="2">Order #[0-9]+\s+2024/g
    // ///<th align="center" colspan="2">Order (.*?)/gm
    // let orderMatch = cresponse.body.matchAll(orderRegex)
    // let orderOccuence = (cresponse.body.match(orderMatch)||[]).length
    // for (const orderValue of orderMatch) {
    //   console.log('order log: '+ orderValue[1]);
    //   // prod_order.push(orderValue[0]);
    //   prod_order.push(orderValue[1]);

    // }
    // c_orderId = prod_order[0] + ""
    // let c_orderId2 = prod_order[1].toString();
    // console.log("ordered successfully, Order ID is: "+ c_orderId)
    // console.log("prod ID : "+ prod_order[0] +", prod_order[1]: "+ prod_order[1])

    check(cresponse, {
      "Checking T11_ClickonCofirm status code: ": (r5) => r5.status === 200,
      "Checking T11_ClickonCofirm text check: ": (r5) =>
        r5.body.includes("Thank you, your order has been submitted."),
    });
    sleep(n);
  });

  // group('T12_Goto_Myaccount', function(){

  //   let url = 'https://petstore.octoperf.com/actions/Account.action?editAccountForm='
  //   let head5 = {headers: {
  //     'content-type': 'application/x-www-form-urlencoded',
  //     origin: 'https://petstore.octoperf.com',
  //     'upgrade-insecure-requests': '1',
  //     'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
  //     'sec-ch-ua-mobile': '?0',
  //     'sec-ch-ua-platform': '"Windows"',
  //   }}

  //   let response = http.get(url,head5)
  //   console.log("T12_Goto_Myaccount response status code: "+ response.status)
  //   check(response,{
  //     "Checking T12_Goto_Myaccount status code: ": (r6) => r6.status===200,
  //     "Checking T12_Goto_Myaccount text check: ": (r6) => r6.body.includes('My Orders'),

  //   });
  //   //sleep(3);

  // })

  // group('T13_Goto_MyOrders', function(){

  //   let url = 'https://petstore.octoperf.com/actions/Order.action?listOrders='
  //   let head6 = {headers: {
  //     'content-type': 'application/x-www-form-urlencoded',
  //     origin: 'https://petstore.octoperf.com',
  //     'upgrade-insecure-requests': '1',
  //     'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
  //     'sec-ch-ua-mobile': '?0',
  //     'sec-ch-ua-platform': '"Windows"',
  //   }}

  //   let response = http.get(url,head6)
  //   console.log("T13_Goto_MyOrders response status code: "+ response.status)
  //   if(response.body.includes(`${c_orderId}`)){
  //     console.log('Order placed successfully! Order Found')
  //   }
  //   else{
  //     console.log('Order Not placed!')

  //   }
  //   check(response,{
  //     "Checking T13_Goto_MyOrders status code: ": (r7) => r7.status===200,
  //     "Checking T13_Goto_MyOrders text check: ": (r7) => r7.body.includes('My Orders'),

  //   });
  //   //sleep(3);

  // })

  group("T12_Signout", function () {
    let url1 = "https://petstore.octoperf.com/actions/Account.action?signoff=";
    let head7 = {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        origin: "https://petstore.octoperf.com",
        "upgrade-insecure-requests": "1",
        "sec-ch-ua":
          '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
      },
    };

    let url2 = "https://petstore.octoperf.com/actions/Catalog.action";
    let head8 = {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        origin: "https://petstore.octoperf.com",
        "upgrade-insecure-requests": "1",
        "sec-ch-ua":
          '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
      },
    };

    let responses = http.batch([
      ["GET", url1, null, head7], // API 1 (signoff)
      ["GET", url2, null, head8],
    ]); // API 2 (catalog)
    console.log("Logout response status : " + responses[1].status);
    check(responses[1], {
      "Checking T12_Signout status code: ": (r8) => r8.status === 200,
      "Checking T12_Signout text check: ": (r8) => r8.body.includes("Sign In"),
    });
    sleep(n);
    console.log("Start time: " + start);
    const end = new Date().getTime(); // Track when the iteration ends
    const iterationDuration = (end - start) / 1000; // Convert to seconds
    console.log("iterationDuration: " + iterationDuration);
    console.log("End time: " + end);

    // Calculate the //sleep time needed to maintain the pacing
    const pacingTime = 12;
    console.log("pacingTime: " + pacingTime);

    if (pacingTime > 0) {
      sleep(pacingTime); // //sleep to maintain the pacing if iteration was faster
    }
  });
}
export function handleSummary(data) {
  return {
    "pet_loadtest3_oct24_2024.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
