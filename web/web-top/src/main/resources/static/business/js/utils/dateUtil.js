var DateUtil = {
    init: function () {
        $.datepicker.setDefaults({
            dateFormat: 'yy-mm-dd',
            prevText: '이전 달',
            nextText: '다음 달',
            monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            dayNames: ['일', '월', '화', '수', '목', '금', '토'],
            dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
            dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
            showMonthAfterYear: true,
            yearSuffix: '년'
        });
    },
    makeDateFiled: function ($fieldObj, options) {
        $fieldObj = $fieldObj.datepicker(options || {});

        if (options.setDate) {
            $fieldObj.datepicker("setDate", options.setDate);
        } else if (options.minDate) {
            $fieldObj.datepicker({minDate: options.minDate});
        } else {
            $fieldObj.datepicker("setDate", new Date());
        }

        if (options.maxDate) {
            $fieldObj.datepicker('option', 'maxDate', options.maxDate);
        }

        if (options.selected) {
            $fieldObj.datepicker('option', 'onSelect', function (dateText, inst) {
                options.selected(dateText, inst);
            });
        }
    },

    makeTimeFiled: function ($fieldObj, options) {
        $fieldObj.timepicker(options || {});
    },

    generateUnixtimeToShortDate: function (time) {
        var date = null;
        if (time == null) {
            date = new Date();
        } else {
            date = new Date(time);
        }
        return $.format.date(date, 'yyyy.MM.dd');
    },

    generateUnixtimeToMiddleDate: function (time) {
        var date = null;
        if (time == null) {
            date = new Date();
        } else {
            date = new Date(time);
        }
        return $.format.date(date, 'yyyy.MM.dd HH:mm');
    },

    generateUnixtimeToFullDate: function (time) {
        var date = null;
        if (time == null) {
            date = new Date();
        } else {
            date = new Date(time);
        }
        return $.format.date(date, 'yyyy.MM.dd HH:mm:ss');
    },

    generateStrToDate: function (str, split) {
        var splitDate = str.split(split);
        return new Date(splitDate[0], splitDate[1] - 1, splitDate[2]);
    },

    /**
     * 날짜 사이의 몇일이 차이나는지 리턴
     * @param fromDate
     * @param toDate
     * @returns {number}
     */
    getDaysBetweenDate: function (fromDate, toDate) {
        var oneDay = 24 * 60 * 60 * 1000;
        return Math.round((fromDate.getTime() - toDate.getTime()) / (oneDay));
    },

    /**
     * 하루안에 등록된 것인지 여부
     */
    isOneDay: function (date) {
        var oneDay = 24 * 60 * 60 * 1000;
        var diffTime = new Date().getTime() - date.getTime();
        if (diffTime <= oneDay) {
            return true;
        }
        return false;
    },

    /**
     * 시분초를 제외한 오늘 날짜의 date 리턴
     */
    getToday: function () {
        var today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), today.getDate());
    },

    /**
     * 주어진 일자를 더해서 날짜값을 리턴
     */
    getPlusDay: function (days) {
        var today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), today.getDate() + days);
    },

    /**
     * 시분초를 제외한 날짜값 리턴
     */
    getYymmdd: function (date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    },

    /**
     * 카운트 다운 분:초
     */
    countDown: function ($field, maxSeconds) {
        var _this = this;
        _this.clearCountDown($field);
        $field.data('countDownSeconds', maxSeconds);
        var x = setInterval(function () {
            var currentSeconds = $field.data('countDownSeconds');
            var minutes = parseInt(currentSeconds / 60, 10);
            var seconds = currentSeconds % 60;
            $field.html('{0}:{1}'.format(minutes, seconds < 10 ? '0' + seconds : seconds));
            $field.data('countDownSeconds', currentSeconds - 1);
            if (currentSeconds == 0) {
                _this.clearCountDown($field);
            }
        }, 1000);
        $field.data('countDown', x);
    },

    clearCountDown: function ($field) {
        clearInterval($field.data('countDown'));
    }
};

DateUtil.init();