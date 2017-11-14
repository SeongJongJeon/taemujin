if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

var waitForFinalEvent = (function () {
    var timers = {};
    return function (callback, ms, uniqueId) {
        if (!uniqueId) {
            uniqueId = "Don't call this twice without a uniqueId";
        }
        if (timers[uniqueId]) {
            clearTimeout(timers[uniqueId]);
        }
        timers[uniqueId] = setTimeout(callback, ms);
    };
})();

$(document).on({
    'shown.bs.modal': function (e) {
        if (e.currentTarget.id == 'syrupMobile') {
            $('.modal-backdrop').css('background-color', '#FFFFFF');
            $('.modal-backdrop.in').css('opacity', '1');
        } else {
            $('.modal-backdrop').css('background-color', '#000000');
            $('.modal-backdrop.in').css('opacity', '0.5');
        }
        var currentModalCnt = $('body').data('cnt') > 0 ? $('body').data('cnt') : 0;
        $('body').data('cnt', currentModalCnt + 1);
        $('body').addClass('modal-open');
        //모달 있을땐 채팅버튼 제거
        $('#chattingButton').css('display', 'none');

        // if (MobileUtil.checkMobile()) {
        //     $('body').css('position', 'fixed');
        // }
    },
    'hidden.bs.modal': function (e) {
        var currentModalCnt = $('body').data('cnt') - 1;
        $('body').data('cnt', currentModalCnt);
        if (currentModalCnt <= 0) {
            $('#chattingButton').css('display', 'block');
            $('body').removeClass('modal-open');

            // if (MobileUtil.checkMobile()) {
            //     $('body').css('position', 'static');
            // }
        } else {
            $('body').addClass('modal-open');
        }
    }
}, '.modal');

var InfluencerUtil = {
    genderMap: {MAN: '남자', WOMAN: '여자', NONE: '성별'},
    sidoMap: {
        '강원도': '강원',
        '경기도': '경기',
        '경상남도': '경남',
        '경상북도': '경북',
        '광주광역시': '광주',
        '대구광역시': '대구',
        '대전광역시': '대전',
        '부산광역시': '부산',
        '서울특별시': '서울',
        '세종특별자치시': '세종',
        '울산광역시': '울산',
        '인천광역시': '인천',
        '전라남도': '전남',
        '전라북도': '전북',
        '제주특별자치도': '제주',
        '충청남도': '충남',
        '충청북도': '충북',
    },

    generateInfo: function (sido, gender, ageBand) {
        var _this = this;
        if (sido == null) {
            sido = '지역';
        } else {
            sido = _this.sidoMap[sido];
            if (sido == undefined) {
                sido = '지역';
            }
        }

        if (ageBand == 0) {
            ageBand = '연령대';
        } else {
            var currentYear = new Date().getFullYear();
            var age = (currentYear - ageBand).toString();
            ageBand = age.substring(0, age.length - 1) + '0대';
        }
        return '{0}, {1}, {2}'.format(
            sido,
            _this.genderMap[gender],
            ageBand
        );
    },

    generateGender: function (gender) {
        var _this = this;
        return _this.genderMap[gender];
    },

    generateRegion: function (sido) {
        var _this = this;
        return _this.sidoMap[sido];
    }
};

var CryptoUtil = {
    keySize: 128,
    iterationCount: 1,
    passPhrase: 'Buzzmarket jump',
    iv: 'F27D5C9927726BCEFE7510B1BDD3D137',
    salt: '3FF2EC019C627B945225DEBAD71A01B6985FE84C95A70EB132882F88C0A59A55',

    encrypt: function (plainText) {
        var _this = this;

        var aesUtil = new AesUtil(_this.keySize, _this.iterationCount);
        var encrypt = aesUtil.encrypt(_this.salt, _this.iv, _this.passPhrase, plainText);
        return encrypt;
    },

    decrypt: function (cipherText) {
        var _this = this;

        var aesUtil = new AesUtil(_this.keySize, _this.iterationCount);
        var decrypt = aesUtil.decrypt(_this.salt, _this.iv, _this.passPhrase, cipherText);
        return decrypt;
    }
};

var CardView = {
    /**
     * 카드뷰 레이아웃 조정
     */
    adjustCardViewLayout: function (layoutName) {
        var name = layoutName ? layoutName : '.grid';
        return $(name).masonry({
            // set itemSelector so .grid-sizer is not used in layout
            percentPosition: true,
            itemSelector: '.grid-item',
            // columnWidth: 450,
            // gutter: 20,
            // use element for option
            columnWidth: '.grid-sizer'
        });
    }
};

var MobileUtil = {
    checkMobile: function () {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
};

var BrowserUtil = {
    checkIE: function () {
        var agent = navigator.userAgent.toLowerCase();
        if ((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1)) {
            return true;
        }
        return false;
    }
}

var LottieUtil = {
    loadNoData: function () {
        jQuery.ajax({
            url: StaticData.resourcePath + '/thirdparty/lottie/bodymovin.js',
            dataType: 'script',
            success: function () {
                var animation = bodymovin.loadAnimation({
                    container: document.getElementById('bmLoader'),
                    renderer: 'svg',
                    loop: true,
                    autoplay: true,
                    path: StaticData.resourcePath + '/thirdparty/lottie/data.json'
                });
            },
            async: true
        });
    }
}

/**
 * 파일 체크
 */
var CheckFileUtil = {
    isRestrict: function (originSize, restrictSize, unit) {
        var tempRestrictSize = 0;
        switch (unit) {
            case 'KB':
                tempRestrictSize = restrictSize * 1024;
                break;
            case 'MB':
                tempRestrictSize = restrictSize * 1024 * 1024;
                break;
            case 'GB':
                tempRestrictSize = restrictSize * 1024 * 1024 * 1024;
                break;
            default:
                tempRestrictSize = restrictSize;
        }

        if (originSize > tempRestrictSize) {
            return true;
        }

        return false;
    }
}

var ImgUtil = {
    uploadTempMediaUrl: '/both/uploadTempMedia',
    defaultImgRestrictSize: 5,
    defaultMovieRestrictSize: 30,
    defaultSizeUnit: 'MB',

    /**
     * 백그라운드로 변경하는 경우
     * @param $imgBtn
     * @param $imgPreview
     * @param $imgPreviewOverTxt
     */
    setBgImgPreview: function ($imgBtn, $imgPreview, $imgPreviewOverTxt) {
        var _this = this;

        $imgBtn.change(function (e) {
            $imgPreview.css('background-image', 'url({0})'.format(''));
            var group = $('#{0}Group'.format($imgPreview.attr('id')));
            var validTxt = $('#{0}GroupValid'.format($imgPreview.attr('id')));

            //정의된 파일 확장자가 아닌경우
            if (!$(this).val().match(/.(jpg|jpeg|png|gif)$/i)) {
                $(this).val('');
                if (group) {
                    validTxt.html('지원하지 않는 포멧입니다.<br />jpg, jpeg, gif, png 파일을 업로드 해주세요.');
                    group.addClass('has-warning');
                } else {
                    CommonMsgModal.alertModal(CommonLang.common.imageExtension);
                }
                return;
            }
            //지정된 사이즈를 넘은경우
            if (CheckFileUtil.isRestrict($(this)[0].files[0].size, _this.defaultImgRestrictSize, _this.defaultSizeUnit)) {
                $(this).val('');
                if (group) {
                    validTxt.html('이미지 사이즈는 최대 {0}{1}까지 지원합니다.'.format(_this.defaultImgRestrictSize, _this.defaultSizeUnit));
                    group.addClass('has-warning');
                } else {
                    CommonMsgModal.alertModal(CommonLang.common.imageExtension);
                }
                return;
            }
            group.removeClass('has-warning');

            var formData = new FormData();
            formData.append("mediaFile", $(this)[0].files[0]);

            $('#loading').css('display', 'block');
            ImgLoader.startAnimation();
            $.ajax({
                type: 'POST',
                url: _this.uploadTempMediaUrl,
                data: formData,
                processData: false,
                contentType: false,
                success: function (result) {
                    $('#loading').css('display', 'none');
                    ImgLoader.stopAnimation();

                    var url = $.parseJSON(result).message;

                    $imgPreview.css('background-image', 'url({0})'.format(StaticData.awsCloudFront + url));
                    if ($imgPreviewOverTxt) {
                        $imgPreviewOverTxt.css('display', 'none');
                    }
                },
                error: function (req, status, errorText) {
                    $('#loading').css('display', 'none');
                    ImgLoader.stopAnimation();
                }
            });
        });
    },

    /**
     * Img 태그인경우
     * @param $imgBtn
     * @param $imgPreview
     * @param $imgPreviewOverTxt
     */
    setImgPreview: function ($imgBtn, $imgPreview, $imgPreviewOverTxt, isCrop) {
        var _this = this;

        $imgBtn.change(function (e) {
            $imgPreview.attr('src', '');
            $imgPreview.parent().removeClass('previewCls');
            var group = $('#{0}Group'.format($imgPreview.attr('id')));
            var validTxt = $('#{0}Valid'.format($imgPreview.attr('id')));

            //정의된 파일 확장자가 아닌경우
            if (!$(this).val().match(/.(jpg|jpeg|png|gif)$/i)) {
                $(this).val('');
                if (group) {
                    validTxt.html('지원하지 않는 포멧입니다.<br />jpg, jpeg, gif, png 파일을 업로드 해주세요.');
                    group.addClass('has-warning');
                } else {
                    CommonMsgModal.alertModal(CommonLang.common.imageExtension);
                }
                $imgPreview.css({'position': 'absolute'});
                return;
            }
            //지정된 사이즈를 넘은경우
            if (CheckFileUtil.isRestrict($(this)[0].files[0].size, _this.defaultImgRestrictSize, _this.defaultSizeUnit)) {
                $(this).val('');
                if (group) {
                    validTxt.html('이미지 사이즈는 최대 {0}{1}까지 지원합니다.'.format(_this.defaultImgRestrictSize, _this.defaultSizeUnit));
                    group.addClass('has-warning');
                } else {
                    CommonMsgModal.alertModal(CommonLang.common.imageExtension);
                }
                return;
            }
            group.removeClass('has-warning');

            var formData = new FormData();
            formData.append("mediaFile", $(this)[0].files[0]);

            $('#loading').css('display', 'block');
            ImgLoader.startAnimation();
            $.ajax({
                type: 'POST',
                url: _this.uploadTempMediaUrl,
                data: formData,
                processData: false,
                contentType: false,
                success: function (result) {
                    $('#loading').css('display', 'none');
                    ImgLoader.stopAnimation();

                    var url = $.parseJSON(result).message;

                    $imgPreview.parent().addClass('previewCls');
                    $imgPreview.attr('src', StaticData.awsCloudFront + url);
                    if ($imgPreviewOverTxt) {
                        $imgPreviewOverTxt.css('display', 'none');
                    }
                    $imgPreview.css({'position': 'relative', 'border': '1px solid #dedede'});
                    $imgPreview.attr('style', '');

                    if (isCrop) {
                        //참조 : https://fengyuanchen.github.io/cropper/v0.7.9/
                        //https://github.com/fengyuanchen/cropper
                        $imgPreview.cropper("destroy");
                        $imgPreview.cropper({
                            viewMode: 3,
                            aspectRatio: 1,
                            dragMode: 'move',
                            checkImageOrigin: false,
                            autoCropArea: true,
                            restore: false,
                            guides: false,
                            highlight: false,
                            cropBoxMovable: true,
                            cropBoxResizable: false,
                            scalable: true,
                            data: {y: 0}
                        });
                    }
                },
                error: function (req, status, errorText) {
                    $('#loading').css('display', 'none');
                    ImgLoader.stopAnimation();
                }
            });
        });
    },

    setMediaFile: function ($mediaBtn) {
        $mediaBtn.change(function (e) {
            if (!$(this).val().match(/.(jpg|jpeg|png|gif|mp4)$/i)) {
                $(this).val('');
                CommonMsgModal.alertModal(CommonLang.common.mediaExtension);
            }
        });
    },

    checkImgAndPdfFile: function ($mediaBtn) {
        if (!$mediaBtn.val().match(/.(jpg|jpeg|png|gif|pdf)$/i)) {
            return false;
        }
        return true;
    },

    checkImageExtension: function ($fileObj, isAlert) {
        var result = $fileObj.val().match(/.(jpg|jpeg|png|gif)$/i) == null ? false : true;
        if (isAlert && !result) {
            CommonMsgModal.alertModal(CommonLang.common.imageExtension);
        }
        return result;
    },

    checkMediaExtension: function ($fileObj, isAlert) {
        var result = $fileObj.val().match(/.(jpg|jpeg|png|gif|mp4)$/i) == null ? false : true;
        if (isAlert && !result) {
            CommonMsgModal.alertModal(CommonLang.common.mediaExtension);
        }
        return result;
    },

    isRestrictMediaSize: function ($fileObj, isAlert) {
        var _this = this;
        var fileExt = $fileObj.val().split('.').pop();
        var result = {isRestrict: false, type: '', invalidMsg: ''};

        if (fileExt.match(/(jpg|jpeg|png|gif|pdf)$/i) != null) {    //이미지 사이즈
            result.isRestrict = CheckFileUtil.isRestrict($fileObj[0].files[0].size, _this.defaultImgRestrictSize, _this.defaultSizeUnit);
            result.type = 'img';
            result.invalidMsg = '이미지 사이즈는 최대 {0}{1}까지 지원합니다.'.format(_this.defaultImgRestrictSize, _this.defaultSizeUnit);
        } else if (fileExt.match(/(mp4)$/i) != null) {  //동영상 사이즈
            result.isRestrict = CheckFileUtil.isRestrict($fileObj[0].files[0].size, _this.defaultMovieRestrictSize, _this.defaultSizeUnit);
            result.type = 'movie';
            result.invalidMsg = '동영상 사이즈는 최대 {0}{1}까지 지원합니다.'.format(_this.defaultMovieRestrictSize, _this.defaultSizeUnit);
        }
        return result;
    },

    extractFileName: function ($fileObj) {
        var split = $fileObj.val().split('\\');
        return split[split.length - 1];
    },

    showMediaFile: function (mediaType, url) {
        $('#draftCover').find('.modal-body:eq(0)').html('');
        $('#draftCover').css('zIndex', 1051);
        var tag = '';
        switch (mediaType) {
            case 'I':   //image
                tag = '<img src="{0}{1}"/>'.format(StaticData.awsCloudFront, url);
                break;
            case 'V':   //Video
                var videoWidth = $(document).width();
                if (MobileUtil.checkMobile()) {
                    videoWidth = videoWidth - 50;
                } else {
                    videoWidth = 640;
                }
                tag = '<video width="' + videoWidth + '" controls autoplay><source src="{0}{1}" type="video/mp4">Your browser does not support the video tag.</video>'.format(StaticData.awsCloudFront, url);
                break;
        }
        $('#draftCover').find('.modal-body:eq(0)').html(tag);
        $('#draftCover').on('hidden.bs.modal', function () {
            $('video').remove();
        });
        $('#draftCover').modal('show');
    }
};

var HtmlTagUtil = {
    /**
     * tag 객체를 생성한다
     */
    generateHtmlTag: function (options) {
        var $obj = $('<' + options.tagName + '>' + '</' + options.tagName + '>');
        if (options.attr) {
            $.each(options.attr, function (key, val) {
                $obj.attr(key, val);
            });
        }
        if (options.text) {
            $obj.text(options.text);
        }
        if (options.css) {
            $obj.css(options.css);
        }
        if (options.class) {
            $obj.addClass(options.class);
        }
        return $obj;
    },

    /**
     * 태그 제거
     */
    stripTag: function (content) {
        return content.replace(/<(\/)?([a-z]*)(\s[a-z]*=[^>]*)?(\s)*(\/)?>/gi, "");
    }
};

var NumberUtil = {
    numberWithCommas: function (number) {
        number = parseInt(number, 10);
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    numberWithCommasAndFloatPointAndAvg: function (molecule, denominator) {
        if (molecule == 0) {
            return 0;
        }
        return this.numberWithCommasAndFloatPoint(molecule / denominator, 1);
    },

    numberWithCommasAndFloatPoint: function (number, point) {
        var strNumber = number.toString();
        var splitNumber = strNumber.split('.');
        number = parseInt(splitNumber[0], 10);

        var returnVal = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if (splitNumber.length > 1) {
            returnVal += '.' + splitNumber[1].substr(0, point);
        }
        return returnVal;
    },

    setOnlyNumberField: function ($obj) {
        $obj.keyup(function (e) {
            $(this).val($(this).val().replace(/[^\d]/g, ''));
        });
    },

    getRandomNumber: function (min, max) {
        return Math.floor((Math.random() * max) + min);
    },

    numberWithCommasWithDecimalPoint: function (number, pointNumber) {
        number = parseInt(number, 10);
        return Number(number.toFixed(pointNumber)).toLocaleString('en');
    },
    numberWithCommasAndUnit: function (number) {
        number = parseInt(number, 10);
        var unit;
        if (number > 1000) {
            number = number / 1000;
            number = number.toFixed(0);
            unit = 'k';
            if (number > 1000) {
                number = number / 1000;
                number = number.toFixed(0);
                unit = 'm';
            }
        }
        number = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if (unit != undefined) {
            number += unit
        }
        return number;
    },
    numberWithCommasAndCurrency: function (number) {
        number = parseInt(number, 10);
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '원';
    },

    reduceNumber: function (number) {
        var changedNumber = '';
        if (number >= 1000 && number < 1000000) {
            var temp = ((number / 1000).toFixed(1)).toString();
            changedNumber = parseInt(temp.split('.')[1], 10) > 0 ? temp + 'K' : temp.split('.')[0] + 'K';
        } else if (number >= 1000000) {
            var temp = ((number / 1000000).toFixed(1)).toString();
            changedNumber = parseInt(temp.split('.')[1], 10) > 0 ? temp + 'M' : temp.split('.')[0] + 'M';
        } else {
            changedNumber = number;
        }
        return changedNumber;
    }
};

var SizeUtil = {
    getContentHeight: function () {
        var contentHeight = $(document).height() - $('#footer').height() - $('#navbarLayout').height() - $('#searchBox').height() - 100;
        return contentHeight;
    }
};

var PagenavigationUtil = {
    displayPagenavigation: function ($obj, totalCnt, currentPage, sizePerPage) {
        var $pageObj = $obj || $('div.text-center ul.pagination')
        $pageObj.html('');
        var pageSize = sizePerPage || StaticData.sizePerPage;

        var totalPage = totalCnt == 0 ? 0 : (totalCnt / pageSize) + (totalCnt % pageSize > 0 ? 1 : 0);
        if (totalPage > 0) {
            for (var i = 1; i <= totalPage; i++) {
                var active = '';
                if (i == currentPage) {
                    active = 'active';
                }
                $pageObj.append('<li class="' + active + '"><a href="javascript:void(0);">' + i + '</a></li>');
            }
        }
    }
};

var ValidateUtil = {
    emailRegex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    urlRegex: /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/,
    cellPhoneRegex: /^(?:(010\d{4})|(01[1|6|7|8|9]\d{3,4}))(\d{4})$/,
    containsEmailRegex: /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/,
    containsPhoneRegex: /(?:(\d{2,3})|(\d{3,4}))(\d{4})/,
    containsPhoneHyphenRegex: /(?:(\d{2,3}[-|\s])|([-|\s]\d{3,4}))[-|\s](\d{4})/,
    containsCellPhoneRegex: /(?:(010\d{4})|(01[1|6|7|8|9]\d{3,4}))(\d{4})/,
    containsCellPhoneHyphenRegex: /(?:(010[-|\s]\d{4})|(01[1|6|7|8|9][-|\s]\d{3,4}))[-|\s](\d{4})/,
    // cellPhoneRegex: /^(?:(010-\d{4})|(01[1|6|7|8|9]-\d{3,4}))-(\d{4})$/,

    checkEmailForm: function (email) {
        return this.emailRegex.test(email);
    },

    checkUrlForm: function (url) {
        return this.urlRegex.test(url);
    },

    checkCellPhone: function (cellPhone) {
        return this.cellPhoneRegex.test(cellPhone);
    },

    checkContainsEmail: function (txt) {
        return this.containsEmailRegex.test(txt);
    },

    checkContainsPhone: function (txt) {
        return this.containsPhoneRegex.test(txt) || this.containsPhoneHyphenRegex.test(txt) || this.containsCellPhoneRegex.test(txt) || this.containsCellPhoneHyphenRegex.test(txt);
    }
}

var CommonSearchList = {
    /**
     * window의 스크롤에 따라 다음 페이지를 호출해야 하는 경우 셋팅
     */
    setScroll: function (func) {
        $(window).scroll(function () {
            var scrollBottom = $(window).scrollTop() + $(window).height();
            if (scrollBottom > $(document).height() * 0.8) {
                func();
            }
        });
    },

    /**
     * 주어진 엘리먼트 밖의 스크롤 막음
     */
    setElementScrollAndPreventOuterScroll: function ($layout) {
        $layout.on('mousewheel DOMMouseScroll', function (e) {
            var e0 = e.originalEvent;
            var delta = e0.wheelDelta || -e0.detail;

            this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
            e.preventDefault();
        });
    },

    /**
     * 스크롤의 상단으로 부터 주어진 퍼센트 이내에 위치에 있는지 체크
     * @param $layout
     * @param percent
     * @returns {boolean}
     */
    checkScrollUpperPercent: function ($layout, percent) {
        if ($layout.scrollTop() <= ($layout[0].scrollHeight * (percent / 100))) {
            // console.log($layout[0].scrollHeight + " : " + $layout.scrollTop() + " : " + ($layout[0].scrollHeight * (percent / 100)));
            return true;
        }
        return false;
    },

    /**
     * 스크롤의 하단으로 부터 주어진 퍼센트 밖에 위치에 있는지 체크
     * @param $layout
     * @param percent
     * @returns {boolean}
     */
    checkScrollLowerPercent: function ($layout, percent) {
        var scrollHeight = ($layout[0].scrollHeight - $layout.scrollTop());
        var checkHeight = $layout.outerHeight() + ($layout.outerHeight() * (percent / 100));
        if (scrollHeight <= checkHeight) {
            return true;
        }
        return false;
    },

    /**
     * 스크롤이 최하단에 위치하는지 여부
     * @param $layout
     * @returns {boolean}
     */
    checkScrollBottom: function ($layout) {
        var scrollHeight = ($layout[0].scrollHeight - $layout.scrollTop());
        return (scrollHeight - $layout.outerHeight()) <= 0 ? true : false;
    }
};

//SMS 인증을 위함
var Auth = {
    authSmsUrl: '/common/user/sendAuthCode',
    authLaterUrl: '/common/user/authLater',
    idOptions: null,

    /**
     * {
            modalId: _this.modalId,
            authPhoneField: '#advertiserJoinCellPhone',
            authReqBtn: '#brandJoinAuthReqBtn',
            authNum: '#brandJoinAuthNum',
            authNumCheckBtn: '#brandJoinAuthNumCheckBtn',
            authTimeField: '#brandJoinAuthTime',
            authTimeLayout: '#brandJoinAuthTimeLayout',
            userType:'ADVERTISER',
            isLaterAuth:false
        }
     * @param idOptions
     */
    reset: function (idOptions) {
        var _this = this;
        _this.idOptions = idOptions;

        NumberUtil.setOnlyNumberField($(_this.idOptions.authPhoneField));
        NumberUtil.setOnlyNumberField($(_this.idOptions.authNum));

        //인증요청 버튼
        $(idOptions.authReqBtn).click(function () {
            var isValid = _this.eachFieldValidate(idOptions.authPhoneField, false);
            if (isValid) {
                $('{0}Group'.format(_this.idOptions.authNum)).removeClass('has-warning');
                $('{0}Group'.format(_this.idOptions.authNum)).removeClass('has-success');
                $(_this.idOptions.modalId).removeData('authCode');
                $(_this.idOptions.modalId).removeData('auth');
                $(_this.idOptions.authNum).val('');
                $(_this.idOptions.authNum).removeAttr('readonly');
                $(_this.idOptions.authNumCheckBtn).html('인증확인');
                $(this).html('재요청');
                _this.authSms();
            }
        });

        //인증확인 버튼
        $(idOptions.authNumCheckBtn).click(function () {
            //이미인증한 경우
            if ($(_this.idOptions.modalId).data('auth')) {
                return;
            }

            //인증번호가 있는지 검사
            var isValid = _this.eachFieldValidate(_this.idOptions.authNum, true);
            if (!isValid) {
                return;
            }

            var enteredNum = $.trim($(_this.idOptions.authNum).val());
            //입력시간 초과
            if ($(_this.idOptions.authTimeField).data('countDownSeconds') <= 0) {
                var fieldGroup = $('{0}Group'.format(_this.idOptions.authNum));
                var fieldValid = $('{0}Valid'.format(_this.idOptions.authNum));
                CommonMsgModal.invalidMsgOnOff(true, fieldGroup, fieldValid, CommonLang.user.joinExceedAuth);
                return;
            }

            //인증완료
            if (enteredNum == $(_this.idOptions.modalId).data('authCode')) {
                DateUtil.clearCountDown($(_this.idOptions.authTimeField));
                $(_this.idOptions.modalId).data('auth', true);
                $(_this.idOptions.authTimeLayout).css('display', 'none');
                $(_this.idOptions.authNum).attr('readonly', true);
                $(_this.idOptions.authNumCheckBtn).html('인증완료');
                if (_this.idOptions.isLaterAuth) {
                    _this.authLater();
                }
                return;
            }
            //인증값이 맞지 않는 경우
            var fieldGroup = $('{0}Group'.format(_this.idOptions.authNum));
            var fieldValid = $('{0}Valid'.format(_this.idOptions.authNum));
            CommonMsgModal.invalidMsgOnOff(true, fieldGroup, fieldValid, CommonLang.user.joinNotMatchAuth);
        })
    },

    eachFieldValidate: function (fieldId, isAuthNumField) {
        var _this = this;

        var validGroup = $('{0}Group'.format(fieldId));
        var validMsg = $('{0}Valid'.format(fieldId));

        var fieldObj = $(fieldId);
        var val = $.trim(fieldObj.val());

        var isValid = true;
        var invalidMsg = '';
        if (isAuthNumField) {
            if (val == '') {
                isValid = false;
                invalidMsg = CommonLang.user.joinAuth;
            } else if (!$(_this.idOptions.modalId).data('authCode')) {
                isValid = false;
                invalidMsg = CommonLang.user.joinNotAuth;
            }
        } else {
            if (val == '') {
                isValid = false;
                invalidMsg = CommonLang.advertiserRegistration['advertiserJoinCellPhone'];
            } else if (!ValidateUtil.checkCellPhone(val)) {
                isValid = false;
                invalidMsg = CommonLang.advertiserRegistration['advertiserJoinCellPhoneInvalid'];
            }

        }

        if (isValid) {
            CommonMsgModal.invalidMsgOnOff(false, validGroup, validMsg);
        } else {
            CommonMsgModal.invalidMsgOnOff(true, validGroup, validMsg, invalidMsg);
        }

        return isValid;
    },

    authSms: function () {
        var _this = this;

        AjaxUtil.call({
            type: 'post',
            data: {userType: _this.idOptions.userType, phone: $.trim($(_this.idOptions.authPhoneField).val())},
            url: _this.authSmsUrl,
            success: function (result) {
                var fieldGroup = $('{0}Group'.format(_this.idOptions.authPhoneField));
                var fieldValid = $('{0}Valid'.format(_this.idOptions.authPhoneField));

                if (result.code == 201) {
                    CommonMsgModal.invalidMsgOnOff(true, fieldGroup, fieldValid, CommonLang.user.alreadyRegistrationNumber);
                } else if (result.code == 202) {
                    CommonMsgModal.invalidMsgOnOff(true, fieldGroup, fieldValid, CommonLang.user.overMaxAuthTryCnt);
                } else {
                    DateUtil.countDown($(_this.idOptions.authTimeField), 180);
                    $(_this.idOptions.modalId).find(_this.idOptions.authTimeLayout).css('display', 'block');
                    $(_this.idOptions.modalId).data('authCode', CryptoUtil.decrypt(result.message));
                }
            }
        });
    },

    authLater: function () {
        var _this = this;

        AjaxUtil.call({
            type: 'post',
            data: {cellPhone: $.trim($(_this.idOptions.authPhoneField).val())},
            url: _this.authLaterUrl,
            success: function () {
                CommonMsgModal.alertModal(CommonLang.user.completeAuth);
                location.reload(true);
            }
        });
    }
}