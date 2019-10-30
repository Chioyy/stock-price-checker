/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
const fetch = require("node-fetch");
const CONNECTION_STRING = process.env.DB;
const token = process.env.Token;
var stock;
var stock2;
var url;

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      let ip = req.connection.remoteAddress;
      let ipArray;
      let likes = 0;
      let likes2 = 0;
      if (Array.isArray(req.query.stock) == true) {
        stock = req.query.stock[0];
        stock2 = req.query.stock[1];
        url = "https://cloud.iexapis.com/stable/tops?token=" + token + "&symbols=" + stock + "," + stock2;
      }
      else {
        stock = req.query.stock;
        url = "https://cloud.iexapis.com/stable/tops?token=" + token + "&symbols=" + stock;
      } 
      if (req.query.like == true || req.query.like == "true") {
        likes = 1;
        likes2 = 1;
      }

      MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("stock-price-checker");
          dbo.collection("stocks").findOne({stock: stock}, function(err, info) {
            if (err) throw err;
            dbo.collection("stocks").findOne({stock: stock2}, function(err, info2) {        
              if (info != null) {
                likes = info.likes + likes;
                ipArray = [info.ip];
              }
              if (info2 != null) {    
                likes2 = info2.likes + likes2;
                ipArray = [info2.ip];
              }
  
              const getData = async url => {
                try {
                  const response = await fetch(url);
                  const data = await response.json();
                  if (info == null) {
                    ipArray = [].push(ip);
                    dbo.collection("stocks").insertOne({
                      stock: data[0].symbol.toLowerCase(),
                      price: data[0].lastSalePrice,
                      likes: likes,
                      ip: ipArray
                      }, (err, result) => {
                        if (err) return (err);
                      })
                  }
                  else if (req.query.like = true) {
                    likes = Number(info.likes);
                    if (!ipArray.includes(info.ip)) {
                      likes = likes + 1;
                      ipArray.push(ip);
                    }  
                    dbo.collection("stocks").updateOne(
                      { _id: info._id },
                      {$set: {likes: likes,
                              ip: ipArray},     
                        },(err, updateInfo) => {
                         if (err) return (err);  
                       });
                  }
                  if (info2 == null && Array.isArray(req.query.stock) == true) {
                    info2 = "a";
                    ipArray = [].push(ip);
                    dbo.collection("stocks").insertOne({
                      stock: data[1].symbol.toLowerCase(),
                      price: data[1].lastSalePrice,
                      likes: likes2,
                      ip: ipArray
                      }, (err, result) => {
                        if (err) return (err);
                      })
                  }
                  else if (req.query.like = true && Array.isArray(req.query.stock) == true) {
                    likes2 = Number(info.likes2);
                    if (!ipArray.includes(info2.ip)) {
                      likes2 = likes2 + 1;
                      ipArray.push(ip);
                    }  
                    dbo.collection("stocks").updateOne(
                      { _id: info2._id },
                      {$set: {likes: likes2,
                              ip: ipArray}
                      },(err, updateInfo) => {
                        if (err) return (err);  
                      });
                  }                  
                  
                  if (info2 == null) 
                    return res.json({"stockData":{"stock": data[0].symbol.toLowerCase(),"price": data[0].lastSalePrice,"likes": likes}});       
                  else 
                    return res.json({"stockData":[{"stock": data[0].symbol.toLowerCase(),"price": data[0].lastSalePrice,"rel_likes": likes - likes2},
                                                  {"stock": data[1].symbol.toLowerCase(),"price": data[1].lastSalePrice,"rel_likes": likes2 - likes}]});
                  
                } catch (error) {
                  console.log(error);
                }       
              }                
              getData(url);
              db.close();
            });
            db.close();
          });
      });     
   });    
};