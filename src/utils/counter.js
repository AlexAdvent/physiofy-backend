const Counter = require('../models/utils/counter');

async function getNextSequence (modelName, fieldName) {


    // TODO: add transaction lock
    let ret = await Counter.findOne({
        modelName: modelName,
        fieldName: fieldName,
    })
    // console.log("ret", ret);

    if (!ret) {
        ret = await Counter.create({
            modelName: modelName,
            fieldName: fieldName,
            seq: 2,
        })
        return 1;
    }

    if ( fieldName == "tokenNo" ) {
        // reset to 1 at each day
        let today = new Date();
        let today_str = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
        console.log("today_str", today_str);
        let today_date = new Date(today_str);
        let today_date_str = today_date.getTime();
        let ret_date_str = ret.updatedAt.getTime();

        console.log("today_date_str", today_date_str);
        console.log("ret_date_str", ret_date_str);
        console.log("today_date_str - ret_date_str", today_date_str - ret_date_str);

        if ( today_date_str > ret_date_str ) {
            ret = await Counter.findOneAndUpdate(
                { 
                    modelName: modelName,
                    fieldName: fieldName
                },
                { $set: { seq: 2 } },
            );
            return 1;
        }
    }

    ret = await Counter.findOneAndUpdate(
        { 
            modelName: modelName,
            fieldName: fieldName
        },
        { $inc: { seq: 1 } },
    );
    // console.log("ret final", ret);
    return ret.seq;
 }

 module.exports = getNextSequence;