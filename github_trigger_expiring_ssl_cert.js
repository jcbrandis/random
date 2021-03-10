// ** Event = SSL_OPEN
// ** Assignment = SSL Servers or worst case, SSL Server Activity
// ** Add your certificate subjetcs to the dictionary, observing formatting.
// ** Creates device level metrics which act as a tag, for the purpose of alerting
// ** ** 10Day_SSL_Expiration_Metric & 20Day_SSL_Expiration_Metric
// ** This trigger is not officially supported
//
const dictionary = [
    'reddit.com',
    'badssl.com',
    '*.badssl.com',
    'expired.badssl.com',
    'nsw.gov.au'
];
// ==================== No need to modify the below ================== //
//
var now = Date.now() / 1000; // for testing purposes only 
var epochNow = Date.now() / 1000;
//
var ThirtyAdvanceDaysNotice = 30;
var TwentyAdvanceDaysNotice = 20;
var TenAdvanceDaysNotice = 10;
var FiveAdvanceDaysNotice = 5; //This will be used only in testing, for prod use only 10 & 20
var certificato = SSL.certificates[0];
//
let ThirtyLongerEpoch = epochNow + (ThirtyAdvanceDaysNotice *24*60*60);
let TwentyLongerEpoch = epochNow + (TenAdvanceDaysNotice *24*60*60);
let TenLongerEpoch = epochNow + (TenAdvanceDaysNotice *24*60*60);
let FiveLongerEpoch = epochNow + (FiveAdvanceDaysNotice *24*60*60);
//
if (certificato != null) {
    var certificato_subject = certificato.subject;
    var certificato_expiry = certificato.notAfter;
    //
    for (let a = 0; a < dictionary.length; a++) {
        var temp_dictionary = dictionary[a];
        //
        if (certificato_subject.includes(temp_dictionary)) {
            if (certificato_expiry <= TenLongerEpoch) {
                Device.metricAddCount("10Day_SSL_Expiration_Metric", 1);
                Device.metricAddDetailDataset("10Day_SSL_Expiration_Metric.Cert_Expiry.by_Certificate", certificato_subject, certificato_expiry);
                debug("(prod_alert) Cert: " +certificato_subject + " | Expired: " + certificato_expiry + " | Now: " + now + " | 10Epoc: " +TenLongerEpoch);
            } else {
                if (certificato_expiry <= TwentyLongerEpoch) {
                    Device.metricAddCount("20Day_SSL_Expiration_Metric", 1);
                    Device.metricAddDetailDataset("20Day_SSL_Expiration_Metric.Cert_Expiry.by_Certificate", certificato_subject, certificato_expiry);
                    debug("(prod_alert) Cert: " +certificato_subject + " | Expired: " + certificato_expiry + " | Now: " + now + " | 20Epoc: " +TwentyLongerEpoch);
                }
            }
        }
    }
}