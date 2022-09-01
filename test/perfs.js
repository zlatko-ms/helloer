require('module-alias/register')

var assert = require("chai").assert
var { ServicePerfRecord }  = require('@util/perf.js');
const { Logger } = require('@util/logger.js');
const { ServicePerfTracker, PerformanceTracker } = require('@util/perf.js');

function assertDatesMatchToMinutes(date1,date2) {
  assert.equal(date1.getFullYear(),date2.getFullYear(),"years match")
  assert.equal(date1.getMonth(),date2.getMonth(),"months match")
  assert.equal(date1.getDay(),date2.getDay(),"days match")
  assert.equal(date1.getHours(),date2.getHours(),"hours match")
  assert.equal(date1.getMinutes(),date2.getMinutes(),"minutes match")
}

describe("Performance Tracking", function() {

    describe("Single Service Performance Tracker", () => {

      it("service hits are correctly aggregated and summed on the time dimension", () => {
  
        let now = new Date();
        const numberOfHits = 60

        let spt = new ServicePerfTracker("svc/a")
        for (let i = 0; i < numberOfHits; i++) { spt.addHit(now) }
  
        let perfRecord = spt.getServicePerfRecord()
        assert.equal(perfRecord.avgRps,1,"average is correctly computed")
        assertDatesMatchToMinutes(perfRecord.startDate,now)
        assertDatesMatchToMinutes(perfRecord.endDate,now)
  
      });
      
      it("non tracked services provide a NaN as metric", () => {
        let spt = new ServicePerfTracker("whatever")
        assert.equal(isNaN(spt.getServicePerfRecord().avgRps),true,"non tracked returned NaN as average")
      });

      
      it("old service hits are correctly purged", () => {
  
        var then = new Date();
        then.setHours(then.getHours() - 5)
  
        let spt = new ServicePerfTracker("whatever")
        for (let i = 0; i < 60; i++) { spt.addHit(then) }
  
        // then check that the data exceending the purge treshold are removed 
        let avgHits = spt.getServicePerfRecord()
        assert.isTrue(isNaN(avgHits.avgRps),"old entries are correctly purged")
  
        var now = new Date()
        assertDatesMatchToMinutes(avgHits.startDate,now)
        assertDatesMatchToMinutes(avgHits.endDate,now)

      });

      it("history of hits is correctly exposed", () => {
       
        let now = new Date();
        
        let aMinuteAgo = new Date()
        aMinuteAgo.setMinutes( aMinuteAgo.getMinutes - 1)

        let spt = new ServicePerfTracker("whatever")
        spt.addHit(aMinuteAgo)
        spt.addHit(now)
        assert.equal(spt.getIndicatorHistory().size,2,"two hits in two distinct minutes produce two history perf records")

      }); 
  
  
    });

    describe("Global Services Performance Tracker", () => {
       
        it("multiple service hits are tracked", () => {
            let gt = new PerformanceTracker()
            gt.addHit("svc/a")
            gt.addHit("svc/b")
            let services = new Set(gt.getTrackedServices())
            assert.isTrue(services.has("svc/a"),"service a has a hit")
            assert.isTrue(services.has("svc/b"),"service b has a hit")
        });

        it("multiple service hits are correctly computed on RPS level", () => {

            let gt = new PerformanceTracker()
            let svcA = 60
            let svcB = 120

            for (let i=0;i<svcA;i++) { gt.addHit("svc/a") }

            for (let i=0;i<svcB;i++) { gt.addHit("svc/b") }

            assert.equal(gt.getServicePerfRecord("svc/a").avgRps,1,"avg rps for service a is correct")
            assert.equal(gt.getServicePerfRecord("svc/b").avgRps,2,"avg rps for service b is correct")
        });

        it("global rps metric is correctly aggregated", () => {
            let gt = new PerformanceTracker()
            let svcA = 60
            let svcB = 120

            for (let i=0;i<svcA;i++) { gt.addHit("svc/a") }
            for (let i=0;i<svcB;i++) { gt.addHit("svc/b") }
            
            assert.equal(gt.getAggRps(),3,"average global rps is correct")
        });

        it("global service perf history summary is provided", () => {

            let now = new Date()
            let gt = new PerformanceTracker()
            gt.addHit("svc/a",now) 
            gt.addHit("svc/b",now) 

            let serviceBreakdown = gt.getServiceBreakdown()

            assert.isDefined(serviceBreakdown['svc/a'],"svc/a has perf tracker entry")
            assert.isDefined(serviceBreakdown['svc/b'],"svc/b has perf tracker entry ")
            
            let svcARecord = serviceBreakdown['svc/a']
            let svcBRecord = serviceBreakdown['svc/a']

            assert.isTrue(ServicePerfRecord.prototype.isPrototypeOf(svcARecord),"svc/a perf tracker is of the correct class")
            assert.isTrue(ServicePerfRecord.prototype.isPrototypeOf(svcBRecord),"svc/b perf tracker is of the correct class")
            
            assert.isDefined(svcARecord.startDate,"svc/a perf record has start date")
            assert.isDefined(svcARecord.endDate,"svc/a perf record has end date")
            assert.isDefined(svcBRecord.startDate,"svc/b perf record has start date")
            assert.isDefined(svcBRecord.endDate,"svc/b perf record has ebd date")

            assertDatesMatchToMinutes(svcARecord.startDate,now)
           
            assert.isDefined(serviceBreakdown['svc/a'],"service a breakdown is available")
            assert.isDefined(serviceBreakdown['svc/a'].startDate,"service a startdate is available")
            assertDatesMatchToMinutes(serviceBreakdown['svc/a'].startDate,now,"service a startdate is correct")

            assert.isDefined(serviceBreakdown['svc/b'],"service b breakdown is available")
            assert.isDefined(serviceBreakdown['svc/b'].startDate,"service b startdate is available")
            assertDatesMatchToMinutes(serviceBreakdown['svc/b'].startDate,now,"service b startdate is correct")
            
        });




    });
  });
