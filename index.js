const AWS = require('aws-sdk');
const DNS = require('dns');
AWS.config.update({region: 'us-east-2'});
if(process.env.environment != "AWS") {
  const myCredentials = new AWS.SharedIniFileCredentials({profile: 'prod'});
  AWS.config.update({credentials: myCredentials});
}
const rds = new AWS.RDS();
const route53 = new AWS.Route53();
const zoneID = "ZXE5WWL1RNVM2";

function getDbInfo() {
  return new Promise(function(resolve, reject) {
    rds.describeDBInstances(params = {}, (err, data) => {
      if(err) {
        reject(err);
      }

      else {
        resolve(data);
      }
    });
  });
}

function getDNS(dbObject) {
  return new Promise((resolve, reject) => {
    let endpoint = dbObject.address;
    DNS.lookup(endpoint, (err, address, family) => {
      if(err) {
        reject(err);
      }

      else {
        resolve(address);
      }

    });
  });
}

function updateDNS(name, address) {
  return new Promise((resolve, reject) => {
    let params = {
      ChangeBatch: {
        Changes: [
          {
            Action: "UPSERT",
            ResourceRecordSet: {
              Name: name + ".iqity.org",
              ResourceRecords: [
                {
                  Value: address
                }
              ],
              TTL: 60,
              Type: "A"
            }
          }
        ],
      },
      HostedZoneId: zoneID
    };

    route53.changeResourceRecordSets(params, (err, data) => {
      if(err) {
        reject(err);
      }

      else {
        resolve(data);
      }
    });
  });
}

getDbInfo().then((data) => {
  let dbInstances = data.DBInstances;
  let dbObjects = [];
  dbInstances.forEach((el) => {
    let dbObject = {};
    dbObject.name = el.DBInstanceIdentifier;
    dbObject.address = el.Endpoint.Address;
    dbObjects.push(dbObject);
  });
  dbObjects.forEach((el) => {
    getDNS(el).then((address) => {
      updateDNS(el.name, address).then((res) => {
        console.log("DNS Update succeeded for " + el.name);
      }).catch((err) => {
        console.log(err);
      });
    }).catch((err) => {
      console.log(err);
    });
  });
}).catch((err) => {
  console.log(err);
});
