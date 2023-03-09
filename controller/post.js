module.exports = {
    postData: () => {
        res.send({'data': "Hi this is post 1"})
    },
    getData: () => {
        res.send({'msg': 'get it now'});
    }
}