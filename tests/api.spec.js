const request = require('supertest');
const Ajv = require("ajv")
const addFormats = require("ajv-formats")
const { execSync } = require('child_process');


const app = require('../index');

const ajv = new Ajv()
const base_url = '/api/v1'

execSync('npx prisma db seed')

addFormats(ajv, { mode: "fast", formats: ["date-time"], keywords: ["date-time"], strict: false })

let token;
let user_id;
let destination_account_id, source_account_id, account_id;

beforeEach((done) => {
    request(app)
        .post(`${base_url}/login`)
        .send({
            email: 'abigail@gmail.com',
            password: 'abigail'
        })
        .end((err, res) => {
            token = res.body.data.token;
            done();
        });
});

describe('identity-types', () => {

    it('GET: should return 200 status & conform schema', async () => {
        const schema = {
            type: "object",
            properties: {
                status: {
                    type: "string",
                    description: "A identifier success or fail"
                },
                message: {
                    type: "string"
                },
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: {
                                type: "number"
                            },
                            identity_type_name: {
                                type: "string"
                            }
                        }
                    }
                }
            }
        }

        const validate = ajv.compile(schema);

        const res = await request(app)
            .get(`${base_url}/identity-types`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)

        expect(validate(res.body)).toBeTruthy();
    });

    it('POST: should return 201 status & conform schema', async () => {
        const schema = {
            type: "object",
            properties: {
                status: {
                    type: "string",
                    description: "A identifier success or fail"
                },
                message: {
                    type: "string"
                },
                data: {
                    type: "object",
                    properties: {
                        identity_type_name: {
                            type: "string"
                        }
                    }
                }
            }
        }

        const validate = ajv.compile(schema);

        const res = await request(app)
            .post(`${base_url}/identity-type`)
            .auth(token, { type: 'bearer' })
            .send({
                identity_type_name: 'Management'
            })
            .expect('Content-Type', /json/)
            .expect(201)

        expect(validate(res.body)).toBeTruthy();
    });

    it('PUT: should return 202 status & conform schema', async () => {
        const schema = {
            type: "object",
            properties: {
                status: {
                    type: "string",
                    description: "A identifier success or fail"
                },
                message: {
                    type: "string"
                },
                data: {
                    type: "object",
                    properties: {
                        identity_type_name: {
                            type: "string"
                        }
                    }
                }
            }
        }

        const validate = ajv.compile(schema);

        const res = await request(app)
            .put(`${base_url}/identity-type/3`)
            .auth(token, { type: 'bearer' })
            .send({
                identity_type_name: 'Administration'
            })
            .expect('Content-Type', /json/)
            .expect(202)

        expect(validate(res.body)).toBeTruthy();

    });

    it('DELETE: should return 204', (done) => {
        request(app)
            .delete(`${base_url}/identity-type/3`)
            .auth(token, { type: 'bearer' })
            .expect(204)
            .end(done);
    })
});

describe('users', () => {
    let id;

    it('GET: should return 200 status & conform schema', async () => {
        const schema = {
            type: "object",
            description: "A user account.",
            additionalProperties: false,
            properties: {
                status: {
                    type: "string",
                    description: "A identifier success or fail"
                },
                message: {
                    type: "string"
                },
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string"
                            },
                            email: {
                                type: "string"
                            },
                            name: {
                                type: "string"
                            },
                            address: {
                                type: "string"
                            },
                            identity_type_name: {
                                type: "string"
                            }
                        }
                    }
                }
            }
        }

        const validate = ajv.compile(schema);

        const res = await request(app)
            .get(`${base_url}/users`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)

        user_id = res.body.data[0].id

        expect(validate(res.body)).toBeTruthy();
    });

    it('POST: should return 201 status & conform schema', async () => {
        const schema = {
            type: "object",
            description: "A user account.",
            additionalProperties: false,
            properties: {
                status: {
                    type: "string",
                    description: "A identifier success or fail"
                },
                message: {
                    type: "string"
                },
                data: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string"
                        },
                        email: {
                            type: "string"
                        },
                        name: {
                            type: "string"
                        },
                        profile: {
                            type: "object",
                            properties: {
                                identity_number: {
                                    type: "string"
                                },
                                address: {
                                    type: "string"
                                }
                            }
                        }
                    }
                }
            }
        }

        const validate = ajv.compile(schema);

        const res = await request(app)
            .post(`${base_url}/user`)
            .auth(token, { type: 'bearer' })
            .send({
                name: "noor",
                email: "noor@gmail.com",
                password: "noor",
                identity_type_id: 2,
                identity_number: "1234567890",
                address: "SANTA CLARA, CA"
            })
            .expect('Content-Type', /json/)
            .expect(201)

        id = res.body.data.id

        expect(validate(res.body)).toBeTruthy();
    });

    it('PUT: should return 202 status & conform schema', async () => {
        const schema = {
            type: "object",
            properties: {
                id: {
                    type: "string",
                    description: "The unique identifier for a user."
                },
                name: {
                    type: "string",
                    description: "The name of the user."
                },
                email: {
                    type: "string",
                    description: "The email address of the user."
                },
                profile: {
                    type: "object",
                    properties: {
                        identity_number: {
                            type: "string",
                            description: "The identity number of the user."
                        },
                        address: {
                            type: "string",
                            description: "The address of the user."
                        }
                    }
                }
            }
        }

        const validate = ajv.compile(schema);

        const res = await request(app)
            .put(`${base_url}/user/${id}`)
            .auth(token, { type: 'bearer' })
            .send({
                name: "noor",
                email: "noor@gmail.com",
                password: "noor",
                identity_type_id: 2,
                identity_number: "1234567890",
                address: "SANTA CLARA, CA"
            })
            .expect('Content-Type', /json/)
            .expect(202)

        expect(validate(res.body)).toBeTruthy();
    });

    it('GET-SPECIFIC: should return 200 status & conform schema', async () => {
        const schema = {
            type: "object",
            description: "A user account.",
            additionalProperties: false,
            properties: {
                status: {
                    type: "string",
                    description: "A identifier success or fail"
                },
                message: {
                    type: "string"
                },
                data: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string"
                        },
                        email: {
                            type: "string"
                        },
                        name: {
                            type: "string"
                        },
                        address: {
                            type: "string"
                        },
                        identity_type_name: {
                            type: "string"
                        }
                    }
                }
            }
        }

        const validate = ajv.compile(schema);

        const res = await request(app)
            .get(`${base_url}/user/${id}`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)

        expect(validate(res.body)).toBeTruthy();
    })

    it('DELETE: should return 202 status & conform schema', async () => {
        request(app)
            .delete(`${base_url}/user/${id}`)
            .auth(token, { type: 'bearer' })
            .expect(204)
    });
});

describe('profiles', () => {

    it('GET: should return 200 status & conform schema', async () => {
        const schema = {
            type: "object",
            description: "A user account.",
            additionalProperties: false,
            properties: {
                status: {
                    type: "string",
                    description: "A identifier success or fail"
                },
                message: {
                    type: "string"
                },
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            identity_number: {
                                type: "string"
                            },
                            address: {
                                type: "string"
                            }
                        }
                    }
                }
            }
        }

        const validate = ajv.compile(schema);

        const res = await request(app)
            .get(`${base_url}/profiles`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)

        expect(validate(res.body)).toBeTruthy();
    });

    it('GET-SPECIFIC: should return 200 status & conform schema', async () => {
        const schema = {
            type: "object",
            description: "A user account.",
            additionalProperties: false,
            properties: {
                status: {
                    type: "string",
                    description: "A identifier success or fail"
                },
                message: {
                    type: "string"
                },
                data: {
                    type: "object",
                    properties: {
                        identity_number: {
                            type: "string"
                        },
                        address: {
                            type: "string"
                        }
                    }
                }
            }
        }

        const validate = ajv.compile(schema);

        const res = await request(app)
            .get(`${base_url}/profile/1`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)

        expect(validate(res.body)).toBeTruthy();
    })
})

describe('transaction-types', () => {

    it('GET: should return 200 status & conform schema', async () => {
        const schema = {
            type: "object",
            description: "List of transaction types data",
            additionalProperties: false,
            properties: {
                status: {
                    type: "string",
                    description: "A identifier success or fail"
                },
                message: {
                    type: "string"
                },
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: {
                                type: "number"
                            },
                            transaction_type_name: {
                                type: "string"
                            }
                        }
                    }
                }
            }
        }

        const validate = ajv.compile(schema);

        const res = await request(app)
            .get(`${base_url}/transaction-types`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)

        expect(validate(res.body)).toBeTruthy();
    });

    it('POST: should return 201 status & conform schema', async () => {
        const schema = {
            type: "object",
            description: "A transaction type data.",
            additionalProperties: false,
            properties: {
                status: {
                    type: "string",
                    description: "A identifier success or fail"
                },
                message: {
                    type: "string"
                },
                data: {
                    type: "object",
                    properties: {
                        transaction_type_name: {
                            type: "string"
                        }
                    }
                }
            }
        }

        const validate = ajv.compile(schema);

        const res = await request(app)
            .post(`${base_url}/transaction-type`)
            .auth(token, { type: 'bearer' })
            .send({
                transaction_type_name: 'test'
            })
            .expect('Content-Type', /json/)
            .expect(201)

        expect(validate(res.body)).toBeTruthy();
    })

    it('PUT: should return 202 status & conform schema', async () => {
        const schema = {
            type: "object",
            description: "A transaction type data.",
            additionalProperties: false,
            properties: {
                status: {
                    type: "string",
                    description: "A identifier success or fail"
                },
                message: {
                    type: "string"
                },
                data: {
                    type: "object",
                    properties: {
                        transaction_type_name: {
                            type: "string"
                        }
                    }
                }
            }
        }

        const validate = ajv.compile(schema);

        const res = await request(app)
            .put(`${base_url}/transaction-type/4`)
            .auth(token, { type: 'bearer' })
            .send({
                transaction_type_name: 'test-changing'
            })
            .expect('Content-Type', /json/)
            .expect(202)

        expect(validate(res.body)).toBeTruthy();

    })

    it('DELETE: should return 204', async () => {
        request(app)
            .delete(`${base_url}/transaction-type/4`)
            .auth(token, { type: 'bearer' })
            .expect(204)
    })
})

describe('accounts', () => {
    let temp_id;
    let id;

    it('GET: should return 200 status & conform schema', async () => {
        const schema = {
            type: "object",
            description: "A user account.",
            additionalProperties: false,
            properties: {
                status: {
                    type: "string",
                    description: "A identifier success or fail"
                },
                message: {
                    type: "string"
                },
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string"
                            },
                            bank_name: {
                                type: "string"
                            },
                            bank_account_number: {
                                type: "string"
                            },
                            balance: {
                                type: "number"
                            },
                            created_at: {
                                type: "string"
                            }
                        }
                    }
                }
            }
        }

        const validate = ajv.compile(schema);

        const res = await request(app)
            .get(`${base_url}/accounts`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)

        id = res.body.data[0].id
        account_id = res.body.data[0].id
        source_account_id = res.body.data[0].id
        destination_account_id = res.body.data[1].id

        expect(validate(res.body)).toBeTruthy();
    })

    it('POST: should return 201 status & conform schema', async () => {
        const schema = {
            type: "object",
            additionalProperties: false,
            properties: {
                status: {
                    type: "string",
                    description: "A identifier success or fail"
                },
                message: {
                    type: "string"
                },
                data: {
                    type: "object",
                    properties: {
                        user_id: {
                            type: "string"
                        },
                        bank_name: {
                            type: "string"
                        },
                        bank_account_number: {
                            type: "string"
                        },
                        balance: {
                            type: "number"
                        },
                        created_at: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                }
            }
        }

        const validate = ajv.compile(schema, { format: "date-time" });

        const res = await request(app)
            .post(`${base_url}/account`)
            .auth(token, { type: 'bearer' })
            .send({
                user_id: user_id,
                bank_name: 'test',
                bank_account_number: 'test',
                balance: 0
            })
            .expect('Content-Type', /json/)
            .expect(201)

        temp_id = res.body.data.id

        expect(validate(res.body)).toBeTruthy();
    })

    it('PUT: should return 202 status & conform schema', async () => {
        const schema = {
            type: "object",
            additionalProperties: false,
            properties: {
                status: {
                    type: "string",
                    description: "A identifier success or fail"
                },
                message: {
                    type: "string"
                },
                data: {
                    type: "object",
                    properties: {
                        user_id: {
                            type: "string"
                        },
                        bank_name: {
                            type: "string"
                        },
                        bank_account_number: {
                            type: "string"
                        },
                        balance: {
                            type: "number"
                        },
                        created_at: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                }
            }
        }

        const validate = ajv.compile(schema, { format: "date-time" });

        const res = await request(app)
            .put(`${base_url}/account/${temp_id}`)
            .auth(token, { type: 'bearer' })
            .send({
                user_id: user_id,
                bank_name: 'tester',
                bank_account_number: 'test',
                balance: 0
            })
            .expect('Content-Type', /json/)
            .expect(202)

        expect(validate(res.body)).toBeTruthy();
    });

    it('DELETE: should return 204', (done) => {
        request(app)
            .delete(`${base_url}/account/${temp_id}`)
            .auth(token, { type: 'bearer' })
            .expect(204)
            .end(done)
    })

    it('GET-SPECIFIC: should return 200 status & conform schema', async () => {
        const schema = {
            type: "object",
            description: "A user account.",
            additionalProperties: false,
            properties: {
                status: {
                    type: "string",
                    description: "A identifier success or fail"
                },
                message: {
                    type: "string"
                },
                data: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string"
                        },
                        bank_name: {
                            type: "string"
                        },
                        bank_account_number: {
                            type: "string"
                        },
                        balance: {
                            type: "number"
                        },
                        created_at: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                }
            }
        }

        const validate = ajv.compile(schema, { format: "date-time" });

        const res = await request(app)
            .get(`${base_url}/account/${id}`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)

        expect(validate(res.body)).toBeTruthy();
    })
})

describe('transaction', () => {

    let deposit_id, withdraw_id, transfer_id;
    let deposit_account_id, withdraw_account_id, sender_id, recepient_id;

    it('POST-deposit: should return 201 status & conform schema', async () => {
        const schema = {
            type: "object",
            properties: {
                status: { type: "string" },
                message: { type: "string" },
                data: {
                    type: "array",
                    minItems: 2,
                    items: {
                        type: "object"
                    }
                }
            }
        }

        const validate = ajv.compile(schema);

        const res = await request(app)
            .post(`${base_url}/transactions/deposit`)
            .auth(token, { type: 'bearer' })
            .send({
                destination_account_id: account_id,
                transaction_type_id: 1,
                amount: 100
            })
            .expect('Content-Type', /json/)
            .expect(201)

        deposit_id = res.body.data[0].id
        deposit_account_id = res.body.data[0].account_id

        expect(validate(res.body)).toBeTruthy();
    })

    it('POST-withdraw: should return 201 status & conform schema', async () => {
        const schema = {
            type: "object",
            description: "A transaction data.",
            additionalProperties: false,
            properties: {
                status: {
                    type: "string",
                    description: "A identifier success or fail"
                },
                message: {
                    type: "string"
                },
                data: {
                    type: "object",
                    properties: {
                        account: {
                            type: "object",
                            properties: {
                                id: {
                                    type: "string"
                                },
                                user_id: {
                                    type: "string"
                                },
                                bank_name: {
                                    type: "string"
                                },
                                bank_account_number: {
                                    type: "string"
                                },
                                balance: {
                                    type: "number"
                                },
                                created_at: {
                                    type: "string",
                                    format: "date-time"
                                }
                            }
                        },
                        transaction: {
                            type: "object",
                            properties: {
                                id: {
                                    type: "string"
                                },
                                amount: {
                                    type: "number"
                                },
                                date: {
                                    type: "string",
                                    format: "date-time"
                                },
                                source_account_id: {
                                    type: "string"
                                },
                                transaction_type: {
                                    type: "object",
                                    properties: {
                                        transaction_type_name: {
                                            type: "string"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        const validate = ajv.compile(schema, { format: "date-time" });

        const res = await request(app)
            .post(`${base_url}/transactions/withdraw`)
            .auth(token, { type: 'bearer' })
            .send({
                source_account_id: account_id,
                transaction_type_id: 2,
                amount: 100
            })
            .expect('Content-Type', /json/)
            .expect(201)

        withdraw_id = res.body.data.transaction.id
        withdraw_account_id = res.body.data.account.id

        expect(validate(res.body)).toBeTruthy();
    })

    it('POST-transfer: should return 201 status & conform schema', async () => {
        const schema = {
            type: "object",
            description: "A transaction data.",
            additionalProperties: false,
            properties: {
                status: {
                    type: "string",
                    description: "A identifier success or fail"
                },
                message: {
                    type: "string"
                },
                data: {
                    type: "object",
                    properties: {
                        sender: {
                            type: "object",
                            properties: {
                                id: {
                                    type: "string"
                                },
                                user_id: {
                                    type: "string"
                                },
                                bank_name: {
                                    type: "string"
                                },
                                bank_account_number: {
                                    type: "string"
                                },
                                balance: {
                                    type: "number"
                                },
                                created_at: {
                                    type: "string",
                                    format: "date-time"
                                }
                            }
                        },
                        recepient: {
                            type: "object",
                            properties: {
                                id: {
                                    type: "string"
                                },
                                amount: {
                                    type: "number"
                                },
                                date: {
                                    type: "string",
                                    format: "date-time"
                                },
                                source_account_id: {
                                    type: "string"
                                },
                                transaction_type: {
                                    type: "object",
                                    properties: {
                                        transaction_type_name: {
                                            type: "string"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        const validate = ajv.compile(schema, { format: "date-time" });

        const res = await request(app)
            .post(`${base_url}/transactions/transfer`)
            .auth(token, { type: 'bearer' })
            .send({
                source_account_id: source_account_id,
                destination_account_id: destination_account_id,
                transaction_type_id: 3,
                amount: 100
            })
            .expect('Content-Type', /json/)
            .expect(201)

        sender_id = res.body.data.sender.id
        recepient_id = res.body.data.recepient.id

        expect(validate(res.body)).toBeTruthy();
    })

    it('GET-deposit-by-user_id: should return 200 status & conform schema', async () => {
        const schema = {
            type: "object",
            description: "A transaction data.",
            additionalProperties: false,
            properties: {
                status: {
                    type: "string",
                    description: "A identifier success or fail"
                },
                message: {
                    type: "string"
                },
                data: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string"
                        },
                        account_id: {
                            type: "string"
                        },
                        amount: {
                            type: "number"
                        },
                        created_at: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                }
            }
        }

        const validate = ajv.compile(schema, { format: "date-time" });

        const res = await request(app)
            .get(`${base_url}/transactions/deposits/${deposit_account_id}`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)

        expect(validate(res.body)).toBeTruthy();
    })

    it('GET-deposit-by-id: should return 200 status & conform schema', async () => {
        const schema = {
            type: "object",
            description: "A transaction data.",
            additionalProperties: false,
            properties: {
                status: {
                    type: "string",
                    description: "A identifier success or fail"
                },
                message: {
                    type: "string"
                },
                data: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string"
                        },
                        amount: {
                            type: "number"
                        },
                        date: {
                            type: "string",
                            format: "date-time"
                        },
                        transaction_type: {
                            type: "object",
                            properties: {
                                transaction_type_name: {
                                    type: "string"
                                }
                            }
                        }
                    }
                }
            }
        }

        const validate = ajv.compile(schema, { format: "date-time" });

        const res = await request(app)
            .get(`${base_url}/transactions/deposit/${deposit_id}`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)

        expect(validate(res.body)).toBeTruthy();
    })

    it('GET-withdraw-by-user_id: should return 200 status & conform schema', async () => {
        const schema = {
            type: "object",
            description: "A transaction data.",
            additionalProperties: false,
            properties: {
                status: {
                    type: "string",
                    description: "A identifier success or fail"
                },
                message: {
                    type: "string"
                },
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string"
                            },
                            amount: {
                                type: "number"
                            },
                            date: {
                                type: "string",
                                format: "date-time"
                            },
                            source_account_id: {
                                type: "string"
                            },
                            transaction_type: {
                                type: "object",
                                properties: {
                                    transaction_type_name: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        const validate = ajv.compile(schema, { format: "date-time" });

        const res = await request(app)
            .get(`${base_url}/transactions/withdraws/${withdraw_account_id}`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)

        expect(validate(res.body)).toBeTruthy();
    })

    it('GET-withdraw-by-id: should return 200 status & conform schema', async () => {
        const schema = {
            type: "object",
            description: "A transaction data.",
            additionalProperties: false,
            properties: {
                status: {
                    type: "string",
                    description: "A identifier success or fail"
                },
                message: {
                    type: "string"
                },
                data: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string"
                        },
                        amount: {
                            type: "number"
                        },
                        date: {
                            type: "string",
                            format: "date-time"
                        },
                        source_account_id: {
                            type: "string"
                        },
                        transaction_type: {
                            type: "object",
                            properties: {
                                transaction_type_name: {
                                    type: "string"
                                }
                            }
                        }
                    }
                }
            }
        }

        const validate = ajv.compile(schema, { format: "date-time" });

        const res = await request(app)
            .get(`${base_url}/transactions/withdraw/${withdraw_id}`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)

        expect(validate(res.body)).toBeTruthy();
    })

    it('GET-transfer-sender: should return 200 status & conform schema', async () => {
        const schema = {
            type: "object",
            description: "A transaction data.",
            additionalProperties: false,
            properties: {
                status: {
                    type: "string",
                    description: "A identifier success or fail"
                },
                message: {
                    type: "string"
                },
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string"
                            },
                            email: {
                                type: "string"
                            },
                            name: {
                                type: "string"
                            },
                            source_account_id: {
                                type: "string"
                            },
                            bank_name: {
                                type: "string"
                            },
                            amount: {
                                type: "number"
                            },
                            date: {
                                type: "string",
                                format: "date-time"
                            },
                            transaction_type: {
                                type: "object",
                                properties: {
                                    transaction_type_name: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        const validate = ajv.compile(schema, { format: "date-time" });

        const res = await request(app)
            .get(`${base_url}/transactions/transfers/sender/${sender_id}`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)

        expect(validate(res.body)).toBeTruthy();
    })

    it('GET-transfer-recepient: should return 200 status & conform schema', async () => {
        const schema = {
            type: "object",
            description: "A transaction data.",
            additionalProperties: false,
            properties: {
                status: {
                    type: "string",
                    description: "A identifier success or fail"
                },
                message: {
                    type: "string"
                },
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string"
                            },
                            email: {
                                type: "string"
                            },
                            name: {
                                type: "string"
                            },
                            destination_account_id: {
                                type: "string"
                            },
                            bank_name: {
                                type: "string"
                            },
                            amount: {
                                type: "number"
                            },
                            date: {
                                type: "string",
                                format: "date-time"
                            }
                        }
                    }
                }
            }
        }

        const validate = ajv.compile(schema, { format: "date-time" });

        const res = await request(app)
            .get(`${base_url}/transactions/transfers/recepient/${recepient_id}`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)
        transfer_id = res.body.data[0].id
        expect(validate(res.body)).toBeTruthy();
    })

    it('GET-transfer-by-id: should return 200 status & conform schema', async () => {
        const schema = {
            type: "object",
            description: "A transaction data.",
            additionalProperties: false,
            properties: {
                status: {
                    type: "string",
                    description: "A identifier success or fail"
                },
                message: {
                    type: "string"
                },
                data: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string"
                        },
                        amount: {
                            type: "number"
                        },
                        date: {
                            type: "string",
                            format: "date-time"
                        },
                        source_account_id: {
                            type: "string"
                        },
                        destination_account_id: {
                            type: "string"
                        },
                        transaction_type: {
                            type: "object",
                            properties: {
                                transaction_type_name: {
                                    type: "string"
                                }
                            }
                        }
                    }
                }
            }
        }

        const validate = ajv.compile(schema, { format: "date-time" });

        const res = await request(app)
            .get(`${base_url}/transactions/transfer/${transfer_id}`)
            .auth(token, { type: 'bearer' })
            .expect('Content-Type', /json/)
            .expect(200)
            
        expect(validate(res.body)).toBeTruthy();
    })
})