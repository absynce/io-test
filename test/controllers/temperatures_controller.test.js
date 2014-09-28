var app, compound
, request = require('supertest')
, sinon   = require('sinon');

function TemperatureStub () {
    return {
        value: '',
        readingOn: '',
        timestamp: ''
    };
}

describe('TemperatureController', function() {
    beforeEach(function(done) {
        app = getApp();
        compound = app.compound;
        compound.on('ready', function() {
            done();
        });
    });

    /*
     * GET /temperatures/new
     * Should render temperatures/new.ejs
     */
    it('should render "new" template on GET /temperatures/new', function (done) {
        request(app)
        .get('/temperatures/new')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didRender(/temperatures\/new\.ejs$/i).should.be.true;
            done();
        });
    });

    /*
     * GET /temperatures
     * Should render temperatures/index.ejs
     */
    it('should render "index" template on GET /temperatures', function (done) {
        request(app)
        .get('/temperatures')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didRender(/temperatures\/index\.ejs$/i).should.be.true;
            done();
        });
    });

    /*
     * GET /temperatures/:id/edit
     * Should access Temperature#find and render temperatures/edit.ejs
     */
    it('should access Temperature#find and render "edit" template on GET /temperatures/:id/edit', function (done) {
        var Temperature = app.models.Temperature;

        // Mock Temperature#find
        Temperature.find = sinon.spy(function (id, callback) {
            callback(null, new Temperature);
        });

        request(app)
        .get('/temperatures/42/edit')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Temperature.find.calledWith('42').should.be.true;
            app.didRender(/temperatures\/edit\.ejs$/i).should.be.true;

            done();
        });
    });

    /*
     * GET /temperatures/:id
     * Should render temperatures/index.ejs
     */
    it('should access Temperature#find and render "show" template on GET /temperatures/:id', function (done) {
        var Temperature = app.models.Temperature;

        // Mock Temperature#find
        Temperature.find = sinon.spy(function (id, callback) {
            callback(null, new Temperature);
        });

        request(app)
        .get('/temperatures/42')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Temperature.find.calledWith('42').should.be.true;
            app.didRender(/temperatures\/show\.ejs$/i).should.be.true;

            done();
        });
    });

    /*
     * POST /temperatures
     * Should access Temperature#create when Temperature is valid
     */
    it('should access Temperature#create on POST /temperatures with a valid Temperature', function (done) {
        var Temperature = app.models.Temperature
        , temperature = new TemperatureStub;

        // Mock Temperature#create
        Temperature.create = sinon.spy(function (data, callback) {
            callback(null, temperature);
        });

        request(app)
        .post('/temperatures')
        .send({ "Temperature": temperature })
        .end(function (err, res) {
            res.statusCode.should.equal(302);
            Temperature.create.calledWith(temperature).should.be.true;

            done();
        });
    });

    /*
     * POST /temperatures
     * Should fail when Temperature is invalid
     */
    it('should fail on POST /temperatures when Temperature#create returns an error', function (done) {
        var Temperature = app.models.Temperature
        , temperature = new TemperatureStub;

        // Mock Temperature#create
        Temperature.create = sinon.spy(function (data, callback) {
            callback(new Error, temperature);
        });

        request(app)
        .post('/temperatures')
        .send({ "Temperature": temperature })
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Temperature.create.calledWith(temperature).should.be.true;

            app.didFlash('error').should.be.true;

            done();
        });
    });

    /*
     * PUT /temperatures/:id
     * Should redirect back to /temperatures when Temperature is valid
     */
    it('should redirect on PUT /temperatures/:id with a valid Temperature', function (done) {
        var Temperature = app.models.Temperature
        , temperature = new TemperatureStub;

        Temperature.find = sinon.spy(function (id, callback) {
            callback(null, {
                id: 1,
                updateAttributes: function (data, cb) { cb(null) }
            });
        });

        request(app)
        .put('/temperatures/1')
        .send({ "Temperature": temperature })
        .end(function (err, res) {
            res.statusCode.should.equal(302);
            res.header['location'].should.include('/temperatures/1');

            app.didFlash('error').should.be.false;

            done();
        });
    });

    /*
     * PUT /temperatures/:id
     * Should not redirect when Temperature is invalid
     */
    it('should fail / not redirect on PUT /temperatures/:id with an invalid Temperature', function (done) {
        var Temperature = app.models.Temperature
        , temperature = new TemperatureStub;

        Temperature.find = sinon.spy(function (id, callback) {
            callback(null, {
                id: 1,
                updateAttributes: function (data, cb) { cb(new Error) }
            });
        });

        request(app)
        .put('/temperatures/1')
        .send({ "Temperature": temperature })
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didFlash('error').should.be.true;

            done();
        });
    });

    /*
     * DELETE /temperatures/:id
     * -- TODO: IMPLEMENT --
     */
    it('should delete a Temperature on DELETE /temperatures/:id');

    /*
     * DELETE /temperatures/:id
     * -- TODO: IMPLEMENT FAILURE --
     */
    it('should not delete a Temperature on DELETE /temperatures/:id if it fails');
});
