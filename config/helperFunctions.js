module.exports = {
    select: function(selected, options) {
        return options.fn(this).replace(new RegExp('value=\"' + selected + '\"'), '$&selected="selected"');
    },

    formatDate: function(date, format) {
        return require('moment')(date).format(format);
    }
}