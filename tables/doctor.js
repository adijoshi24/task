const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const doctorCSV = createCsvWriter({
    path: 'doctor.csv',
    header: [
        {id: 'id', title: 'ID'},
        {id: 'doctorname', title: 'NAME'}
    ]
});
 
const records = [
    {id: '1', doctorname: 'Dr. Mohan Lal'},
    {id: '2', doctorname: 'Dr. Sohan Lal'}
];
 
doctorCSV.writeRecords(records)       // returns a promise
    .then(() => {
        console.log('Doctor CSV Done');
    });



module.exports = doctorCSV;