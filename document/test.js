function Util(initVal) {
    this.initVal = initVal;

    this.print = function (val) {
        console.log(initVal, val);
    }
}

var util = new Util('init');
util.print('print');