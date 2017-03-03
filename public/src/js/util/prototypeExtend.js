/**
 * 日期格式化扩展
 */

//      使用方法
//      var now = new Date();
//      var nowStr = now.format("yyyy-MM-dd hh:mm:ss");
//      //使用方法2:
//      var testDate = new Date();
//      var testStr = testDate.format("YYYY年MM月dd日hh小时mm分ss秒");
//      alert(testStr);
//      //示例：
//      alert(new Date().Format("yyyy年MM月dd日"));
//      alert(new Date().Format("MM/dd/yyyy"));
//      alert(new Date().Format("yyyyMMdd"));
//      alert(new Date().Format("yyyy-MM-dd hh:mm:ss"));

Date.prototype.format = function (format) {
    var that = this;
    var o = {
        "M+": that.getMonth() + 1,
        //month
        "d+": that.getDate(),
        //day
        "h+": that.getHours(),
        //hour
        "m+": that.getMinutes(),
        //minute
        "s+": that.getSeconds(),
        //second
        "q+": Math.floor((that.getMonth() + 3) / 3),
        //quarter
        "S": that.getMilliseconds() //millisecond
    };

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};


