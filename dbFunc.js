var dbUrl=process.env.SET_MONGOLAB_URI;  
var mongo = require('mongodb').MongoClient

module.exports = {
  getLatestSearch: function(callback){
    mongo.connect(dbUrl,function(err,db){
      var coll=db.collection('image-search');
      if (err) throw err;
      coll.find({},{_id:0}).sort( { _id: -1 } ).toArray(function(err, items) {
        if (err) throw callback(err,null);
          callback(null,items)
          db.close()
      });
    })
  },
  saveSearch: function(searchWord){
    var newDoc={"term": searchWord,
                "when": this.timeConverter(new Date().getTime() / 1000)
               }
    mongo.connect(dbUrl,function(err,db){
      var coll=db.collection('image-search');
      if (err) throw err;
      coll.insert(newDoc,function(err,result){
        if (err) throw err;
          coll.find({}, {_id:1,when:1}).limit(1).toArray(function(err, item) {
            coll.remove({_id:item[0]['_id']},function(err,res){
              if (err) throw err;
              db.close()
            })
          })
      })
    })

  },
  timeConverter: function(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var year = a.getFullYear();
    var month = a.getMonth()+1;
    var date = a.getDate();
    var sec=a.getSeconds()
    var min=a.getMinutes()
    var hour=a.getHours()
    var time = year + '-' + month + '-' + date+ ',' +hour+ ':' +min+ ':' +sec;
    return time;
  }
};