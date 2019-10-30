/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
     
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'cah'})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.property(res.body.stockData, 'stock', 'stock property missing');
          assert.property(res.body.stockData, 'price', 'price property missing');
          assert.property(res.body.stockData, 'likes', 'likes property missing');
          assert.equal(res.body.stockData.stock, 'cah', 'stock name missing');
          done();
        }); 
      });
        
      test('1 stock with like', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'cbl', like: true})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.property(res.body.stockData, 'stock', 'stock property missing');
          assert.property(res.body.stockData, 'price', 'price property missing');
          assert.property(res.body.stockData, 'likes', 'likes property missing');
          assert.equal(res.body.stockData.stock, 'cbl', 'stock name missing');
          assert.isAtLeast(res.body.stockData.likes, 1, 'like is missing');
          done();
        });
        
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'cbm', like: true})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.property(res.body.stockData, 'stock', 'stock property missing');
          assert.property(res.body.stockData, 'price', 'price property missing');
          assert.property(res.body.stockData, 'likes', 'likes property missing');
          assert.equal(res.body.stockData.stock, 'cbm', 'stock name missing');
          assert.isAtLeast(res.body.stockData.likes, 1, 'like is missing');
          done();
        });
      });
      
      test('2 stocks', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['cc','cci']})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.property(res.body.stockData[0], 'stock', 'stock property missing');
          assert.property(res.body.stockData[0], 'price', 'price property missing');
          assert.property(res.body.stockData[0], 'rel_likes', 'likes property missing');
          assert.equal(res.body.stockData[0].stock, 'cc', 'stock name missing');
          assert.property(res.body.stockData[1], 'stock', 'stock property missing');
          assert.property(res.body.stockData[1], 'price', 'price property missing');
          assert.property(res.body.stockData[1], 'rel_likes', 'likes property missing');
          assert.equal(res.body.stockData[1].stock, 'cci', 'stock name missing');
          done();
        });
      });
      
      test('2 stocks with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['ccj','cck'], like: true})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.property(res.body.stockData[0], 'stock', 'stock property missing');
          assert.property(res.body.stockData[0], 'price', 'price property missing');
          assert.property(res.body.stockData[0], 'rel_likes', 'likes property missing');
          assert.equal(res.body.stockData[0].stock, 'ccj', 'stock name missing');
          assert.property(res.body.stockData[1], 'stock', 'stock property missing');
          assert.property(res.body.stockData[1], 'price', 'price property missing');
          assert.property(res.body.stockData[1], 'rel_likes', 'likes property missing');
          assert.equal(res.body.stockData[1].stock, 'cck', 'stock name missing');
          done();
        }); 
      });
      
    });

});