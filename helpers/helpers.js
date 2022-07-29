const moment = require('moment')

module.exports = {
    formatDate: function(num, format) {
        return moment(num).format(format);
    },
    getTotalPrice: function(start, end) {
        return start * end;
    },
    getImage: function(format, str){
        image = 'data:'+format+';base64,' + str.toString('base64');
        // image = 'data:'+format+';base64,' + hexToBase64(str);
        return image;
    },
    select: function(selected, options) {
        return options
            .fn(this)
            .replace(
                new RegExp(' value="' + selected + '"'),
                '$& selected="selected"'
            )
            .replace(
                new RegExp('>' + selected + '</option>'),
                ' selected="selected"$&'
            )
    },
}

function hexToBase64(strs){
    str = strs.toString();
    return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
}