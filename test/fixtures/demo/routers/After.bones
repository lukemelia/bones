router = Bones.Router.extend({
    initialize: function() {
        this.server.get('/page/special', this.pageSpecial);
    },

    pageSpecial: function(req, res, next) {
        res.send('this should never be returned');
    }
});
