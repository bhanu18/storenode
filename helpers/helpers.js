const moment = require('moment');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
    sendEmail: async (sender, receiver, subject, body) => {
        
        const msg = {
            to: receiver,
            from: sender, // Use the email address or domain you verified above
            subject: subject,
            html: body,
        };

        await sgMail.send(msg);

    }
}

function hexToBase64(strs){
    str = strs.toString();
    return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
}