/**
 * Created by Maddie on 3/6/2015.
 */

var assert = require('assert');
var should = require('should');
var request = require('supertest');
request = request('http://localhost:3000');

describe('search', function() {
    it('should return all documents within default range', function() {
        var baseUrl = '/search',
            lat = '37.9485440',
            long = '-91.7715300';
        request
            .get(baseUrl + '/lat=' + lat + '&long=' + long)
            .expect(200);
    });
    it('should return all documents within 10 miles', function() {
        var baseUrl = '/search',
            lat = '37.9485440',
            long = '-91.7715300',
            dist = '16093';
        request
            .get(baseUrl + '/lat=' + lat + '&long=' + long + '&dist=' + dist)
            .expect(res.body[0].dist.should.be.lessThanOrEqual(0.00252))
            .expect(200);
    });
    it('should return all collectibles within default range', function() {
        var baseUrl = '/search',
            lat = '37.9485440',
            long = '-91.7715300',
            query = '{ category: "SANT" }';
        request
            .get(baseUrl + '/lat=' + lat + '&long=' + long + '&query=' + query)
            .expect(200);
    });
    it('should return all collectibles within 10 miles', function() {
        var baseUrl = '/search',
            lat = '37.9485440',
            long = '-91.7715300',
            query = '{ category: "SANT" }',
            dist = '16093';
        request
            .get(baseUrl + '/lat=' + lat + '&long=' + long + '&dist=' + dist + '&query=' + query)
            .expect(res.body[0].dis.should.be.lessThanOrEqual(0.00252))
            .expect(200);

    });
    it('should return the second page of documents', function() {
        var baseUrl = '/search',
            lat = '37.9485440',
            long = '-91.7715300',
            page = '2';
        request
            .get(baseUrl + '/lat=' + lat + '&long=' + long + '&page=' + page)
            .expect(200);
    });
    it('should fail because of missing parameters', function() {
        var baseUrl = '/search',
            long = '-91.7715300',
            dist = '16093';
        request
            .get(baseUrl + '&long=' + long + '&dist=' + dist)
            .expect(400);
    });
    it('should fail because of invalid parameters', function() {
        var baseUrl = '/search',
            lat = 'invalid',
            long = '-91.7715300',
            dist = '16093';
        request
            .get(baseUrl + '/lat=' + lat + '&long=' + long + '&dist=' + dist)
            .expect(400);
    });
});

describe('item', function() {
    it('should return information', function () {
        assert(false);
    });
    it('should fail because of invalid parameters', function() {
        assert(false);
    });
});