function CanvasUtil(canvasId, overTargetId, changeColorBtnId, sendRemoteSvgBtnId, removeRemoteSvgBtnId, remoteUserId, localCanvasUtil) {
    this.canvasId = canvasId;
    this.overTargetId = overTargetId;
    this.changeColorBtnId = changeColorBtnId;
    this.sendRemoteSvgBtnId = sendRemoteSvgBtnId;
    this.removeRemoteSvgBtnId = removeRemoteSvgBtnId;
    this.remoteUserId = remoteUserId;
    this.localCanvasUtil = localCanvasUtil;

    this.canvas = null;
    this.ctx = null;

    this.flag = false;
    this.dotFlag = false;

    this.prevX = 0;
    this.currX = 0;
    this.prevY = 0;
    this.currY = 0;

    this.x = "white";
    this.y = 3;

    this.width = 0;
    this.height = 0;

    this.init = function (isSetEvent) {
        var _this = this;

        var $canvas = $(this.canvasId);
        var $overTarget = $(this.overTargetId);
        this.canvas = $canvas.get(0);

        if (this.overTargetId) {
            var offset = $overTarget.offset();
            var top = parseInt(offset.top, 10);
            var left = parseInt(offset.left);
            //width, height 정사각형이 아니면 포인트가 달라짐
            $canvas.css({
                position: 'absolute',
                top: '{0}px'.format(top),
                left: '{0}px'.format(left)
            });
            $canvas.attr('width', parseInt($overTarget.width(), 10));
            $canvas.attr('height', parseInt($overTarget.height(), 10));
        }

        $canvas.css('display', 'block');
        this.ctx = this.canvas.getContext("2d");

        this.width = this.canvas.width;
        this.height = this.canvas.height;

        if (isSetEvent) {
            $(this.changeColorBtnId).css('display', 'inline-block');
            $(this.sendRemoteSvgBtnId).css('display', 'inline-block');
            $(this.removeRemoteSvgBtnId).css('display', 'inline-block');

            //펜슬 컬러변경
            $(this.changeColorBtnId).ColorPicker({
                onChange: function (hsb, hex, rgb) {
                    _this.x = '#{0}'.format(hex);
                }
            });

            //이미지 전달
            $(this.sendRemoteSvgBtnId).click(function (e) {
                WebSocket.sendMessage({
                    dest: '/target/user/drawing',
                    messageInfo: {
                        type: 'DRAWING',
                        userId: _this.remoteUserId,
                        message: _this.canvas.toDataURL()
                    }
                });
                _this.eras();
            });
            //이미지 receive
            WebSocket.setSubscribe({
                desc: '/user/queue/drawing',
                callback: function (message) {
                    var image = new Image();
                    image.onload = function () {
                        delete image;
                        _this.localCanvasUtil.ctx.drawImage(image, 0, 0);
                    };
                    image.src = message.body;
                    setTimeout(function () {
                        _this.localCanvasUtil.eras();
                    }, 3000);
                }
            });

            $(this.removeRemoteSvgBtnId).click(function (e) {
                _this.eras();
            });

            $canvas.on('mousedown touchstart', function (e) {
                _this.senseAction('down', e);
                e.preventDefault();
            });

            $canvas.on('mousemove touchmove', function (e) {
                _this.senseAction('move', e);
                e.preventDefault();
            });

            $canvas.on('mouseup touchend', function (e) {
                _this.senseAction('up', e);
                e.preventDefault();
            });

            $canvas.on('mouseout touchcancel', function (e) {
                _this.senseAction('out', e);
                e.preventDefault();
            });
        }
    }

    this.senseAction = function (action, e) {
        var clientX = e.clientX;
        var clientY = e.clientY;
        if (e.touches) {
            var touch = e.touches[0];
            clientX = touch.clientX;
            clientY = touch.clientY;
        }
        switch (action) {
            case 'up':
            case 'out':
                this.flag = false;
                break;
            case 'down':
                this.prevX = this.currX;
                this.prevY = this.currY;
                this.currX = clientX - this.canvas.offsetLeft;
                this.currY = clientY - this.canvas.offsetTop;

                this.flag = true;
                this.dotFlag = true;
                if (this.dotFlag) {
                    this.ctx.beginPath();
                    this.ctx.fillStyle = this.x;
                    this.ctx.fillRect(this.currX, this.currY, 2, 2);
                    this.ctx.closePath();
                    this.dotFlag = false;
                }
                break;
            case 'move':
                if (this.flag) {
                    this.prevX = this.currX;
                    this.prevY = this.currY;
                    this.currX = clientX - this.canvas.offsetLeft;
                    this.currY = clientY - this.canvas.offsetTop;
                    this.draw();
                }
                break;
        }
    }

    this.draw = function () {
        this.ctx.beginPath();
        this.ctx.moveTo(this.prevX, this.prevY);
        this.ctx.lineTo(this.currX, this.currY);
        this.ctx.strokeStyle = this.x;
        this.ctx.lineWidth = this.y;
        this.ctx.stroke();
        this.ctx.closePath();
    }

    this.eras = function () {
        if (this.ctx != null) {
            this.ctx.clearRect(0, 0, this.width, this.height);
            // document.getElementById("canvasimg").style.display = "none";
        }
    }

    this.save = function () {
        document.getElementById("canvasimg").style.border = "2px solid";
        var dataURL = this.canvas.toDataURL();
        document.getElementById("canvasimg").src = dataURL;
        document.getElementById("canvasimg").style.display = "inline";
    }
};