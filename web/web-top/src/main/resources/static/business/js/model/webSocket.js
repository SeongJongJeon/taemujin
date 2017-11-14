//웹소켓 연결 만을 담당한다.
var WebSocket = (function () {
    //https://localhost:8444/chat
    var endpointUrl = '/chat';
    var sock = null;
    var socketClient = null;
    //Server 설정을 따름
    var prefixDest = '/message';

    var connectionOption = {
        //재연결 시도 최대 횟수 (배포시 ELB 에서 인스턴스가 제외되는 값을 계산한 셋팅 = socketReConnectTryMaxCnt * socketReConnectIntervalTime)
        socketReConnectTryMaxCnt: 14,
        //재연결 시도 인터벌 타임
        socketReConnectIntervalTime: 5000,
        //재연결 시도횟수
        socketReConnectTryCnt: 0,
        //interval의 ID 값
        socketReConnectIntervalId: 0
    };
    var isFirstConnection = true;

    //웹소켓 연결후 등록 할 구독 리스트
    var subscribeList = [];
    var afterConnectCallback = function () {
    };

    /**
     * Web Socket 연결시도
     */
    function init() {
        if (sock == null) {
            sock = new SockJS(endpointUrl);
            socketClient = Stomp.over(sock);
            socketClient.debug = null;
        } else {
            socketClient.disconnect();
        }

        //연결시도
        socketClient.connect({}, connect, disconnect);
    }

    function connect(frame) {
        //safari 에서 연결이 바로 끊어지는 경우가 발생
        if (!checkConnection()) {
            disconnect();
            return;
        }

        connectionOption.socketReConnectTryCnt = 0;
        clearReconnectionInterval();
        subscribeAll();
        afterConnectCallback(isFirstConnection);
        isFirstConnection = false;
    }

    function disconnect(error) {
        clearReconnectionInterval();
        if (connectionOption.socketReConnectTryCnt <= connectionOption.socketReConnectTryMaxCnt) {
            connectionOption.socketReConnectIntervalObj = setInterval(function () {
                connectionOption.socketReConnectTryCnt++;
                init();
            }, connectionOption.socketReConnectIntervalTime);
        } else {
            console.log('fail websocket connect')
        }
    }

    function clearReconnectionInterval() {
        if (connectionOption.socketReConnectIntervalId > 0) {
            clearInterval(connectionOption.socketReConnectIntervalId);
        }
        connectionOption.socketReConnectIntervalId = 0;
    }

    //인자로 받은
    function subscribeAll() {
        if (subscribeList == null || subscribeList.length <= 0) {
            return;
        }

        for (var idx in subscribeList) {
            subscribe(subscribeList[idx]);
        }
    }

    //구독 설정
    function subscribe(options) {
        if (checkConnection()) {
            socketClient.subscribe(options.desc, options.callback);
        } else {
            console.error('Not established socket yet.');
        }
    }

    //메시지 전송
    function sendMessage(options) {
        socketClient.send(prefixDest + options.dest, {}, JSON.stringify(options.messageInfo));
    }

    //Web Socket 연결상태인지 체크
    function checkConnection() {
        if (socketClient == null) {
            console.error('You have to call start method.');
            return false;
        }
        return socketClient.connected;
    }

    return {
        setSubscribe: subscribe,
        sendMessage: sendMessage,
        checkConnection: checkConnection,
        start: function (subscribeListJson, callback) {
            if (subscribeListJson) {
                subscribeList = subscribeListJson;
            }
            if (typeof callback === "function") {
                afterConnectCallback = callback;
            }
            init(callback);
        }
    }
})();