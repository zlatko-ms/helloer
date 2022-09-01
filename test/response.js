
require('module-alias/register')

var expect = require("chai").expect;
var { responseBuilder }  = require('@util/response.js');
var httpMocks = require('node-mocks-http');

const localhost = "127.0.0.1"
const unknown = "unknown"

describe("Response Builder", function() {
    describe("Source Address Fetching", function() {
      it("returns 'unknown' if source address cannot be fetched", () => {
        var request  = httpMocks.createRequest({});
        var responsePayload = responseBuilder(request);
        expect(responsePayload.request_source_ip).to.equal(unknown)
      });
      it("fetches the source address from request header map", () => {
        var request  = httpMocks.createRequest({
            headers : {
                'x-forwarded-for' : localhost
            }
        });
        var responsePayload = responseBuilder(request);
        expect(responsePayload.request_source_ip).to.equal(localhost)

      });
      it("feches the source address from the request socket map", () =>  {
        var request  = httpMocks.createRequest({
           
            socket : {
                'remoteAddress' : localhost
            }
        });
        var responsePayload = responseBuilder(request);
        expect(responsePayload.request_source_ip).to.equal(localhost)
      });
      
    });
  

  });