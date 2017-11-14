var AjaxUtil = {
    call: function (options) {
        if (!options) {
            CommonMsgModal.alertModal('통신 파라미터 오류');
            return false;
        }
        if (options.contentType == 'application/json') {
            options.data = JSON.stringify(options.data) || {};
        }

        if (options.mask == undefined) {
            $('#loading').css('display', 'block');
            ImgLoader.startAnimation();
        }
        var ajaxOptions = {
            async: options.async == undefined ? true : options.async,
            type: options.type || 'get',
            url: options.url,
            headers: {
                Accept: options.accept || "application/json; charset=utf-8"
            },
            data: options.data || {},
            processData: options.processData == undefined ? true : options.processData,
            contentType: options.contentType == undefined ? "application/x-www-form-urlencoded; charset=UTF-8" : options.contentType,
            success: function (data) {
                if (options.mask == undefined && !options.mask) {
                    $('#loading').css('display', 'none');
                }
                ImgLoader.stopAnimation();
                if (options.bindParams) {
                    options.success(data, options.bindParams);
                } else {
                    options.success(data);
                }
            },
            error: function (req, status, errorText) {
                if (options.mask == undefined && !options.mask) {
                    $('#loading').css('display', 'none');
                }
                ImgLoader.stopAnimation();

                //광고차단 플러인등에 걸린경우
                if (req.readyState == 0 || req.status == 0) {
                    CommonMsgModal.alertModal(CommonLang.common.pluginBlock);
                    return;
                }
                if (options.error) {
                    options.error(req, status, errorText);
                } else {
                    AjaxUtil.displayErrorMsg(req.status, req.responseText);
                }
            }
        };
        if (options.dataType != undefined) {
            ajaxOptions.dataType = options.dataType;
        }
        if (options.jsonp != undefined) {
            ajaxOptions.jsonp = options.jsonp;
        }
        $.ajax(ajaxOptions)
    },

    displayErrorMsg: function (status, responseText) {
        var _this = this;
        CommonMsgModal.alertModal(_this.returnMsg(status, responseText));
    },

    returnMsg: function (status, responseText) {
        var tempDisplayMsg = '';
        if (ErrorCodeMap.codes[status]) {
            if (ErrorCodeMap.codes[status].isShowServerMsg) {
                var result = $.parseJSON(responseText);
                var displayMsg = result.message;
                if (displayMsg == '') {
                    displayMsg = ErrorCodeMap.codes[status].msg;
                }
                tempDisplayMsg = displayMsg;
            } else {
                tempDisplayMsg = ErrorCodeMap.codes[status].msg;
            }
            if (ErrorCodeMap.codes[status].isRedirect) {
                window.location.href = '/';
            }
        } else {
            tempDisplayMsg = ErrorCodeMap.defaultMsg;
        }

        return tempDisplayMsg;
    }
}

$(function ($) {
    $.extend({
        form: function (url, data, method) {
            if (method == null) method = 'POST';
            if (data == null) data = {};

            var form = $('<form>').attr({
                method: method,
                action: url
            }).css({
                display: 'none'
            });

            var addData = function (name, data) {
                if ($.isArray(data)) {
                    for (var i = 0; i < data.length; i++) {
                        var value = data[i];
                        addData(name + '[]', value);
                    }
                } else if (typeof data === 'object') {
                    for (var key in data) {
                        if (data.hasOwnProperty(key)) {
                            addData(name + '[' + key + ']', data[key]);
                        }
                    }
                } else if (data != null) {
                    form.append($('<input>').attr({
                        type: 'hidden',
                        name: String(name),
                        value: String(data)
                    }));
                }
            };

            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    addData(key, data[key]);
                }
            }

            return form.appendTo('body');
        }
    });
});