import { expect } from 'chai';
import sinon from 'sinon';
import { UserController } from '../src/autor/infrastructure/controllers/UserController';

describe('UserController', () => {
  let userController: UserController;
  let mockRequest: any;
  let mockResponse: any;

  beforeEach(() => {
    userController = new UserController();
    mockRequest = {
      body: {},
      params: {},
    };
    mockResponse = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
  });

  it('should create a user successfully', async () => {
    mockRequest.body = {
      username: 'testuser',
      password: 'testpassword',
    };

    await userController.createUser(mockRequest, mockResponse);

    expect(mockResponse.status.calledWith(201)).to.be.true;
    expect(mockResponse.json.calledWith({ message: 'User created successfully' })).to.be.true;
  });

  it('should handle user creation error', async () => {
    mockRequest.body = {
      username: '',
      password: '',
    };

    await userController.createUser(mockRequest, mockResponse);

    expect(mockResponse.status.calledWith(400)).to.be.true;
    expect(mockResponse.json.calledWith({ error: 'Invalid user data' })).to.be.true;
  });

  it('should login user successfully', async () => {
    mockRequest.body = {
      username: 'testuser',
      password: 'testpassword',
    };

    await userController.login(mockRequest, mockResponse);

    expect(mockResponse.status.calledWith(200)).to.be.true;
    expect(mockResponse.json.calledWith({ message: 'Login successful' })).to.be.true;
  });
});

