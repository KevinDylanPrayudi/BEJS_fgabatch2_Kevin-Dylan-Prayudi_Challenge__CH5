const accounts = require('../routes/api/v1/accounts/');
const db = require('../db');

jest.mock('../routes/api/v1/accounts/model/');

const mockRequest = (data) => {
    const req = {};
    req.params = {
        id: data?.id || 0
    }
    req.body = data?.body
    return req;
}

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

const model = require('../routes/api/v1/accounts/model/');

test('get all accounts', async () => {
    model().__setMockData([])
    const req = mockRequest();
    const res = mockResponse();
    await accounts().get(req, res);
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'data accounts successfully loaded',
        data: {
            message: "Data accounts is empty"
        }
    })

});

test('get account by id', async () => {
    model().__setMockData(null)
    const req = mockRequest();
    const res = mockResponse();
    await accounts().getOne(req, res);
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'data account successfully loaded',
        data: {
            message: "Data account is not found"
        }
    })
});

test('post with result error validation for user_id', async () => {
    model().__setMockData(null)
    const req = mockRequest({
        body: {
            bank_name: "Bank of America",
            bank_account_number: "123456789",
            balance: 1000
        }
    });
    const res = mockResponse();
    await accounts().post(req, res);
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: "\"user_id\" is required"
    })
})

test('post with result error validation for bank_name', async () => {
    model().__setMockData(null)
    const req = mockRequest({
        body: {
            user_id: "123456789",
            bank_account_number: "123456789",
            balance: 1000
        }
    });
    const res = mockResponse();
    await accounts().post(req, res);
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: "\"bank_name\" is required"
    })
})

test('post with result error validation for bank_account_number', async () => {
    model().__setMockData(null)
    const req = mockRequest({
        body: {
            user_id: "123456789",
            bank_name: "Bank of America",
            balance: 1000
        }
    });
    const res = mockResponse();
    await accounts().post(req, res);
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: "\"bank_account_number\" is required"
    })
})

test('post with result error validation for balance', async () => {
    model().__setMockData(null)
    const req = mockRequest({
        body: {
            user_id: "123456789",
            bank_name: "Bank of America",
            bank_account_number: "123456789",
        }
    });
    const res = mockResponse();
    await accounts().post(req, res);
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: "\"balance\" is required"
    })
})

test('post with error result is user_id doesn\'t exists', async () => {
    model().__setMockData(
         db.accounts.create({
            data: {
                user_id: "123456789",
                bank_name: "Bank of America",
                bank_account_number: "123456789",
                balance: 1000
            }
        })
    )

    const req = mockRequest({
        body: {
            user_id: "123456789",
            bank_name: "Bank of America",
            bank_account_number: "123456789",
            balance: 1000
        }
    });
    const res = mockResponse();
    await accounts().post(req, res);
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: "The Accounts_user_id_fkey (index) doesn't exists in other table."
    })
})

test('put with error result is account doesn\'t exists', async () => {
    model().__setMockData(
         db.accounts.update({
            where: {
                id: "123456789"
            },
            data: {
                user_id: "123456789"
            }
        })
    )

    const req = mockRequest({
        body: {
            user_id: "123456789"
        }
    });
    const res = mockResponse();
    await accounts().put(req, res);
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: "Record to update not found."
    })
})

test('put with error result is user_id doesn\'t exists', async () => {
    model().__setMockData(
         db.accounts.update({
            where: {
                id: "27f8e130-79a4-4678-a540-a364692ed530"
            },
            data: {
                user_id: "123456789"
            }
        })
    )

    const req = mockRequest({
        body: {
            user_id: "123456789"
        }
    });
    const res = mockResponse();
    await accounts().put(req, res);
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: "The Accounts_user_id_fkey (index) doesn't exists in other table."
    })
})

test('remove with error result is account_id doesn\'t exists', async () => {
    model().__setMockData(
         db.accounts.delete({
            where: {
                id: "123456789"
            }
        })
    )

    const req = mockRequest();
    const res = mockResponse();
    await accounts().remove(req, res);
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: "Record to delete does not exist."
    })
});

test('getOne with data not found', async () => {
    model().__setMockData(null)

    const req = mockRequest();
    const res = mockResponse();
    await accounts().getOne(req, res);
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'data account successfully loaded',
        data: {
            message: 'Data account is not found'
        }
    })
})