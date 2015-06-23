/*
    모듈 로딩
*/
var system = require('system');
var page = require('webpage').create();

/*
    변수 선언
*/
//userAgent 설정
var userAgent = 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/534.7 (KHTML, like Gecko) Chrome/7.0.517.44 Safari/534.7';
//리소스 제한시간 10초
var resourceTimeout = 10000;
//리소스 다운로드 시도 횟수
var resourceRequestAttempts = 5;
//리로스 다운로드 여부 체크 간격
var resourceCheckDuration = 3000;
//컨텐츠 길이
var contentLength = undefined;
//컨텐츠 리소스
var resources = {};

/*
    페이지 세팅
*/
page.settings.userAgent = userAgent
page.settings.resourceTimeout = resourceTimeout;


var documentReadyCheck = function () {
    //현재 페이지 컨텐츠 길이
    var currentLength = page.content.length;

    //더이상 변경이 없으면, 결과 출력
    if (currentLength === contentLength && !Object.keys(resources).length) {
        window.setTimeout(function () {
            console.log(page.content);
            phantom.exit(0);
        }, 1000);
    }
    //변경이 있으면 resourceCheckDuration 뒤에 다시 체크
    else {
        contentLength = currentLength;
        Object.keys(resources).forEach(function (item, index, array) {
            if (++resources[item] > resourceRequestAttempts) {
                delete resources[item];
            }
        });

        window.setTimeout(documentReadyCheck, resourceCheckDuration);
    }
};

//리소스가 요청되면 목록화
page.onResourceRequested = function (request) {
    resources[request.id] = 1;
};

//리소스 로드가 완료되면 목록에서 제거
page.onResourceReceived = function (response) {
    if (response.stage == 'end') {
        delete resources[response.id];
    }
};
//리소스 로드가 실패하면 목록에서 제거
page.onResourceTimeout = function (request) {
    delete resources[request.id];
};

//페이지가 리페인트
page.repaintRequested = function (e) {
    console.log(e);
};

//DOMContentLoaded 이벤트가 발생했을 때
page.onCallback = function () {
    //정말 로딩이 더이상 없는지 체크
    documentReadyCheck();
};

//DOMContentLoaded 이벤트에 콜백 등록
page.onInitialized = function () {
    page.evaluate(function () {
        document.addEventListener('DOMContentLoaded', function () {
            window.callPhantom('DOMContentLoaded');
        }, false);
    });
};

//페이지 오픈
page.open('http://www.gsshop.com/prd/detail.gs?prdid=16233854', function (status) {
	if (status !== 'success') {
		console.log("ERROR");
		phantom.exit();
	}
});
