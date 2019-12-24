require('custom-env').env(process.env.APP_ENV); //?
import mongoose from 'mongoose' //mongoose va nous permettre de faire des tests sur mongodb
import { UserSchema } from '../src/ModelOfUsers';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../src/server');
let should = chai.should();

chai.use(chaiHttp);

const User = mongoose.model('User', UserSchema);
var UserTest= new User({
        firstName: "adaFs",
        lastname: "adaLs",
        username: "adaUser",
        password: "adaPass"
    });

    describe('Tests', () => {
        before((done) => {
            mongoose.connect(`mongodb://localhost:27017/myuusers`, {useNewUrlParser: true, useUnifiedTopology: true})
            .then(() => {
                done();
            })
        });
    
        after((done) => {
            mongoose.connection.close();
            done();
        });
    
        //TEST de la DB
        describe('Database Tests', () => {
            it('Add User', (done) => { //Test de l'ajout d'user
                User.create(UserTest).then((doc) => {
                    done();
                })
            });
    
            it('Get User', (done) => { //test d'obtention user
                User.findOne({ username: 'adaUser' }).then((doc) => {
                    chai.expect(doc).to.exist;
                    done();
                })
            });
        });

        describe('API Tests', () => {
            let token;
            let userLog;
            let user = {
                firstName: "adaFs",
                lastname: "adaLs",
                username: "adaUser",
                password: "adaPass"
            }
            it('Add Metrics', (done) => {
                chai.request(server)
                    .post('/profile/add-metric')
                    .set({ token: token})
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.userId.should.be.eq(userLog._id);
                        done();
                    })
                });
          
               it('Access Metrics data', (done) => {
                  chai.request(server)
                      .get('/profile/metrics')
                      .set({ token: token})
                      .end((err, res) => {
                          res.should.have.status(200);
                          res.body[0].userId.should.be.eq(userLog._id);
                          done();
                      })
                  });

    });

});
    export = {};