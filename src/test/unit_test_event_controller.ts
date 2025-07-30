import { expect } from 'chai';
import sinon from 'sinon';
import { EventController } from '../src/autor/infrastructure/controllers/EventController';
import { describe } from 'node:test';

describe('EventController', () => {
  let eventController: EventController;
  let mockRequest: any;
  let mockResponse: any;

  beforeEach(() => {
    eventController = new EventController();
    mockRequest = {
      body: {},
      params: {},
    };
    mockResponse = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
  });

  it('should create an event successfully', async () => {
    mockRequest.body = {
      name: 'Test Event',
      date: '2025-12-31',
      description: 'Test event description',
    };

    await eventController.createEvent(mockRequest, mockResponse);

    expect(mockResponse.status.calledWith(201)).to.be.true;
    expect(mockResponse.json.calledWith({ message: 'Event created successfully' })).to.be.true;
  });

  it('should handle event creation error', async () => {
    mockRequest.body = {
      name: '',
      date: '',
    };

    await eventController.createEvent(mockRequest, mockResponse);

    expect(mockResponse.status.calledWith(400)).to.be.true;
    expect(mockResponse.json.calledWith({ error: 'Invalid event data' })).to.be.true;
  });

  it('should get all events successfully', async () => {
    await eventController.getAllEvents(mockRequest, mockResponse);

    expect(mockResponse.status.calledWith(200)).to.be.true;
    expect(mockResponse.json.called).to.be.true;
  });

  it('should get event by ID successfully', async () => {
    mockRequest.params.id = '1';

    await eventController.getEventById(mockRequest, mockResponse);

    expect(mockResponse.status.calledWith(200)).to.be.true;
    expect(mockResponse.json.called).to.be.true;
  });
});

