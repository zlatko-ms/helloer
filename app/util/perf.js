

const { Logger } = require('@util/logger.js');
var format = require('date-format');
const { loggers } = require('winston');

const dateFormat = 'yyyyMMddhhmm'

let ServicePerfRecord = class {

    constructor(start, end, count) {
      this.startDate = start
      this.endDate = end
      this.avgRps = count
    }
  
    set startDate(date) { this._startDate = date }
    get startDate() { return this._startDate }
 
    get endDate() { return this._endDate }
    set endDate(date) { this._endDate = date }
 
    get avgRps() { return this._avgHitsPerSecond }
    set avgRps(val) { this._avgHitsPerSecond = val }
}
  


let ServicePerfTracker = class {
  
    constructor(serviceName) {
      this._serviceName = serviceName
      this._records = new Map()
    }
  
    addHit(date = new Date()) {
      let key = format.asString(dateFormat, date);
      var hits = this._records.has(key) ? this._records.get(key) : 0
      hits++
      this._records.set(key, hits)
      this._purgeOldRecords()
    }
  
    _purgeOldRecords(hours = 2) {
      var keysToRemove = new Set()
      var lastDateToKeep = new Date()
      lastDateToKeep.setHours(lastDateToKeep.getHours() - hours)
      let lastDateToKeepString = format.asString(dateFormat, lastDateToKeep);
      let lastDateToKeepAsInt = parseInt(lastDateToKeepString)
      this._records.forEach((value, key) => {
        if (parseInt(key) <= lastDateToKeepAsInt) {
          keysToRemove.add(key)
        }
      })
      keysToRemove.forEach(k => {
        this._records.delete(k)
      });
    }
  
    getServicePerfRecord() {

      var datesArray = []
      var hits = 0;
      this._records.forEach((v, k) => {
        var keyDate = format.parse(dateFormat, k)
        datesArray.push(keyDate)
        hits += v
      })
  
      let minutesCount = datesArray.length
      if (minutesCount>0) {

        datesArray.sort((a, b) => {return a - b})
        var avgHits = hits / (minutesCount * 60)
      
        var startDate = datesArray[0]
        startDate.setSeconds(0)
        startDate.setMilliseconds(0)
      
        var endDate = datesArray.pop()
        endDate.setSeconds(0)
        endDate.setMilliseconds(0)
        
        return new ServicePerfRecord(startDate, endDate, avgHits)
      }

      return new ServicePerfRecord(new Date, new Date, Number.NaN);
    }

    getIndicatorHistory() {
        return new Map([...this._records].sort((a, b) => String(a[0]).localeCompare(b[0])))
    }

  }

  let PerformanceTracker = class {
  
    constructor() {
      this._serviceTrackers = new Map()
    }
  
    addHit(serviceName, date = new Date) {
      var svcTracker = this._serviceTrackers.has(serviceName) ? this._serviceTrackers.get(serviceName) : new ServicePerfTracker(serviceName)
      svcTracker.addHit(date)
      this._serviceTrackers.set(serviceName, svcTracker)
    }
  
    getServicePerfRecord(serviceName) {
      var svcTracker = this._serviceTrackers.has(serviceName) ? this._serviceTrackers.get(serviceName) : new ServicePerfTracker(serviceName)
      return svcTracker.getServicePerfRecord()
    }

    getTrackedServices() {
        return new Set(this._serviceTrackers.keys())
    }

    getAggRps() {
        
        var totalHits = 0
        this._serviceTrackers.forEach( (v,k) => {
            let serviceRecord = v.getServicePerfRecord()
            totalHits+=serviceRecord.avgRps
        })
        return totalHits;
    }

    getServiceBreakdown() {
        var ret = new Map()
        this._serviceTrackers.forEach( (v,k) => { ret[k]=v.getServicePerfRecord() });
        return ret;
    }
  
  }



var BackendPerformanceTracker = new PerformanceTracker()

module.exports = { ServicePerfRecord , ServicePerfTracker ,  PerformanceTracker, BackendPerformanceTracker }
