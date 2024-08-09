let accounts = jest.createMockFromModule('../');

let values;
accounts = () => {
    function __setMockData(data) {
        values = data
    }

    function get() {
        return values
    }

    function getOne() {
        return values
    }

    function post() {
        return values
    }

    function put() {
        return values
    }

    function remove() {
        return values
    }

    return { __setMockData, get, getOne, post, put, remove };
}

module.exports = accounts;